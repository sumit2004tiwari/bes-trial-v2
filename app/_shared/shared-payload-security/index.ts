import CryptoJS from "crypto-js";

const SECRET_KEY = process.env.NEXT_PUBLIC_SERVICE_SECRET;
export const encryptPayload = (payload: string) => {
  const encrypted = CryptoJS.AES.encrypt(payload, SECRET_KEY).toString();
  return encrypted;
};

export const decryptPayload = (encryptedPayload: string) => {
  const bytes = CryptoJS.AES.decrypt(encryptedPayload, SECRET_KEY);

  return bytes.toString(CryptoJS.enc.Utf8);
};
