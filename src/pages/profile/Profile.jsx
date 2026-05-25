import React, { useState, useRef } from 'react';
import { 
  FiCamera, FiUser, FiMail, FiPhone, FiMapPin, 
  FiLock, FiShield, FiCalendar, FiDollarSign, 
  FiCreditCard, FiLogOut, FiActivity, FiBell, FiMoon 
} from 'react-icons/fi';
import styles from './Profile.module.css';
import { FaArrowTrendUp } from 'react-icons/fa6';

function Profile() {
  // --- AVATAR STATE (LOCALSTORAGE) ---
  const [avatar, setAvatar] = useState(() => {
    return localStorage.getItem('user_avatar') || null;
  });
  
  const fileInputRef = useRef(null);

  // --- SOZLAMALAR STATES (LOCALSTORAGE) ---
  const [pushNotif, setPushNotif] = useState(() => {
    const saved = localStorage.getItem('setting_push');
    return saved !== null ? JSON.parse(saved) : true; // default yoqilgan
  });
  
  const [emailNotif, setEmailNotif] = useState(() => {
    const saved = localStorage.getItem('setting_email');
    return saved !== null ? JSON.parse(saved) : false; // default o'chirilgan
  });
  
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('setting_dark');
    return saved !== null ? JSON.parse(saved) : false; // default o'chirilgan
  });

  // --- HANDLERS ---
  const handleCameraButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setAvatar(base64String);
        localStorage.setItem('user_avatar', base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleToggle = (type) => {
    if (type === 'push') {
      setPushNotif(!pushNotif);
      localStorage.setItem('setting_push', JSON.stringify(!pushNotif));
    } else if (type === 'email') {
      setEmailNotif(!emailNotif);
      localStorage.setItem('setting_email', JSON.stringify(!emailNotif));
    } else if (type === 'dark') {
      setDarkMode(!darkMode);
      localStorage.setItem('setting_dark', JSON.stringify(!darkMode));
      // Xohlasangiz bu yerda butun body'ga dark-mode classini qo'shib qo'yish mumkin:
      // document.body.classList.toggle('dark-theme');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user_avatar');
    setAvatar(null);
    alert("Hisobdan chiqildi!");
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.pageTitle}>Profil</h2>
        <p className={styles.pageSubtitle}>Shaxsiy ma'lumotlaringizni boshqaring</p>
      </div>

      <div className={styles.mainLayout}>
        {/* CHAP USTUN */}
        <div className={styles.leftColumn}>
          
          {/* Avatar Card */}
          <div className={styles.card}>
            <div className={styles.avatarSection}>
              <div className={styles.avatarWrapper}>
                <div className={styles.avatar}>
                  {avatar ? (
                    <img src={avatar} alt="Avatar" className={styles.avatarImg} />
                  ) : (
                    <FiUser />
                  )}
                </div>
                <button type="button" className={styles.uploadBtn} onClick={handleCameraButtonClick}>
                  <FiCamera />
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/*" 
                  style={{ display: 'none' }} 
                />
              </div>
              
              <div className={styles.profileMeta}>
                <h3 className={styles.userName}>Foydalanuvchi</h3>
                <p className={styles.userEmail}>user@example.com</p>
                <div className={styles.badgeRow}>
                  <span className={`${styles.badge} ${styles.premium}`}>Premium foydalanuvchi</span>
                  <span className={`${styles.badge} ${styles.active}`}>Faol</span>
                </div>
              </div>
            </div>
          </div>

          {/* Shaxsiy Ma'lumotlar Card */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>
              <FiUser /> Shaxsiy ma'lumotlar
            </h3>
            <form className={styles.formGrid} onSubmit={(e) => e.preventDefault()}>
              <div className={styles.inputGroup}>
                <label>Ism</label>
                <input type="text" placeholder="Foydalanuvchi" />
              </div>
              <div className={styles.inputGroup}>
                <label>Email</label>
                <input type="email" placeholder="user@example.com" />
              </div>
              <div className={styles.inputGroup}>
                <label>Telefon</label>
                <input type="text" placeholder="+998 90 123 45 67" />
              </div>
              <div className={styles.inputGroup}>
                <label>Manzil</label>
                <input type="text" placeholder="Toshkent, O'zbekiston" />
              </div>
              <button type="submit" className={styles.saveBtn}>O'zgarishlarni saqlash</button>
            </form>
          </div>

          {/* Xavfsizlik Sozlamalari Card */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>
              <FiShield /> Xavfsizlik sozlamalari
            </h3>
            
            <div className={styles.subCard}>
              <div className={styles.subCardHeader}>
                <FiLock className={styles.subCardIcon} />
                <div>
                  <h4>Parolni o'zgartirish</h4>
                  <p>Oxirgi o'zgarish: 30 kun oldin</p>
                </div>
              </div>
              <div className={styles.passwordForm}>
                <input type="password" placeholder="Eski parol" />
                <input type="password" placeholder="Yangi parol" />
                <button className={styles.actionOutlineBtn}>Parolni yangilash</button>
              </div>
            </div>

            <div className={styles.twoFactorRow}>
              <div>
                <h4>Ikki bosqichli autentifikatsiya</h4>
                <p>Qo'shimcha xavfsizlik qatlami</p>
              </div>
              <button className={styles.toggleBtn}>Yoqish</button>
            </div>
          </div>

          {/* YANGI QO'SHILGAN: Sozlamalar Card (Dizayn davomi) */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>
              <FiBell /> Sozlamalar
            </h3>
            
            <div className={styles.settingRow}>
              <div className={styles.settingInfo}>
                <FiBell className={styles.settingIcon} />
                <div>
                  <h4>Push bildirishnomalar</h4>
                  <p>Yangi xarajatlar haqida xabarnoma</p>
                </div>
              </div>
              <div 
                className={`${styles.switch} ${pushNotif ? styles.switchOn : ''}`} 
                onClick={() => handleToggle('push')}
              >
                <div className={styles.switchHandle}></div>
              </div>
            </div>

            <div className={styles.settingRow}>
              <div className={styles.settingInfo}>
                <FiMail className={styles.settingIcon} />
                <div>
                  <h4>Email xabarnolar</h4>
                  <p>Haftalik hisobotlar</p>
                </div>
              </div>
              <div 
                className={`${styles.switch} ${emailNotif ? styles.switchOn : ''}`} 
                onClick={() => handleToggle('email')}
              >
                <div className={styles.switchHandle}></div>
              </div>
            </div>

            <div className={styles.settingRow}>
              <div className={styles.settingInfo}>
                <FiMoon className={styles.settingIcon} />
                <div>
                  <h4>Tungi rejim</h4>
                  <p>Qorong'i interfeys</p>
                </div>
              </div>
              <div 
                className={`${styles.switch} ${darkMode ? styles.switchOn : ''}`} 
                onClick={() => handleToggle('dark')}
              >
                <div className={styles.switchHandle}></div>
              </div>
            </div>
          </div>

        </div>
      

        {/* O'NG USTUN */}
        <div className={styles.rightColumn}>
          
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>
              <FiActivity /> Statistika
            </h3>
            <div className={styles.statList}>
              <div className={styles.statItem}>
                <FiCalendar className={styles.statIcon} />
                <div>
                  <p>Ro'yxatdan o'tgan</p>
                  <h4>15 Yanvar, 2026</h4>
                </div>
              </div>
              <div className={styles.statItem}>
                <FiCreditCard className={`${styles.statIcon} ${styles.greenText}`} />
                <div>
                  <p>Jami tranzaksiyalar</p>
                  <h4>847</h4>
                </div>
              </div>
              <div className={styles.statItem}>
                <FiDollarSign className={`${styles.statIcon} ${styles.redText}`} />
                <div>
                  <p>Jami xarajat</p>
                  <h4>12,450,000 so'm</h4>
                </div>
              </div>
              <div className={styles.statItem}>
                <FaArrowTrendUp className={`${styles.statIcon} ${styles.purpleText}`} />
                <div>
                  <p>Jami daromad</p>
                  <h4>24,000,000 so'm</h4>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Hisob harakatlari</h3>
            <div className={styles.actionMenu}>
              <button className={styles.menuItem}>
                <FiMapPin /> Manzilni yangilash
              </button>
              <button className={styles.menuItem}>
                <FiCreditCard /> To'lov usullarini boshqarish
              </button>
              <button className={styles.menuItem}>
                <FiShield /> Maxfiylik sozlamalari
              </button>
              <button className={`${styles.menuItem} ${styles.logoutBtn}`} onClick={handleLogout}>
                <FiLogOut /> Hisobdan chiqish
              </button>
            </div>
          </div>

          <div className={styles.card}>
            <h3 className={styles.cardTitle}>So'nggi faoliyat</h3>
            <div className={styles.timeline}>
              <div className={styles.timelineItem}>
                <span className={`${styles.dot} ${styles.dotGreen}`}></span>
                <div>
                  <h4>Parol yangilandi</h4>
                  <p>2 soat oldin</p>
                </div>
              </div>
              <div className={styles.timelineItem}>
                <span className={`${styles.dot} ${styles.dotBlue}`}></span>
                <div>
                  <h4>Profil tahrirlandi</h4>
                  <p>1 kun oldin</p>
                </div>
              </div>
              <div className={styles.timelineItem}>
                <span className={`${styles.dot} ${styles.dotPurple}`}></span>
                <div>
                  <h4>Yangi qurilma</h4>
                  <p>3 kun oldin</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Profile;