import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'crypto';

const secret = process.env.ENCRYPTION_SECRET || 'fallback_development_secret_only';
const ENCRYPTION_KEY = scryptSync(secret, 'salt', 32);

export function encrypt(text: string): string {
  if (!text) return text;
  try {
    const iv = randomBytes(16);
    const cipher = createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
  } catch (err) {
    console.error('Encryption failed:', err);
    return text;
  }
}

export function decrypt(text: string): string {
  if (!text) return text;
  
  // Basic check for our format: [ivHex]:[encryptedHex]
  // IV is 16 bytes = 32 hex characters
  if (!text.includes(':')) {
    return text;
  }
  
  try {
    const parts = text.split(':');
    // Robust check: leftmost part must be exactly 32 hex chars for a 16-byte IV
    const ivHex = parts[0];
    const encryptedHex = parts.slice(1).join(':');

    if (ivHex.length !== 32) {
      return text;
    }
    
    const iv = Buffer.from(ivHex, 'hex');
    if (iv.length !== 16) {
      return text;
    }

    const decipher = createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (err) {
    // If it's a valid looking IV but not actually encrypted with our key,
    // or hex parsing fails, we reach here. Just return original.
    return text;
  }
}
