/**
 * Generate a short code using the same algorithm as the backend
 * Uses crypto.getRandomValues() which is available in all modern browsers
 */
export function generateShortCode(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  const randomValues = new Uint8Array(length);
  crypto.getRandomValues(randomValues);
  
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars[randomValues[i] % chars.length];
  }
  
  return code;
}

