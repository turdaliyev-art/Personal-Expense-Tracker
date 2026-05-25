import React, { useState } from 'react'
import { TbWallet } from "react-icons/tb";
import styles from "./Login.module.css"
import { Link, useNavigate } from 'react-router-dom';
import { FaRegEyeSlash } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa";
import { HiOutlineLockClosed } from 'react-icons/hi';
import { MdOutlineMail } from 'react-icons/md';


const Login = () => {
  const navigate = useNavigate()
  const [show ,setShow] = useState(false)
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
              <label htmlFor="email">Email
                  <div className={styles.EmailInp}>
                      <MdOutlineMail className={styles.InpIc}/>
                    <input  type="email" id='email' placeholder='email@example.com'/>
                  </div>
              </label>
              <label htmlFor="password">Parol
                <div className={styles.passwordInp}>
                  <HiOutlineLockClosed className={styles.InpIc}/>
                  <input  id='password' type={show ? "text" : "password"} placeholder='••••••••'/>
                  <div className={styles.InpIc}  onClick={() => setShow((prev) => !prev)}>
                    {show ? <FaRegEyeSlash/> : <FaRegEye/>}
                  </div>
                </div>
              </label>
              <button onClick={() => navigate("/dashboard")}>Kirish</button>
             <p>Hisobingiz yo'qmi? <Link to="/signup">Ro'yxatdan o'tish</Link></p>
            </div>
      </div>
    </div>
  )
}

export default Login
