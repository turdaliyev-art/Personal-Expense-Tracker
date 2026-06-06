import React, { useState, useEffect, useRef } from 'react'
import { FiCamera, FiUser, FiMail, FiMapPin, FiLock, FiShield, FiCalendar, FiDollarSign, FiCreditCard, FiLogOut, FiActivity, FiBell, FiMoon, FiSun } from 'react-icons/fi'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa'
import { FaArrowTrendUp } from 'react-icons/fa6'
import styles from './Profile.module.css'
import { auth, db } from '../../firebase/firebaseConfig'
import { updateProfile, updatePassword, signOut } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import { subscribeToTransactions } from '../../services/financeService'

const EyeInput = ({ value, onChange, placeholder }) => {
  const [show, setShow] = useState(false)
  return (
    <div className={styles.eyeInputContainer}>
      <input
        type={show ? 'text' : 'password'}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      <span onClick={() => setShow(p => !p)} className={styles.eyeIconWrapper}>
        {show ? <FaRegEyeSlash className={styles.eyeIc}/> : <FaRegEye className={styles.eyeIc}/>}
      </span>
    </div>
  )
}

function Profile() {
  const navigate = useNavigate()
  const user = auth.currentUser
  const fileInputRef = useRef(null)

  const [avatar, setAvatar] = useState(null)
  const [displayName, setDisplayName] = useState(user?.displayName || '')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [profileMsg, setProfileMsg] = useState('')

  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [passwordMsg, setPasswordMsg] = useState('')

  const [pushNotif, setPushNotif] = useState(true)
  const [emailNotif, setEmailNotif] = useState(false)
  
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      return savedTheme === 'dark'
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  const [stats, setStats] = useState({ totalCount: 0, income: 0, expense: 0 })

  useEffect(() => {
    if (darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.setAttribute('data-theme', 'light')
      localStorage.setItem('theme', 'light')
    }
  }, [darkMode])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e) => {
      if (!localStorage.getItem('theme')) {
        setDarkMode(e.matches)
      }
    }
    
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  useEffect(() => {
    if (!user) return

    const fetchAdditionalUserData = async () => {
      try {
        const docRef = doc(db, 'users', user.uid)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          const data = docSnap.data()
          setPhone(data.phone || '')
          setAddress(data.address || '')
          setAvatar(data.avatar || user?.photoURL || null)
        } else {
          setAvatar(user?.photoURL || null)
        }
      } catch (err) {
        console.error(err)
      }
    }

    fetchAdditionalUserData()

    const unsubscribeTx = subscribeToTransactions((data) => {
      let totalIncome = 0
      let totalExpense = 0

      data.forEach(tx => {
        const amt = Number(tx.amount || 0)
        if (tx.type === 'income') {
          totalIncome += amt
        } else if (tx.type === 'expense') {
          totalExpense += Math.abs(amt)
        }
      })

      setStats({
        totalCount: data.length,
        income: totalIncome,
        expense: totalExpense
      })
    })

    return () => unsubscribeTx()
  }, [user])

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = async () => {
      const base64Image = reader.result
      setAvatar(base64Image)
      
      try {
        const docRef = doc(db, 'users', user.uid)
        await setDoc(docRef, { avatar: base64Image }, { merge: true })
        
        setProfileMsg('✅ Rasm yangilandi va saqlandi!')
        setTimeout(() => setProfileMsg(''), 3000)
      } catch (err) {
        console.error(err)
        setProfileMsg('❌ Rasmni saqlashda xatolik!')
      }
    }
    reader.readAsDataURL(file)
  }

  const handleSaveProfile = async () => {
    try {
      await updateProfile(user, { displayName })
      
      const docRef = doc(db, 'users', user.uid)
      await setDoc(docRef, { phone, address, displayName }, { merge: true })

      setProfileMsg('✅ Saqlandi!')
      setTimeout(() => setProfileMsg(''), 3000)
    } catch { 
      setProfileMsg('❌ Xatolik!') 
    }
  }

  const handleChangePassword = async () => {
    if (newPassword.length < 6) return setPasswordMsg("❌ Kamida 6 ta belgi!")
    try {
      await updatePassword(user, newPassword)
      setPasswordMsg('Parol yangilandi!')
      setOldPassword('')
      setNewPassword('')
      setTimeout(() => setPasswordMsg(''), 3000)
    } catch (err) {
      setPasswordMsg(err.code === 'auth/requires-recent-login'
        ? '❌ Qayta login qiling!'
        : '❌ Xatolik!')
    }
  }

  const Toggle = ({ on, onClick }) => (
    <div className={`${styles.switch} ${on ? styles.switchOn : ''}`} onClick={onClick}>
      <div className={styles.switchHandle} />
    </div>
  )

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.pageTitle}>Profil</h2>
        <p className={styles.pageSubtitle}>Shaxsiy ma'lumotlaringizni boshqaring</p>
      </div>

      <div className={styles.mainLayout}>
        <div className={styles.leftColumn}>

          <div className={styles.card}>
            <div className={styles.avatarSection}>
              <div className={styles.avatarWrapper}>
                <div className={styles.avatar}>
                  {avatar ? <img src={avatar} alt="avatar" className={styles.avatarImg} /> : <FiUser />}
                </div>
                <button type="button" className={styles.uploadBtn} onClick={() => fileInputRef.current.click()}>
                  <FiCamera />
                </button>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" style={{ display: 'none' }} />
              </div>
              <div className={styles.profileMeta}>
                <h3 className={styles.userName}>{displayName || 'Foydalanuvchi'}</h3>
                <p className={styles.userEmail}>{user?.email}</p>
                <div className={styles.badgeRow}>
                  <span className={`${styles.badge} ${styles.premium}`}>Premium</span>
                  <span className={`${styles.badge} ${styles.active}`}>Faol</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.card}>
            <h3 className={styles.cardTitle}><FiUser /> Shaxsiy ma'lumotlar</h3>
            <div className={styles.formGrid}>
              {[
                { label: 'Ism', value: displayName, onChange: e => setDisplayName(e.target.value), placeholder: 'Ismingiz' },
                { label: 'Email', value: user?.email || '', disabled: true },
                { label: 'Telefon', value: phone, onChange: e => setPhone(e.target.value), placeholder: '+998 90 123 45 67' },
                { label: 'Manzil', value: address, onChange: e => setAddress(e.target.value), placeholder: "Toshkent, O'zbekiston" },
              ].map(({ label, ...props }) => (
                <div className={styles.inputGroup} key={label}>
                  <label>{label}</label>
                  <input {...props} className={props.disabled ? styles.disabledInput : ''} />
                </div>
              ))}
              {profileMsg && <p className={styles.messageText}>{profileMsg}</p>}
              <button className={styles.saveBtn} onClick={handleSaveProfile}>O'zgarishlarni saqlash</button>
            </div>
          </div>

          <div className={styles.card}>
            <h3 className={styles.cardTitle}><FiShield /> Xavfsizlik</h3>
            <div className={styles.subCard}>
              <div className={styles.subCardHeader}>
                <FiLock className={styles.subCardIcon} />
                <h4>Parolni o'zgartirish</h4>
              </div>
              <div className={styles.passwordForm}>
                <EyeInput value={oldPassword} onChange={e => setOldPassword(e.target.value)} placeholder="Eski parol" />
                <EyeInput value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Yangi parol" />
                {passwordMsg && <p className={styles.messageText}>{passwordMsg}</p>}
                <button className={styles.actionOutlineBtn} onClick={handleChangePassword}>Parolni yangilash</button>
              </div>
            </div>
          </div>

          <div className={styles.card}>
            <h3 className={styles.cardTitle}><FiBell /> Sozlamalar</h3>
            {[
              { icon: <FiBell className={styles.settingIcon} />, title: 'Push bildirishnomalar', sub: 'Yangi xarajatlar haqida', on: pushNotif, toggle: () => setPushNotif(p => !p) },
              { icon: <FiMail className={styles.settingIcon} />, title: 'Email xabarnolar', sub: 'Haftalik hisobotlar', on: emailNotif, toggle: () => setEmailNotif(p => !p) },
              { icon: darkMode ? <FiSun className={styles.settingIcon} /> : <FiMoon className={styles.settingIcon} />, title: 'Tungi rejim', sub: "Qorong'i interfeys", on: darkMode, toggle: () => setDarkMode(p => !p) },
            ].map(({ icon, title, sub, on, toggle }) => (
              <div className={styles.settingRow} key={title}>
                <div className={styles.settingInfo}>{icon}<div><h4>{title}</h4><p>{sub}</p></div></div>
                <Toggle on={on} onClick={toggle} />
              </div>
            ))}
          </div>

        </div>

        <div className={styles.rightColumn}>

          <div className={styles.card}>
            <h3 className={styles.cardTitle}><FiActivity /> Statistika</h3>
            <div className={styles.statList}>
              {[
                { icon: <FiCalendar className={styles.statIcon} />, label: "Ro'yxatdan o'tgan", value: user?.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString('uz-UZ') : '—' },
                { icon: <FiCreditCard className={`${styles.statIcon} ${styles.greenText}`} />, label: 'Jami tranzaksiyalar', value: stats.totalCount.toString() },
                { icon: <FiDollarSign className={`${styles.statIcon} ${styles.redText}`} />, label: 'Jami xarajat', value: `${stats.expense.toLocaleString('uz-UZ')} so'm` },
                { icon: <FaArrowTrendUp className={`${styles.statIcon} ${styles.purpleText}`} />, label: 'Jami daromad', value: `${stats.income.toLocaleString('uz-UZ')} so'm` },
              ].map(({ icon, label, value }) => (
                <div className={styles.statItem} key={label}>
                  {icon}<div><p>{label}</p><h4>{value}</h4></div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Hisob harakatlari</h3>
            <div className={styles.actionMenu}>
              <button className={styles.menuItem}><FiMapPin /> Manzilni yangilash</button>
              <button className={styles.menuItem}><FiCreditCard /> To'lov usullari</button>
              <button className={styles.menuItem}><FiShield /> Maxfiylik</button>
              <button className={`${styles.menuItem} ${styles.logoutBtn}`} onClick={() => signOut(auth).then(() => navigate('/'))}>
                <FiLogOut /> Hisobdan chiqish
              </button>
            </div>
          </div>

          <div className={styles.card}>
            <h3 className={styles.cardTitle}>So'nggi faoliyat</h3>
            <div className={styles.timeline}>
              {[
                { dot: styles.dotGreen, title: 'Tizimga kirish', time: 'Hozirgina' },
                { dot: styles.dotBlue, title: 'Profil tahrirlandi', time: '1 kun oldin' },
                { dot: styles.dotPurple, title: 'Yangi qurilma', time: '3 kun oldin' },
              ].map(({ dot, title, time }) => (
                <div className={styles.timelineItem} key={title}>
                  <span className={`${styles.dot} ${dot}`} />
                  <div><h4>{title}</h4><p>{time}</p></div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Profile