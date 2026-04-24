import CryptoJS from 'crypto-js';

const secret = process.env.ENCRYPTION_SECRET || 'fallback_development_secret_only';

export function encrypt(text: string): string {
  if (!text) return text;
  try {
    const iv = CryptoJS.lib.WordArray.random(16);
    const key = CryptoJS.PBKDF2(secret, 'salt', { keySize: 256 / 32, iterations: 100 });
    
    const encrypted = CryptoJS.AES.encrypt(text, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });

    return iv.toString() + ':' + encrypted.toString();
  } catch (err) {
    console.error('Encryption failed:', err);
    return text;
  }
}

export function decrypt(text: string): string {
  if (!text) return text;
  
  if (!text.includes(':')) {
    return text;
  }
  
  try {
    const parts = text.split(':');
    const ivHex = parts[0];
    const encryptedText = parts.slice(1).join(':');

    if (ivHex.length !== 32) {
      return text;
    }
    
    const iv = CryptoJS.enc.Hex.parse(ivHex);
    const key = CryptoJS.PBKDF2(secret, 'salt', { keySize: 256 / 32, iterations: 100 });

    const decrypted = CryptoJS.AES.decrypt(encryptedText, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (err) {
    console.error('Decryption failed:', err);
    return text;
  }
}
