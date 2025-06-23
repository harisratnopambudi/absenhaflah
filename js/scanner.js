// Konfigurasi Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCMNdxvmAhrKgfwKNzPmSlfFtrbhlawYXE",
    authDomain: "absen-tamu-undangan-haflah.firebaseapp.com",
    databaseURL: "https://absen-tamu-undangan-haflah-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "absen-tamu-undangan-haflah",
    storageBucket: "absen-tamu-undangan-haflah.firebasestorage.app",
    messagingSenderId: "298086025599",
    appId: "1:298086025599:web:818f9a8cd794f0f023724a",
    measurementId: "G-P5E6HY528V"
};

// Inisialisasi Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const visitorsRef = database.ref('pengunjung'); 

const html5QrCode = new Html5Qrcode("reader");
let isScanning = false; 

const readerDiv = document.getElementById('reader');
const resultDiv = document.getElementById('result');
const statusDiv = document.getElementById('status');
const loadingMessageDiv = document.getElementById('loading-message');

// Panggil startScanner langsung saat DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    loadingMessageDiv.style.display = 'none'; // Pastikan pesan loading disembunyikan
    startScanner();
});

/**
 * Fungsi untuk memulai pemindaian QR code.
 */
function startScanner() {
    if (isScanning) return; 
    isScanning = true;
    statusDiv.className = 'scanning-message';
    statusDiv.textContent = 'Siap memindai...';
    resultDiv.textContent = 'Hasil Scan: Belum ada';

    html5QrCode.start(
        { facingMode: "environment" }, // Menggunakan kamera belakang
        {
            fps: 10,    // Frame per detik
            qrbox: { width: 250, height: 250 } // Ukuran kotak pemindaian
        },
        onScanSuccess,
        onScanFailure
    ).catch((err) => {
        statusDiv.className = 'error-message';
        statusDiv.textContent = `Gagal memulai kamera: ${err.message}. Pastikan izin kamera diberikan.`;
        console.error("Gagal memulai kamera:", err);
        isScanning = false;
    });
}

/**
 * Fungsi untuk membuat ID unik dari nama dan kelas.
 * Digunakan sebagai kunci di Firebase untuk melacak kehadiran.
 * @param {string} nama - Nama pengunjung.
 * @param {string} kelas - Kelas pengunjung.
 * @returns {string} ID unik yang dinormalisasi.
 */
function createUniqueVisitorId(nama, kelas) {
    // Ubah ke huruf kecil, ganti spasi dengan underscore, hapus karakter non-alfanumerik
    const normalizedNama = nama.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
    const normalizedKelas = kelas.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
    return `${normalizedNama}_${normalizedKelas}`;
}

/**
 * Fungsi yang dipanggil ketika QR code berhasil dipindai.
 * Memeriksa kehadiran, mengirim data, dan menghentikan pemindai sementara.
 * @param {string} decodedText - Teks yang berhasil didekode dari QR code (diharapkan JSON string).
 * @param {object} decodedResult - Objek hasil lengkap dari library pemindai.
 */
async function onScanSuccess(decodedText, decodedResult) {
    html5QrCode.stop().then(async () => {
        isScanning = false; // Set isScanning ke false setelah berhenti

        let visitorData = { nama: 'Tidak Diketahui', kelas: 'Tidak Diketahui' };
        try {
            const parsedData = JSON.parse(decodedText);
            if (parsedData && typeof parsedData === 'object' && parsedData.nama) {
                visitorData.nama = parsedData.nama;
                visitorData.kelas = parsedData.kelas || 'Tidak Diketahui';
            } else {
                // Jika bukan JSON atau tidak ada 'nama', gunakan teks asli sebagai nama
                visitorData.nama = decodedText;
                visitorData.kelas = 'Tidak Diketahui';
                console.warn("QR Code tidak dalam format JSON yang diharapkan, menggunakan teks asli sebagai nama.");
            }
        } catch (e) {
            // Jika gagal parsing JSON, gunakan teks asli sebagai nama
            visitorData.nama = decodedText;
            visitorData.kelas = 'Tidak Diketahui';
            console.warn("Gagal parsing QR Code sebagai JSON, menggunakan teks asli sebagai nama.", e);
        }

        const uniqueVisitorId = createUniqueVisitorId(visitorData.nama, visitorData.kelas);
        resultDiv.textContent = `Hasil Scan: ${visitorData.nama} (${visitorData.kelas})`;
        statusDiv.className = 'scanning-message';
        statusDiv.textContent = 'Memeriksa kehadiran...';

        try {
            // Cek apakah pengunjung sudah ada di database
            const snapshot = await visitorsRef.child(uniqueVisitorId).once('value');
            
            if (snapshot.exists() && snapshot.val().status === 'hadir') {
                // Pengunjung sudah hadir
                statusDiv.className = 'already-present-message';
                statusDiv.textContent = `${visitorData.nama} (${visitorData.kelas}) Sudah Hadir!`;
            } else {
                // Pengunjung belum hadir, simpan data kehadiran
                statusDiv.textContent = 'Mengirim data kehadiran...';
                await visitorsRef.child(uniqueVisitorId).set({
                    nama: visitorData.nama,
                    kelas: visitorData.kelas, 
                    timestamp: firebase.database.ServerValue.TIMESTAMP,
                    status: 'hadir' // Menandai status kehadiran
                });
                statusDiv.className = 'status-message';
                statusDiv.textContent = 'Kehadiran berhasil dicatat! Silakan pindai barcode berikutnya...';
            }
        } catch (error) {
            statusDiv.className = 'error-message';
            statusDiv.textContent = `Gagal memproses kehadiran: ${error.message}. Coba lagi.`;
            console.error("Firebase Process Error:", error); 
        } finally {
            // Selalu mulai ulang pemindai setelah jeda, terlepas dari sukses/gagal
            setTimeout(() => {
                startScanner();
            }, 3000); // Jeda 3 detik
        }
    }).catch((err) => {
        console.error("Gagal menghentikan pemindai:", err);
        isScanning = false; // Pastikan isScanning direset jika stop gagal
        setTimeout(() => {
            startScanner();
        }, 3000); // Coba mulai ulang pemindai setelah jeda
    });
}

function onScanFailure(error) {
    // Ini akan dipanggil terus-menerus jika tidak ada QR code yang terdeteksi
    // Biasanya tidak perlu menampilkan pesan error di UI untuk setiap kegagalan frame
    // console.warn(`Code scan error = ${error}`);
} 