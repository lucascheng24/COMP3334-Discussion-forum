const forge = require('node-forge');
const crypto = require('crypto-js');

const GenRSAKeypair = () => {
    const keyPair = forge.pki.rsa.generateKeyPair({ bits: 2048 });
    const publicKeyPem = forge.pki.publicKeyToPem(keyPair.publicKey);
    const privateKeyPem = forge.pki.privateKeyToPem(keyPair.privateKey);

    return {
        publicKey: publicKeyPem,
        privateKey: privateKeyPem
    }

}

const RsaEncrypt = (plainText, publicKeyStr) => {
    const publicKey = forge.pki.publicKeyFromPem(publicKeyStr);
    const encrypted = publicKey.encrypt(plainText);
    return forge.util.encode64(encrypted);
}

const RsaDecrypt = (decryptData, privateKeyStr) => {
    try {
        // console.log(privateKeyStr)
      const privateKey = forge.pki.privateKeyFromPem(privateKeyStr);
      const decrypted = privateKey.decrypt(forge.util.decode64(decryptData));
    //   console.log(JSON.stringify(decrypted));
      return decrypted;
    } catch (error) {
      console.log('decrypt error');
      console.log(error);
    }
};

//  save key and download as txt
const SaveKeyAndDownload = (keyStr, fileName) => {
    const keyBlob = new Blob([keyStr], { type: 'text/plain' });
  
    const keyUrl = URL.createObjectURL(keyBlob);
  
    const keyLink = document.createElement('a');
  
    keyLink.href = keyUrl;

    const download_filename = fileName +'.txt'
  
    keyLink.download = download_filename;
  
    document.body.appendChild(keyLink);
  
    keyLink.click();
  
    document.body.removeChild(keyLink);
  
    URL.revokeObjectURL(keyUrl);
};




exports.GenRSAKeypair = GenRSAKeypair;
exports.RsaEncrypt = RsaEncrypt;
exports.RsaDecrypt = RsaDecrypt;

// export const RsaEncrypt = (plainText, publicKeyStr) => {
//     return crypto.AES.encrypt(plainText, publicKeyStr).toString();
// }



// export const RsaDecrypt = (decryptData, privateKeyStr) => {
    
//     try {

//         const dec = crypto.AES.decrypt(decryptData, privateKeyStr);
//         console.log(dec.toString(crypto.enc.Utf8))
//         return dec
//     } catch (error) {
//         console.log('decrypt error')
//         console.log(error)
//     }


     
// }
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