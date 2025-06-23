# 🎉 Visitor Attendance Web App with Firebase

A simple and powerful QR-based attendance system built with **HTML**, **JavaScript**, and **Firebase Realtime Database**.

-----

## 📋 Features

  - ✅ **Real-time Attendance Recording**
  - 📷 **QR Code Scanner (html5-qrcode)**
  - ⚠️ **Duplicate Attendance Detection**
  - 📊 **Filter, Sort, and Export Visitor List to CSV**
  - 🔒 **Admin Authentication for Data Reset**
  - 🖨️ **QR Code Generator with PNG, ZIP, and PDF Export**
  - 🎉 **Live Welcome Screen with Real-time Visitor Display**

-----

## 🛠️ Tech Stack

  - **HTML5 & CSS3** 🎨
  - **JavaScript (ES6+)** 💻
  - **Firebase Realtime Database** ☁️
  - **Firebase Authentication** 🔐
  - **html5-qrcode** 📱
  - **FileSaver.js** 💾
  - **jsPDF & JSZip** 🗂️
  - **Tailwind CSS** 🎨

-----

## 📂 Project Structure

```text
📁 absen-haflah-main/
├── 📄 index.html              # Main Menu
├── 📄 README.md               # Project Documentation
├── 📁 css/                    # Stylesheets
│   ├── 📄 styles.css          # Main styles
│   └── 📄 login.css           # Login page styles
├── 📁 js/                     # JavaScript files
│   └── 📄 login.js            # Login functionality
├── 📁 assets/                 # Media files
│   ├── 📄 LOGO.png            # Application logo
│   └── 📄 pattern.png         # Background pattern
└── 📁 pages/                  # HTML pages
    ├── 📄 barcode_generator.html  # QR Code Generator
    ├── 📄 dashboard.html          # Admin Dashboard
    ├── 📄 login.html              # Admin Login Page
    ├── 📄 scanner.html            # QR Code Scanner
    ├── 📄 tamu.html               # Visitor List & Admin Dashboard
    └── 📄 welcome.html            # Dynamic Welcome Display
```

-----

## ⚙️ Firebase Setup

### 1\. Create Firebase Project

Go to [Firebase Console](https://console.firebase.google.com/). Create a new project and register a Web App.

### 2\. Enable Services

#### Realtime Database:

Go to `Build > Realtime Database` and create a database.

**Recommended Security Rules:**

```json
{
  "rules": {
    "pengunjung": {
      ".read": true,
      ".write": "auth != null"
    }
  }
}
```

⚡ **For public write access (not recommended):**

```json
{
  "rules": {
    "pengunjung": {
      ".read": true,
      ".write": true
    }
  }
}
```

#### Authentication:

Enable `Email/Password` in `Build > Authentication > Sign-in Method`.

#### Create Admin Account:

Add an admin user for the data reset feature.

### 📝 Firebase Configuration

Update this in `js/login.js`:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};
```

-----

## 🚀 How to Use

### 🖨️ Generate QR Codes

Use `pages/barcode_generator.html` to create visitor QR codes.

### 📱 Scan Attendance

Open `pages/scanner.html` on a smartphone to scan QR codes.

### 🎉 Welcome Visitors

Display `pages/welcome.html` on a large screen to show real-time greetings.

### 📋 Manage Visitors

Open `pages/tamu.html` to view, filter, sort, export, or reset visitor data. Reset data requires admin login from `pages/login.html`.

-----

## 🔒 Security Tips

  - Public write access is **NOT safe** for production.
  - Always prefer authentication for write access.
  - For advanced security, consider using Firebase Cloud Functions.

-----

## 🎯 Pages Overview

| Page                 | Description                         |
| :------------------- | :---------------------------------- |
| `index.html`         | Main Menu                           |
| `pages/scanner.html`       | QR Code Scanner                     |
| `pages/tamu.html`          | Visitor List (with Admin Reset)     |
| `pages/login.html`         | Admin Login Page                    |
| `pages/welcome.html`       | Dynamic Welcome Display             |
| `pages/barcode_generator.html` | QR Code Generator and Export Tool |

-----

## 🎨 Customization

### Styling
- Edit `css/styles.css` for main page styling
- Edit `css/login.css` for login page styling
- All pages use Tailwind CSS for responsive design

### JavaScript
- Edit `js/login.js` for login functionality
- Each page has its own JavaScript embedded for specific features

### Assets
- Place images in `assets/` folder
- Update image paths in HTML files accordingly

-----

## 📱 Responsive Design

All pages are optimized for:
- Desktop (1920x1080+)
- Tablet (768px+)
- Mobile (320px+)

-----

## 🐛 Troubleshooting

### Scanner Issues
- Ensure browser camera permissions
- Use HTTPS (Firebase requirement)
- Check browser console for errors

### Login Issues
- Verify Firebase configuration
- Check email/password credentials
- Ensure internet connection

### Data Issues
- Check Firebase Realtime Database rules
- Verify user authentication
- Check browser console for errors

-----

## 📜 License

This project is licensed under the MIT License.

-----

## 🚀 Happy Scanning!

-----

**Dibuat dengan ❤️ untuk acara Haflah**
