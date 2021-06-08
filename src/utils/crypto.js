import crypto from 'crypto';

import config from 'config';

const iv = crypto.randomBytes(16);

export const encrypt = (text) => {
  const cipher = crypto.createCipheriv(
    config.crypto.algorithm,
    config.crypto.secretKey,
    iv
  );

  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

  return {
    iv: iv.toString('hex'),
    content: encrypted.toString('hex'),
  };
};

export const decrypt = (hash) => {
  const decipher = crypto.createDecipheriv(
    config.crypto.algorithm,
    config.crypto.secretKey,
    Buffer.from(hash.iv, 'hex')
  );

  const decrpyted = Buffer.concat([
    decipher.update(Buffer.from(hash.content, 'hex')),
    decipher.final(),
  ]);

  return decrpyted.toString();
};
