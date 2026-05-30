import React, { useState } from 'react'
import { TbWallet } from "react-icons/tb"
import styles from "./Login.module.css"
import { Link, useNavigate } from 'react-router-dom'
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa"
import { HiOutlineLockClosed } from 'react-icons/hi'
import { MdOutlineMail } from 'react-icons/md'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../firebase/firebaseConfig'

const Login = () => {
  const navigate = useNavigate()
  const [show, setShow] = useState(false)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setError('')

    if (!email || !password) {
      setError("Email va parolni kiriting!")
      return
    }

    try {
      setLoading(true)
      await signInWithEmailAndPassword(auth, email, password)
      navigate("/dashboard")
    } catch (err) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError("Email yoki parol noto'g'ri!")
      } else if (err.code === 'auth/invalid-email') {
        setError("Email noto'g'ri formatda!")
      } else {
        setError("Xatolik yuz berdi. Qaytadan urinib ko'ring.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.login}>
        <div className={styles.loginHdr}>
          <div className={styles.loginLogo}>
            <TbWallet />
          </div>
          <p className={styles.text1}>Xush kelibsiz</p>
          <p className={styles.text2}>Hisobingizga kiring</p>
        </div>

        <div className={styles.loginForm}>
          <label htmlFor="email">Email
            <div className={styles.EmailInp}>
              <MdOutlineMail className={styles.InpIc} />
              <input
                type="email"
                id='email'
                placeholder='email@example.com'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </label>

          <label htmlFor="password">Parol
            <div className={styles.passwordInp}>
              <HiOutlineLockClosed className={styles.InpIc} />
              <input
                id='password'
                type={show ? "text" : "password"}
                placeholder='••••••••'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className={styles.InpIc} onClick={() => setShow(prev => !prev)}>
                {show ? <FaRegEyeSlash /> : <FaRegEye />}
              </div>
            </div>
          </label>

          {error && <p style={{ color: 'red', fontSize: '13px', marginTop: '-8px' }}>{error}</p>}

          <button onClick={handleLogin} disabled={loading}>
            {loading ? "Yuklanmoqda..." : "Kirish"}
          </button>

          <p>Hisobingiz yo'qmi? <Link to="/signup">Ro'yxatdan o'tish</Link></p>
        </div>
      </div>
    </div>
  )
}

export default Login
