const CryptoJS = require("crypto-js");

const SECRET_KEY = process.env.NEXT_PUBLIC_CRYPTO_JS_KEY;

/**
 * Crypter les données
 * @param text texte a crypter
 * @returns {string}
 */
export function encrypt(text: string) {
    return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
}

/**
 * Crypter les données
 * @param text texte décrypter
 * @returns {string}
 */
export function decrypt(encryptedText: string) {
    const bytes = CryptoJS.AES.decrypt(encryptedText, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
}