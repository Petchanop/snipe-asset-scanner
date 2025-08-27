declare global {
    var ENCRYPTION_KEY: string;
}

global.ENCRYPTION_KEY = process.env.PASSPHRASE ? process.env.PASSPHRASE : "tossawat@cititex.co.th"
export {};