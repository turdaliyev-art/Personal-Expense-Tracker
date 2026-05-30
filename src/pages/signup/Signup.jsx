import React, { useState } from 'react'
import { TbWallet } from "react-icons/tb"
import styles from "./Signup.module.css"
import { Link, useNavigate } from 'react-router-dom'
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa"
import { HiOutlineLockClosed } from "react-icons/hi"
import { MdOutlineMail } from "react-icons/md"
import { FiUser } from 'react-icons/fi'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth } from '../../firebase/firebaseConfig'

const Signup = () => {
  const navigate = useNavigate()
  const [show, setShow] = useState(false)
  const [show2, setShow2] = useState(false)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignup = async () => {
    setError('')

    if (!name || !email || !password || !confirm) {
      setError("Barcha ma'lumotlarni to'ldiring!")
      return
    }
    if (password !== confirm) {
      setError("Parollar mos kelmadi!")
      return
    }
    if (password.length < 6) {
      setError("Parol kamida 6 ta belgi bo'lishi kerak!")
      return
    }

    try {
      setLoading(true)
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(userCredential.user, { displayName: name })
      navigate("/dashboard")
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError("Bu email allaqachon ro'yxatdan o'tgan!")
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
          <p className={styles.text2}>Yangi hisob yarating</p>
        </div>

        <div className={styles.loginForm}>
          <label>Ism
            <div className={styles.EmailInp}>
              <FiUser className={styles.InpIc} />
              <input
                type="text"
                placeholder='Ismingiz'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </label>

          <label>Email
            <div className={styles.EmailInp}>
              <MdOutlineMail className={styles.InpIc} />
              <input
                type="email"
                placeholder='email@example.com'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </label>

          <label>Parol
            <div className={styles.passwordInp}>
              <HiOutlineLockClosed className={styles.InpIc} />
              <input
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

          <label>Parolni tasdiqlang
            <div className={styles.passwordInp}>
              <HiOutlineLockClosed className={styles.InpIc} />
              <input
                type={show2 ? "text" : "password"}
                placeholder='••••••••'
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
              <div className={styles.InpIc} onClick={() => setShow2(prev => !prev)}>
                {show2 ? <FaRegEyeSlash /> : <FaRegEye />}
              </div>
            </div>
          </label>

          {error && <p style={{ color: 'red', fontSize: '13px', marginTop: '-8px' }}>{error}</p>}

          <button onClick={handleSignup} disabled={loading}>
            {loading ? "Yuklanmoqda..." : "Ro'yxatdan o'tish"}
          </button>

          <p>Hisobingiz bormi? <Link to="/">Kirish</Link></p>
        </div>
      </div>
    </div>
  )
}

export default Signup
