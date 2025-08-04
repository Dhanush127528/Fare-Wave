import QRCode from "qrcode";

export const generateQRCode = async (data) => {
  try {
    const qrDataURL = await QRCode.toDataURL(JSON.stringify(data));
    return qrDataURL;
  } catch (err) {
    throw new Error("Failed to generate QR Code");
  }
};
