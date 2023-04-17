const forge = require('node-forge');
const crypto = require('crypto-js');

export const GenRSAKeypair = () => {
    const keyPair = forge.pki.rsa.generateKeyPair({ bits: 2048 });
    const publicKeyPem = forge.pki.publicKeyToPem(keyPair.publicKey);
    const privateKeyPem = forge.pki.privateKeyToPem(keyPair.privateKey);

    return {
        publicKey: publicKeyPem,
        privateKey: privateKeyPem
    }

}

export const RsaEncrypt = (plainText, publicKeyStr) => {
    return crypto.AES.encrypt(plainText, publicKeyStr).toString();
}

export const RsaDecrypt = (decryptData, privateKeyStr) => {
    return crypto.AES.decrypt(decryptData.toString(), privateKeyStr).toString();
}


// // Generate RSA key pair
        // const keyPair = forge.pki.rsa.generateKeyPair({ bits: 2048 });
        // const publicKeyPem = forge.pki.publicKeyToPem(keyPair.publicKey);
        // const privateKeyPem = forge.pki.privateKeyToPem(keyPair.privateKey);

        // console.log('Public key:', publicKeyPem);
        // console.log('Private key:', privateKeyPem);

        // // Encrypt data with public key
        // const plainText = 'Hello, World!';
        // const encrypted = crypto.AES.encrypt(plainText, publicKeyPem);

        // console.log('Encrypted:', encrypted.toString());

        // // Decrypt data with private key
        // const decrypted = crypto.AES.decrypt(encrypted.toString(), privateKeyPem);

        // console.log('Decrypted:', decrypted.toString(crypto.enc.Utf8));