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
const auth = firebase.auth(); // Dapatkan instance Firebase Auth

// DOM Elements
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('loginBtn');
const messageElement = document.getElementById('message');

// Elemen Modal Informasi
const infoModal = document.getElementById('infoModal');
const infoModalMessage = document.getElementById('infoModalMessage');
const infoModalOk = document.getElementById('infoModalOk');

/**
 * Menampilkan modal informasi kustom.
 * @param {string} message - Pesan yang akan ditampilkan di modal.
 * @param {function} [onCloseCallback] - Fungsi yang akan dipanggil saat modal ditutup.
 */
function showInfoModal(message, onCloseCallback = null) {
    infoModalMessage.textContent = message;
    infoModal.classList.add('visible');
    // Menambahkan event listener sementara untuk tombol OK
    infoModalOk.onclick = () => {
        hideInfoModal();
        if (onCloseCallback) {
            onCloseCallback();
        }
    };
}

/**
 * Menyembunyikan modal informasi kustom.
 */
function hideInfoModal() {
    infoModal.classList.remove('visible');
    infoModalOk.onclick = null; // Hapus event listener untuk mencegah duplikasi
}

// Event listener untuk tombol Login
loginBtn.addEventListener('click', async () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
        messageElement.textContent = "Email dan password tidak boleh kosong.";
        return;
    }

    messageElement.textContent = "Sedang login...";
    try {
        // Melakukan sign-in dengan email dan password
        await auth.signInWithEmailAndPassword(email, password);
        messageElement.textContent = ""; // Bersihkan pesan
        showInfoModal("Login berhasil! Anda akan dialihkan.", () => {
            // Redirect ke halaman utama setelah login berhasil
            window.location.href = 'tamu.html'; // Redirect ke halaman tamu di folder yang sama
        });
    } catch (error) {
        console.error("Login Error:", error.code, error.message);
        let errorMessage = "Terjadi kesalahan saat login.";
        switch (error.code) {
            case 'auth/user-not-found':
            case 'auth/wrong-password':
                errorMessage = "Email atau password salah.";
                break;
            case 'auth/invalid-email':
                errorMessage = "Format email tidak valid.";
                break;
            case 'auth/network-request-failed':
                errorMessage = "Koneksi internet bermasalah. Coba lagi.";
                break;
            default:
                errorMessage = `Login gagal: ${error.message}`;
                break;
        }
        messageElement.textContent = errorMessage;
        showInfoModal(errorMessage);
    }
});

// Optional: Anda bisa menambahkan ini untuk membuat pengguna pertama kali
// HANYA JALANKAN INI SEKALI UNTUK MEMBUAT AKUN AWAL, KEMUDIAN KOMEN ATAU HAPUS!
/*
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Buat pengguna baru dengan email dan password
        const userCredential = await auth.createUserWithEmailAndPassword("admin@contoh.com", "passwordpanitia123");
        console.log("User created:", userCredential.user.email);
        showInfoModal("Akun admin@contoh.com berhasil dibuat dengan password 'passwordpanitia123'. Harap ganti password ini atau komen kode pembuatan akun.");
    } catch (error) {
        // Ini akan muncul jika pengguna sudah ada atau ada error lain
        console.error("Error creating user:", error.code, error.message);
        if (error.code === 'auth/email-already-in-use') {
            console.log("Akun admin@contoh.com sudah ada.");
        }
    }
});
*/ 