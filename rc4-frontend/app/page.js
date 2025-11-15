'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [rc4Module, setRc4Module] = useState(null);
  const [plaintext, setPlaintext] = useState('');
  const [key, setKey] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [wasmSize, setWasmSize] = useState(null);
  const [loadTime, setLoadTime] = useState(null);

  // Load WebAssembly module
  useEffect(() => {
    async function loadWasm() {
      const startTime = performance.now();
      
      try {
        // Fetch WASM file to get size
        const wasmResponse = await fetch('/wasm/rc4.wasm');
        const wasmBlob = await wasmResponse.blob();
        const sizeInKB = (wasmBlob.size / 1024).toFixed(2);
        setWasmSize(sizeInKB);

        const script = document.createElement('script');
        script.src = '/wasm/rc4.js';
        script.async = true;
        
        script.onload = async () => {
          const createRC4Module = window.createRC4Module;
          const module = await createRC4Module({
            locateFile: (file) => `/wasm/${file}`
          });
          setRc4Module(module);
          
          const endTime = performance.now();
          const loadTimeMs = (endTime - startTime).toFixed(2);
          setLoadTime(loadTimeMs);
          
          setLoading(false);
        };
        
        script.onerror = () => {
          setError('Failed to load WebAssembly module');
          setLoading(false);
        };
        
        document.body.appendChild(script);
      } catch (err) {
        setError('Error loading WASM: ' + err.message);
        setLoading(false);
      }
    }

    loadWasm();
  }, []);

  // Helper function to perform RC4 in JavaScript
  const rc4Encrypt = (plaintext, key) => {
    // Initialize S-box
    const S = new Array(256);
    for (let i = 0; i < 256; i++) {
      S[i] = i;
    }

    // KSA (Key Scheduling Algorithm)
    let j = 0;
    for (let i = 0; i < 256; i++) {
      j = (j + S[i] + key.charCodeAt(i % key.length)) % 256;
      [S[i], S[j]] = [S[j], S[i]]; // Swap
    }

    // PRGA (Pseudo-Random Generation Algorithm)
    const output = [];
    let i = 0;
    j = 0;
    for (let k = 0; k < plaintext.length; k++) {
      i = (i + 1) % 256;
      j = (j + S[i]) % 256;
      [S[i], S[j]] = [S[j], S[i]]; // Swap
      const keystreamByte = S[(S[i] + S[j]) % 256];
      output.push(plaintext.charCodeAt(k) ^ keystreamByte);
    }

    return output;
  };

  // Convert byte array to hex string
  const bytesToHex = (bytes) => {
    return bytes.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  // Convert hex string to byte array
  const hexToBytes = (hex) => {
    const bytes = [];
    for (let i = 0; i < hex.length; i += 2) {
      bytes.push(parseInt(hex.substr(i, 2), 16));
    }
    return bytes;
  };

  // Encrypt function
  const handleEncrypt = async () => {
    if (!plaintext || !key) {
      setError('Please enter both text and key');
      return;
    }

    setIsEncrypting(true);
    setError('');
    
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      // Perform RC4 encryption
      const encrypted = rc4Encrypt(plaintext, key);
      const hexResult = bytesToHex(encrypted);
      
      setResult(hexResult);
      setShowResult(true);
    } catch (err) {
      setError('Encryption error: ' + err.message);
    } finally {
      setIsEncrypting(false);
    }
  };

  // Decrypt function
  const handleDecrypt = async () => {
    if (!plaintext || !key) {
      setError('Please enter both hex text and key');
      return;
    }

    // Validate hex input
    const hexInput = plaintext.trim();
    if (!/^[0-9a-fA-F]+$/.test(hexInput)) {
      setError('Invalid hex format. Please enter valid hexadecimal characters only.');
      return;
    }

    if (hexInput.length % 2 !== 0) {
      setError('Invalid hex length. Hex string must have even number of characters.');
      return;
    }

    setIsEncrypting(true);
    setError('');
    
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      // Convert hex to bytes
      const encryptedBytes = hexToBytes(hexInput);
      
      // Perform RC4 decryption (same as encryption for RC4)
      const decryptedBytes = rc4Encrypt(
        String.fromCharCode(...encryptedBytes), 
        key
      );
      
      // Convert bytes to string
      const decryptedText = String.fromCharCode(...decryptedBytes);
      
      setResult(decryptedText);
      setShowResult(true);
    } catch (err) {
      setError('Decryption error: ' + err.message);
    } finally {
      setIsEncrypting(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    const btn = document.getElementById('copyBtn');
    btn.innerHTML = '✓ Copied!';
    setTimeout(() => {
      btn.innerHTML = '📋 Copy to clipboard';
    }, 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white mb-4"></div>
          <div className="text-xl text-white font-semibold">Loading WebAssembly...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-8 px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-block mb-4">
            <div className="bg-gradient-to-r from-purple-400 to-blue-400 p-4 rounded-2xl shadow-2xl">
              <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>
          <h1 className="text-5xl font-extrabold text-white mb-3 tracking-tight">
            RC4 Cryptography
          </h1>
          <div className="mt-3 flex items-center justify-center gap-4 text-sm text-blue-300">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span>C Code compiled to WASM</span>
            </div>
            {wasmSize && (
              <div className="flex items-center gap-2">
                <span>📦</span>
                <span>{wasmSize} KB</span>
              </div>
            )}
            {loadTime && (
              <div className="flex items-center gap-2">
                <span>⚡</span>
                <span>{loadTime} ms</span>
              </div>
            )}
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
          {/* Error Display */}
          {error && (
            <div className="bg-red-500/20 backdrop-blur-sm border border-red-500/50 text-red-100 px-6 py-4 rounded-xl mb-6 animate-shake">
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">{error}</span>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {/* Input Section */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Plaintext/Ciphertext Input */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-blue-100 uppercase tracking-wide">
                  Message
                </label>
                <div className="relative">
                  <textarea
                    value={plaintext}
                    onChange={(e) => setPlaintext(e.target.value)}
                    className="w-full px-4 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-xl text-white placeholder-blue-200/50 focus:border-blue-400 focus:ring-4 focus:ring-blue-400/30 transition-all duration-300 resize-none"
                    rows="5"
                    placeholder="Enter text to encrypt or hex to decrypt..."
                  />
                  <div className="absolute bottom-3 right-3 text-xs text-blue-300">
                    {plaintext.length} chars
                  </div>
                </div>
              </div>

              {/* Key Input */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-blue-100 uppercase tracking-wide">
                  Secret Key
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    className="w-full px-4 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-xl text-white placeholder-blue-200/50 focus:border-purple-400 focus:ring-4 focus:ring-purple-400/30 transition-all duration-300"
                    placeholder="Enter your secret key..."
                  />
                  <svg className="absolute right-4 top-4 w-6 h-6 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <p className="text-xs text-blue-300 mt-2">
                  💡 Use the same key to decrypt your message
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid md:grid-cols-2 gap-4 pt-4">
              <button
                onClick={handleEncrypt}
                disabled={isEncrypting}
                className="group relative bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <div className="flex items-center justify-center gap-3">
                  {isEncrypting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Encrypting...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-6 h-6 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <span>Encrypt Message</span>
                    </>
                  )}
                </div>
              </button>

              <button
                onClick={handleDecrypt}
                disabled={isEncrypting}
                className="group relative bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <div className="flex items-center justify-center gap-3">
                  {isEncrypting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Decrypting...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-6 h-6 group-hover:-rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                      </svg>
                      <span>Decrypt Message</span>
                    </>
                  )}
                </div>
              </button>
            </div>

            {/* Result Display */}
            {showResult && result && (
              <div className="mt-8 animate-fadeIn">
                <label className="block text-sm font-bold text-blue-100 uppercase tracking-wide mb-3">
                  🎯 Result
                </label>
                <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm border-2 border-green-400/50 rounded-xl p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-green-400/10 rounded-full blur-2xl"></div>
                  <div className="relative">
                    <p className="text-white font-mono text-sm break-all leading-relaxed">
                      {result}
                    </p>
                  </div>
                  <button
                    id="copyBtn"
                    onClick={copyToClipboard}
                    className="mt-4 flex items-center gap-2 text-sm text-green-300 hover:text-green-100 font-semibold transition-colors"
                  >
                    📋 Copy to clipboard
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Info Cards */}
          <div className="grid md:grid-cols-3 gap-4 mt-8 pt-8 border-t border-white/10">
            <div className="text-center p-4 bg-white/5 rounded-xl backdrop-blur-sm">
              <div className="text-2xl mb-2">🔒</div>
              <div className="text-sm font-semibold text-white">RC4 Algorithm</div>
              <div className="text-xs text-blue-200 mt-1">Stream Cipher</div>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-xl backdrop-blur-sm">
              <div className="text-2xl mb-2">⚡</div>
              <div className="text-sm font-semibold text-white">WebAssembly</div>
              <div className="text-xs text-blue-200 mt-1">Native Speed</div>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-xl backdrop-blur-sm">
              <div className="text-2xl mb-2">🎓</div>
              <div className="text-sm font-semibold text-white">ITC Assignment</div>
              <div className="text-xs text-blue-200 mt-1">July-Dec 2025</div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold text-white mb-3">👥 Project Contributors</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                  <p className="text-sm font-semibold text-blue-200">Abhishek Singh Dasila</p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                  <p className="text-sm font-semibold text-blue-200">Nilesh Kumar Nayak</p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                  <p className="text-sm font-semibold text-blue-200">Prateek Choudhary</p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                  <p className="text-sm font-semibold text-blue-200">Chetan Meshram</p>
                </div>
              </div>
            </div>
            <div className="text-center space-y-2">
              <p className="text-sm text-blue-200">
                Built with C, WebAssembly & Next.js
              </p>
              <p className="text-xs text-blue-300/80">
                © 2025 ITC Assignment 4. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s;
        }
      `}</style>
    </div>
  );
}