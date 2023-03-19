import { Buffer } from "buffer";
import { sha256 } from "js-sha256";
import eccrypto from "eccrypto";

export default class Signer {
  private _privateKey: Buffer;
  private _publicKey: Buffer;

  constructor() {
    const privateKey = eccrypto.generatePrivate(); // a new random 32-byte private key
    const publicKey = eccrypto.getPublic(privateKey); // uncompressed (65-byte) public key.

    this._privateKey = privateKey;
    this._publicKey = publicKey;
  }

  get publicKey() {
    return this._publicKey;
  }

  get privateKey() {
    return this._privateKey;
  }

  sign(msg = "") {
    const digest = sha256.update(Buffer.from(msg, "utf-8"));
    const message = Buffer.from(digest.arrayBuffer());

    return eccrypto.sign(this._privateKey, message).then(signature => {
      console.log("msg:", msg);
      console.log("digest:", message);
      console.log("Signature in DER format:", signature);
      return signature;
    });
  }
}
