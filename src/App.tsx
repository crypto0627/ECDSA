import * as React from 'react'
import './styles.css'
import Signer from './ecdsa/Signer'
import Verifier from './ecdsa/Verifier'

export default function App() {
  const signer = React.useRef(new Signer())
  const verifier = React.useRef<Verifier>()

  const [message, setMessage] = React.useState('') // 메시지
  const [sig, setSig] = React.useState('') // 시그너처
  const [verified, setVerified] = React.useState(false) // 검증 여부?

  // message 가 바뀔 때마다 시그너처를 생성
  React.useEffect(() => {
    if (!message) return

    signer.current.sign(message).then(sig => {
      setSig(sig.toString('hex'))
    })

    return () => {}
  }, [message, signer])

  // 퍼블릭키가 바뀔 때 마다 검증 클래스 생성
  React.useEffect(() => {
    verifier.current = new Verifier(signer.current.publicKey)
    return () => {}
  }, [signer])

  // 메시지 또는 시그너처가 바뀔 때마다 검증 결과 리턴
  React.useEffect(() => {
    if (!verifier.current) return

    verifier.current.verify(message, sig).then((result: boolean) => {
      setVerified(result)
    })

    return () => {}
  }, [message, signer, verifier, sig])

  return (
    <div className="App">
      <h1>Private Key (HEX)</h1>
      <div className="wrap">{signer.current.privateKey.toString('hex')}</div>

      <h1>Public Key (HEX)</h1>
      <div className="wrap">{signer.current.publicKey.toString('hex')}</div>

      <h2>Message</h2>
      <input onChange={e => setMessage(e.target.value)} />

      <h2>Message Signature from Private Key (HEX)</h2>
      <input onChange={e => setSig(e.target.value)} value={sig} />

      <h2>Signature Verifed with Public Key</h2>
      <div
        className="wrap"
        style={{
          color: verified ? 'green' : 'red'
        }}
      >
        {verified.toString()}
      </div>
    </div>
  )
}
