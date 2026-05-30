import React from 'react'
import { FiX, FiAlertTriangle } from 'react-icons/fi'
import styles from './DelConfirm.module.css'

function DelConfirmModal({ isOpen, onClose, onConfirm, title, description }) {
  if (!isOpen) return null

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3>{title || "O'chirish"}</h3>
          <button className={styles.closeBtn} onClick={onClose}><FiX /></button>
        </div>
        <div className={styles.warningBox}>
          <div className={styles.warningIcon}><FiAlertTriangle /></div>
          <div className={styles.warningText}>
            <p>{description || "Ushbu ma'lumotni o'chirishni xohlaysizmi?"}</p>
            <p>Bu amalni qaytarib bo'lmaydi.</p>
          </div>
        </div>
        <div className={styles.modalActions}>
          <button className={styles.cancelBtn} onClick={onClose}>Bekor qilish</button>
          <button className={styles.deleteBtn} onClick={onConfirm}>O'chirish</button>
        </div>
      </div>
    </div>
  )
}

export default DelConfirmModal