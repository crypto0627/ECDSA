import { Buffer } from 'buffer'
import { sha256 } from 'js-sha256'
import eccrypto from 'eccrypto'

export default class Verifier {
  private _publicKey: Buffer

  constructor(publicKey: Buffer) {
    this._publicKey = publicKey
  }

  verify(msg: string, sigHex: string): Promise<boolean> {
    const digest = sha256.update(msg)
    const message = Buffer.from(digest.arrayBuffer())
    const signature = Buffer.from(sigHex, 'hex')

    // @types/eccrypto 에 verify 가 정의되어 있지 않음 ㅠ.ㅜ
    return (eccrypto as any)
      .verify(this._publicKey, message, signature)
      .then(() => {
        console.log('Signature is OK')
        return true
      })
      .catch(() => {
        console.log('Signature is BAD')
        return false
      })
  }
}
