import * as crypto from 'crypto';

export function hash(data: string) {
  return crypto.createHash('sha256').update(data).digest('hex');
}

export function compareHashString(plaintext: string, hash: string) {
  const hashedPlaintext = crypto
    .createHash('sha256')
    .update(plaintext)
    .digest('hex');
  const bufferA = Buffer.from(hashedPlaintext);
  const bufferB = Buffer.from(hash);
  return crypto.timingSafeEqual(bufferA, bufferB);
}
