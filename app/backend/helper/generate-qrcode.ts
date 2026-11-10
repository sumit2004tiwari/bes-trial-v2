
import QRCode from "qrcode";
export const generateQrCodeBase64 = async (data: string):Promise<string> => {
  try {
    const qrBase64 = QRCode.toDataURL(data, {
      errorCorrectionLevel: "H", // Highest error correction level
      type: "image/png", // Image type
      margin: 2, // Margin around the QR code,
    });
    return qrBase64;
  } catch (error) {
    throw new Error("Failed to generate QR code");
  }
};
export const generateQrCodeBuffer = async (data: string):Promise<Buffer> => {
  try {
    const imageBuffer = await QRCode.toBuffer(data, {
      errorCorrectionLevel: "H", // Highest error correction level
      type: "png", // Image type
      margin: 2, // Margin around the QR code
    });
    return imageBuffer;
  } catch (error) {
    throw new Error("Failed to generate QR code");
  }
};
