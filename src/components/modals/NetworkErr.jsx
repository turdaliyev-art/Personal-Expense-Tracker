import React, { useState, useEffect } from 'react';
import { FiWifiOff } from 'react-icons/fi';
import styles from './NetworkErr.module.css';

const NetworkErr = () => {
  
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.iconCircle}>
          <FiWifiOff />
        </div>
        <h3 className={styles.title}>Internet aloqasi yo'q</h3>
        <p className={styles.description}>
          Iltimos, tarmoq ulanishini tekshiring. Internet tiklangandan so'ng dastur avtomatik ishlashda davom etadi.
        </p>
        <button className={styles.button} onClick={() => setIsOffline(!navigator.onLine)}>
          Qayta tekshirish
        </button>
      </div>
    </div>
  );
};

export default NetworkErr;