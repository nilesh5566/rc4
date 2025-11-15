#include <emscripten.h>
#include <string.h>
#include <stdlib.h>
#include <stdio.h>

// RC4 Key Scheduling Algorithm (KSA)
// Initialize and scramble the S-box based on the key
void ksa(unsigned char *S, const unsigned char *key, int keylen) {
    int i, j = 0;
    unsigned char temp;
    
    // Initialize S array with values 0 to 255
    for (i = 0; i < 256; i++) {
        S[i] = i;
    }
    
    // Scramble S array based on key
    for (i = 0; i < 256; i++) {
        j = (j + S[i] + key[i % keylen]) % 256;
        
        // Swap S[i] and S[j]
        temp = S[i];
        S[i] = S[j];
        S[j] = temp;
    }
}

// RC4 Pseudo-Random Generation Algorithm (PRGA)
// Generate keystream and XOR with data
void prga(unsigned char *S, unsigned char *data, int datalen) {
    int i = 0, j = 0, k;
    unsigned char temp;
    
    for (k = 0; k < datalen; k++) {
        i = (i + 1) % 256;
        j = (j + S[i]) % 256;
        
        // Swap S[i] and S[j]
        temp = S[i];
        S[i] = S[j];
        S[j] = temp;
        
        // XOR data with keystream byte
        data[k] ^= S[(S[i] + S[j]) % 256];
    }
}

// Main RC4 encryption/decryption function
// Note: RC4 is symmetric - same function for encrypt and decrypt
EMSCRIPTEN_KEEPALIVE
unsigned char* rc4_crypt(const char *input, const char *key) {
    int inputlen = strlen(input);
    int keylen = strlen(key);
    
    // Allocate memory for output
    unsigned char *output = (unsigned char*)malloc(inputlen + 1);
    if (output == NULL) return NULL;
    
    // Copy input to output buffer
    memcpy(output, input, inputlen);
    output[inputlen] = '\0';
    
    // Initialize S-box using KSA
    unsigned char S[256];
    ksa(S, (const unsigned char*)key, keylen);
    
    // Perform encryption/decryption using PRGA
    prga(S, output, inputlen);
    
    return output;
}

// Convert binary data to hexadecimal string representation
EMSCRIPTEN_KEEPALIVE
char* to_hex(const unsigned char *data, int len) {
    // Each byte becomes 2 hex characters
    char *hex = (char*)malloc(len * 2 + 1);
    if (hex == NULL) return NULL;
    
    for (int i = 0; i < len; i++) {
        sprintf(hex + i * 2, "%02x", data[i]);
    }
    hex[len * 2] = '\0';
    return hex;
}

// Convert hexadecimal string back to binary data
EMSCRIPTEN_KEEPALIVE
unsigned char* from_hex(const char *hex) {
    int len = strlen(hex) / 2;
    unsigned char *data = (unsigned char*)malloc(len + 1);
    if (data == NULL) return NULL;
    
    for (int i = 0; i < len; i++) {
        sscanf(hex + i * 2, "%2hhx", &data[i]);
    }
    data[len] = '\0';
    return data;
}

// Free allocated memory (important to prevent memory leaks)
EMSCRIPTEN_KEEPALIVE
void free_memory(void *ptr) {
    free(ptr);
}