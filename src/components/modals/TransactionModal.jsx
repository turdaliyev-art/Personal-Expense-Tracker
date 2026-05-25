import React, { useState } from 'react';
import styles from './TransactionModal.module.css';

function TransactionModal({ isOpen, onClose }) {
  const [type, setType] = useState('expense'); // 'expense' yoki 'income'

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className={styles.modalHeader}>
          <h3>Yangi tranzaksiya</h3>
          <button type="button" className={styles.closeBtn} onClick={onClose}>
            {/* Toza X yopish belgisi */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {/* Form Body */}
        <div className={styles.modalBody}>
          
          {/* Nomi */}
          <div className={styles.inputGroup}>
            <label>Nomi</label>
            <input type="text" placeholder="Masalan: Supermarket" />
          </div>

          {/* Summa */}
          <div className={styles.inputGroup}>
            <label>Summa (so'm)</label>
            <input type="number" placeholder="0" defaultValue="0" />
          </div>

          {/* Kategoriya */}
          <div className={styles.inputGroup}>
            <label>Kategoriya</label>
            <select defaultValue="">
              <option value="" disabled hidden>Masalan: Ovqat</option>
              <option value="ovqat">Ovqat</option>
              <option value="transport">Transport</option>
              <option value="tolovlar">To'lovlar</option>
              <option value="kafe">Kafe</option>
            </select>
          </div>

          {/* Sana */}
          <div className={styles.inputGroup}>
            <label>Sana</label>
            <input type="date" defaultValue={new Date().toISOString().split('T')[0]} />
          </div>

          {/* Turi (Xarajat / Daromad) */}
          <div className={styles.inputGroup}>
            <label>Turi</label>
            <div className={styles.typeSelector}>
              <button 
                type="button" 
                className={`${styles.typeBtn} ${styles.expenseBtn} ${type === 'expense' ? styles.activeExpense : ''}`}
                onClick={() => setType('expense')}
              >
                {/* Qizil tepaga qaragan arrow */}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
                Xarajat
              </button>
              
              <button 
                type="button" 
                className={`${styles.typeBtn} ${styles.incomeBtn} ${type === 'income' ? styles.activeIncome : ''}`}
                onClick={() => setType('income')}
              >
                {/* Yashil pastga qaragan arrow */}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="17" y1="7" x2="7" y2="17"></line><polyline points="17 17 7 17 7 7"></polyline></svg>
                Daromad
              </button>
            </div>
          </div>

        </div>

        {/* Action Buttons */}
        <div className={styles.modalActions}>
          <button type="button" className={styles.cancelBtn} onClick={onClose}>Bekor qilish</button>
          <button type="button" className={styles.submitBtn}>Qo'shish</button>
        </div>

      </div>
    </div>
  );
}

export default TransactionModal;