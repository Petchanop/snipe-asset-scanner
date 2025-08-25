import CryptoJS from "crypto-js"

export function encryptToSlug(text: string) : string {
    const cipherText = CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString()
    return cipherText
}

export function decryptToOriginal(text: string) : string {
    const decipherText = CryptoJS.AES.decrypt(text, ENCRYPTION_KEY)
    return decipherText.toString(CryptoJS.enc.Utf8)
}