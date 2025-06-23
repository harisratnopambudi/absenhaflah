// Common JavaScript Functions

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
const auth = firebase.auth();

// Utility Functions

/**
 * Format tanggal ke format yang mudah dibaca
 * @param {number} timestamp - Timestamp Firebase
 * @returns {string} Tanggal yang diformat
 */
function formatDate(timestamp) {
    if (!timestamp) return 'Tidak diketahui';
    
    const date = new Date(timestamp);
    return date.toLocaleString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

/**
 * Format waktu ke format yang mudah dibaca
 * @param {number} timestamp - Timestamp Firebase
 * @returns {string} Waktu yang diformat
 */
function formatTime(timestamp) {
    if (!timestamp) return 'Tidak diketahui';
    
    const date = new Date(timestamp);
    return date.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

/**
 * Menampilkan pesan alert
 * @param {string} message - Pesan yang akan ditampilkan
 * @param {string} type - Tipe alert (success, danger, warning, info)
 */
function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    
    // Tambahkan ke body
    document.body.insertBefore(alertDiv, document.body.firstChild);
    
    // Hapus setelah 5 detik
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.parentNode.removeChild(alertDiv);
        }
    }, 5000);
}

/**
 * Menampilkan loading spinner
 * @param {boolean} show - Tampilkan atau sembunyikan spinner
 */
function showLoading(show = true) {
    let spinner = document.getElementById('loading-spinner');
    
    if (show) {
        if (!spinner) {
            spinner = document.createElement('div');
            spinner.id = 'loading-spinner';
            spinner.className = 'spinner';
            document.body.appendChild(spinner);
        }
        spinner.style.display = 'block';
    } else {
        if (spinner) {
            spinner.style.display = 'none';
        }
    }
}

/**
 * Validasi email
 * @param {string} email - Email yang akan divalidasi
 * @returns {boolean} True jika email valid
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validasi nomor telepon
 * @param {string} phone - Nomor telepon yang akan divalidasi
 * @returns {boolean} True jika nomor telepon valid
 */
function isValidPhone(phone) {
    const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{6,9}$/;
    return phoneRegex.test(phone);
}

/**
 * Debounce function untuk mengurangi frekuensi pemanggilan fungsi
 * @param {Function} func - Fungsi yang akan di-debounce
 * @param {number} wait - Waktu tunggu dalam milidetik
 * @returns {Function} Fungsi yang sudah di-debounce
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function untuk membatasi frekuensi pemanggilan fungsi
 * @param {Function} func - Fungsi yang akan di-throttle
 * @param {number} limit - Batas waktu dalam milidetik
 * @returns {Function} Fungsi yang sudah di-throttle
 */
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

/**
 * Export data ke CSV
 * @param {Array} data - Data yang akan diexport
 * @param {string} filename - Nama file
 */
function exportToCSV(data, filename = 'export.csv') {
    if (!data || data.length === 0) {
        showAlert('Tidak ada data untuk diexport', 'warning');
        return;
    }
    
    const headers = Object.keys(data[0]);
    const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

/**
 * Download file dari URL
 * @param {string} url - URL file yang akan didownload
 * @param {string} filename - Nama file
 */
function downloadFile(url, filename) {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/**
 * Copy text ke clipboard
 * @param {string} text - Text yang akan dicopy
 * @returns {Promise<boolean>} True jika berhasil
 */
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showAlert('Text berhasil dicopy ke clipboard', 'success');
        return true;
    } catch (err) {
        console.error('Gagal copy ke clipboard:', err);
        showAlert('Gagal copy ke clipboard', 'danger');
        return false;
    }
}

/**
 * Generate ID unik
 * @returns {string} ID unik
 */
function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Sanitasi input untuk mencegah XSS
 * @param {string} input - Input yang akan disanitasi
 * @returns {string} Input yang sudah disanitasi
 */
function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

/**
 * Parse JSON dengan error handling
 * @param {string} jsonString - String JSON yang akan di-parse
 * @returns {object|null} Object hasil parse atau null jika gagal
 */
function safeJsonParse(jsonString) {
    try {
        return JSON.parse(jsonString);
    } catch (error) {
        console.error('Gagal parse JSON:', error);
        return null;
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Auto-hide alerts after 5 seconds
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
        setTimeout(() => {
            if (alert.parentNode) {
                alert.parentNode.removeChild(alert);
            }
        }, 5000);
    });
    
    // Add loading state to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            if (!this.disabled) {
                this.disabled = true;
                const originalText = this.textContent;
                this.textContent = 'Loading...';
                
                setTimeout(() => {
                    this.disabled = false;
                    this.textContent = originalText;
                }, 2000);
            }
        });
    });
}); 