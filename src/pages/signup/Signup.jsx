import React, { useState } from 'react'
import { TbWallet } from "react-icons/tb";
import styles from "./Signup.module.css"
import { Link, useNavigate } from 'react-router-dom';
import { FaRegEyeSlash } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa";
import { HiOutlineLockClosed } from "react-icons/hi";
import { MdOutlineMail } from "react-icons/md";
import { FiUser } from 'react-icons/fi';


const Signup = () => {
  const navigate = useNavigate()
  const [show ,setShow] = useState(false)
  const [show2 ,setShow2] = useState(false)
  return (
    <div className={styles.overlay}>
      <div className={styles.login}>
        <div className={styles.loginHdr}>
          <div className={styles.loginLogo}>
            <TbWallet/>
          </div>
            
              <p className={styles.text1}>Xush kelibsiz</p>
              <p className={styles.text2}>Hisobingizga kiring</p>

        </div>
            <div className={styles.loginForm}>
               <label htmlFor="password">Ism
                <div className={styles.EmailInp}>
                    <FiUser className={styles.InpIc}/>
                  <input  type="text"  placeholder='Ismingiz'/>
                </div>
              </label>
               <label htmlFor="email">Parol
                <div className={styles.EmailInp}>
                    <MdOutlineMail className={styles.InpIc}/>
                  <input  type="email" placeholder='email@example.com'/>
                </div>
              </label>
              <label htmlFor="password">Parol
                <div className={styles.passwordInp}>
                    <HiOutlineLockClosed className={styles.InpIc}/>
                  <input  type={show ? "text" : "password"} placeholder='••••••••'/>
                  <div className={styles.InpIc}  onClick={() => setShow((prev) => !prev)}>
                    {show ? <FaRegEyeSlash/> : <FaRegEye/>}
                  </div>
                </div>
              </label>
              <label htmlFor="password">Parolni tasdiqlang
                <div className={styles.passwordInp}>
                    <HiOutlineLockClosed className={styles.InpIc}/>
                  <input  type={show ? "text" : "password"} placeholder='••••••••'/>
                  <div className={styles.InpIc}  onClick={() => setShow2((prev) => !prev)}>
                    {show2 ? <FaRegEyeSlash/> : <FaRegEye/>}
                  </div>
                </div>
              </label>
              <button onClick={() => navigate("/dashboard")}>Ro'yxatdan o'tish</button>
             <p>Hisobingiz bormi? <Link to="/">Kirish</Link></p>
            </div>
      </div>
    </div>
  )
}

export default Signup
