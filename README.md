# RC4 Encryption/Decryption - WebAssembly Project

A modern web application that implements RC4 encryption/decryption using C code compiled to WebAssembly (WASM) with a beautiful Next.js frontend.

![RC4 Cryptography](https://img.shields.io/badge/Algorithm-RC4-blue)
![WebAssembly](https://img.shields.io/badge/WASM-Enabled-green)
![Next.js](https://img.shields.io/badge/Next.js-14-black)

---

## 📋 Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Installation Guide](#installation-guide)
  - [Windows Installation](#windows-installation)
  - [Linux Installation](#linux-installation)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [Testing](#testing)
- [Contributors](#contributors)
- [License](#license)

---

## ✨ Features

- 🔒 **RC4 Encryption/Decryption** - Symmetric stream cipher implementation
- ⚡ **WebAssembly** - Native C performance in the browser
- 🎨 **Modern UI** - Beautiful gradient design with glassmorphism
- 📊 **Performance Metrics** - Real-time WASM file size and load time display
- 🔄 **Real-time Processing** - Instant encryption and decryption
- 📋 **Copy to Clipboard** - Easy result copying
- 📱 **Responsive Design** - Works on desktop and mobile devices

---

## 🛠️ Technologies Used

- **C** - Core RC4 algorithm implementation
- **Emscripten** - C to WebAssembly compiler
- **Next.js 14** - React framework with App Router
- **Tailwind CSS** - Utility-first CSS framework
- **JavaScript** - Frontend logic and WASM integration

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **Git** - [Download](https://git-scm.com/)
- **Python** (v3.x) - Required by Emscripten
- **Text Editor** - VS Code, Notepad++, or any code editor

---

## 🚀 Installation Guide

### Windows Installation

#### Step 1: Install Node.js

1. Download Node.js LTS from [nodejs.org](https://nodejs.org/)
2. Run the installer
3. Follow the installation wizard (use default settings)
4. Verify installation:
```cmd
node --version
npm --version
```

#### Step 2: Install Git

1. Download Git from [git-scm.com](https://git-scm.com/download/win)
2. Run the installer (use default settings)
3. Verify installation:
```cmd
git --version
```

#### Step 3: Install Emscripten

Open **Command Prompt** (not PowerShell) as Administrator:

```cmd
# Navigate to C drive
cd C:\

# Clone Emscripten SDK
git clone https://github.com/emscripten-core/emsdk.git

# Enter the directory
cd emsdk

# Install latest version
emsdk install latest

# Activate Emscripten
emsdk activate latest

# Set up environment variables for current session
emsdk_env.bat

# Verify installation
emcc --version
```

You should see output like:
```
emcc (Emscripten gcc/clang-like replacement) 4.0.x
```

#### Step 4: Create Project

```cmd
# Create project directory
mkdir C:\ITC_Assignment4
cd C:\ITC_Assignment4

# Create rc4.c file
notepad rc4.c
```

Copy the RC4 C code (provided separately) into `rc4.c` and save.

#### Step 5: Compile C to WebAssembly

```cmd
# Activate Emscripten (if new terminal)
C:\emsdk\emsdk_env.bat

# Navigate to project directory
cd C:\ITC_Assignment4

# Compile C code to WASM
emcc rc4.c -o rc4.js -s WASM=1 -s EXPORTED_RUNTIME_METHODS='["ccall","cwrap","UTF8ToString","allocateUTF8"]' -s ALLOW_MEMORY_GROWTH=1 -s MODULARIZE=1 -s EXPORT_NAME="createRC4Module"

# Verify files were created
dir
```

You should see `rc4.js` and `rc4.wasm` files created.

#### Step 6: Set Up Next.js Frontend

```cmd
# Create Next.js application
npx create-next-app@latest rc4-frontend

# Answer prompts:
# TypeScript? No
# ESLint? Yes
# Tailwind CSS? Yes
# src/ directory? No
# App Router? Yes
# Import alias? No

# Enter project directory
cd rc4-frontend

# Create wasm directory
mkdir public\wasm

# Copy WASM files
copy ..\rc4.js public\wasm\
copy ..\rc4.wasm public\wasm\

# Verify files
dir public\wasm
```

#### Step 7: Update Frontend Code

```cmd
# Open page.js in notepad
notepad app\page.js
```

Delete all content and paste the provided `page.js` code. Save and close.

#### Step 8: Run the Application

```cmd
# Start development server
npm run dev
```

Open browser and navigate to: `http://localhost:3000`

---

### Linux Installation

#### Step 1: Install Node.js

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nodejs npm

# Fedora/RHEL
sudo dnf install nodejs npm

# Verify installation
node --version
npm --version
```

#### Step 2: Install Git

```bash
# Ubuntu/Debian
sudo apt install git

# Fedora/RHEL
sudo dnf install git

# Verify installation
git --version
```

#### Step 3: Install Python (if not installed)

```bash
# Ubuntu/Debian
sudo apt install python3

# Fedora/RHEL
sudo dnf install python3

# Verify installation
python3 --version
```

#### Step 4: Install Emscripten

```bash
# Navigate to home directory
cd ~

# Clone Emscripten SDK
git clone https://github.com/emscripten-core/emsdk.git

# Enter directory
cd emsdk

# Install latest version
./emsdk install latest

# Activate Emscripten
./emsdk activate latest

# Set up environment variables
source ./emsdk_env.sh

# Verify installation
emcc --version
```

#### Step 5: Create Project

```bash
# Create project directory
mkdir -p ~/ITC_Assignment4
cd ~/ITC_Assignment4

# Create rc4.c file
nano rc4.c
# Or use: vim rc4.c
# Or use: gedit rc4.c
```

Paste the RC4 C code, save (`Ctrl+O`, `Enter`, `Ctrl+X` for nano).

#### Step 6: Compile C to WebAssembly

```bash
# Activate Emscripten (if new terminal)
source ~/emsdk/emsdk_env.sh

# Navigate to project directory
cd ~/ITC_Assignment4

# Compile C code to WASM
emcc rc4.c -o rc4.js \
  -s WASM=1 \
  -s EXPORTED_RUNTIME_METHODS='["ccall","cwrap","UTF8ToString","allocateUTF8"]' \
  -s ALLOW_MEMORY_GROWTH=1 \
  -s MODULARIZE=1 \
  -s EXPORT_NAME="createRC4Module"

# Verify files were created
ls -lh
```

#### Step 7: Set Up Next.js Frontend

```bash
# Create Next.js application
npx create-next-app@latest rc4-frontend

# Answer prompts same as Windows

# Enter project directory
cd rc4-frontend

# Create wasm directory
mkdir -p public/wasm

# Copy WASM files
cp ../rc4.js public/wasm/
cp ../rc4.wasm public/wasm/

# Verify files
ls -lh public/wasm/
```

#### Step 8: Update Frontend Code

```bash
# Open page.js in your preferred editor
nano app/page.js
# Or: vim app/page.js
# Or: code app/page.js (VS Code)
```

Delete all content and paste the provided `page.js` code. Save and close.

#### Step 9: Run the Application

```bash
# Start development server
npm run dev
```

Open browser and navigate to: `http://localhost:3000`

---

## 📁 Project Structure

```
ITC_Assignment4/
├── rc4.c                           # C source code
├── rc4.js                          # Generated JavaScript glue code
├── rc4.wasm                        # Generated WebAssembly binary
│
└── rc4-frontend/                   # Next.js application
    ├── node_modules/               # Dependencies
    ├── public/
    │   └── wasm/
    │       ├── rc4.js              # WASM JavaScript loader
    │       └── rc4.wasm            # WASM binary file
    ├── app/
    │   ├── page.js                 # Main application page
    │   ├── layout.js               # Layout component
    │   └── globals.css             # Global styles
    ├── package.json                # Project dependencies
    ├── next.config.js              # Next.js configuration
    └── tailwind.config.js          # Tailwind CSS configuration
```

---

## 🎮 Usage

### Encryption

1. Enter your message in the "Message" text box
2. Enter a secret key in the "Secret Key" field
3. Click the **Encrypt** button
4. Copy the hexadecimal result

### Decryption

1. Paste the hexadecimal encrypted text in the "Message" box
2. Enter the same secret key used for encryption
3. Click the **Decrypt** button
4. View the decrypted original message

### Example

**Encrypt:**
- Message: `Hello World`
- Key: `secret`
- Result: `45a01f645fc35b383552544f62`

**Decrypt:**
- Message: `45a01f645fc35b383552544f62`
- Key: `secret`
- Result: `Hello World`

---

## 🧪 Testing

### Test Case 1: Basic Encryption/Decryption
```
Input: "Hello World"
Key: "secret"
Expected: Should encrypt and decrypt back to "Hello World"
```

### Test Case 2: Long Text
```
Input: "This is a longer message to test RC4 encryption with multiple words."
Key: "mykey123"
Expected: Should handle long text properly
```

### Test Case 3: Special Characters
```
Input: "Test@123!#$"
Key: "testkey"
Expected: Should preserve special characters
```

### Test Case 4: Numbers
```
Input: "1234567890"
Key: "numkey"
Expected: Should handle numeric input
```

---


- **Objective:** Implement RC4 algorithm in C, compile to WebAssembly, and create a Next.js frontend

---

## 🐛 Troubleshooting

### Issue: `emcc: command not found`

**Windows:**
```cmd
C:\emsdk\emsdk_env.bat
```

**Linux:**
```bash
source ~/emsdk/emsdk_env.sh
```

### Issue: WASM module not loading

1. Verify files exist:
```cmd
# Windows
dir C:\ITC_Assignment4\rc4-frontend\public\wasm

# Linux
ls -lh ~/ITC_Assignment4/rc4-frontend/public/wasm/
```

2. Check browser console (F12) for errors
3. Clear browser cache and reload

### Issue: Decryption returns garbage

- Ensure you're using the **same key** for encryption and decryption
- Verify the hex input is valid (only 0-9, a-f, A-F characters)
- Make sure hex string has even number of characters

### Issue: Port 3000 already in use

**Windows:**
```cmd
netstat -ano | findstr :3000
taskkill /PID [PID_NUMBER] /F
```

**Linux:**
```bash
lsof -ti:3000 | xargs kill -9
```

Or use a different port:
```bash
npm run dev -- -p 3001
```

---

## 🔒 Security Note

**Important:** RC4 is a legacy algorithm and should **NOT** be used for production security purposes. This implementation is for **educational purposes only** as part of a cryptography course assignment.

Modern applications should use:
- AES (Advanced Encryption Standard)
- ChaCha20
- Other contemporary encryption algorithms

---

## 📚 Learning Outcomes

By completing this project, students learn:

1. ✅ How to compile C code to WebAssembly using Emscripten
2. ✅ How to expose C functions to JavaScript
3. ✅ How to call native C code from a Next.js frontend
4. ✅ How to handle memory management between JavaScript and WASM
5. ✅ Understanding of RC4 stream cipher algorithm
6. ✅ Modern web development with Next.js and React
7. ✅ Performance optimization with WebAssembly

---

## 📄 License

This project is created for educational purposes as part of the Introduction to Cryptography course.

---

## 🔗 Useful Links

- [Emscripten Documentation](https://emscripten.org/docs/)
- [Next.js Documentation](https://nextjs.org/docs)
- [WebAssembly Official Site](https://webassembly.org/)
- [RC4 Algorithm Explanation](https://en.wikipedia.org/wiki/RC4)
- [Node.js Download](https://nodejs.org/)

---

## 📞 Support

If you encounter any issues during installation or usage:

1. Check the Troubleshooting section above
2. Verify all prerequisites are installed correctly
3. Ensure you're following the correct OS-specific instructions
4. Check browser console for error messages (Press F12)

---

**Happy Coding! 🚀**

*Last Updated: November 2025*


