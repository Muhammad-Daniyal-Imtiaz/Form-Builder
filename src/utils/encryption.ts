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
  
  if (!text.includes(':')) {
    return text;
  }
  
  try {
    const [ivHex, encryptedHex] = text.split(':');
    
    if (!ivHex || !encryptedHex) return text;
    
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (err) {
    console.error('Decryption failed, returning plain text fallback:', err);
    return text;
  }
}
