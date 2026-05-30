import React, { useState, useEffect } from 'react';
import styles from './TransactionModal.module.css';
import { db, auth } from "../../firebase/firebaseConfig";
import { collection, addDoc, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { FiArrowDownRight, FiArrowUpRight } from 'react-icons/fi';

const initialForm = { title: '', amount: '', category: '', date: new Date().toISOString().split('T')[0], type: 'expense' };

function TransactionModal({ isOpen, onClose, editingTransaction }) {
  const [form, setForm] = useState(initialForm);

  // Formani to'ldirish
  useEffect(() => {
    if (editingTransaction) {
      setForm({
        ...editingTransaction,
        amount: Math.abs(Number(editingTransaction.amount))
      });
    } else {
      setForm(initialForm);
    }
  }, [editingTransaction, isOpen]);

  // Escape (Esc) tugmasi bosilganda yopilishi logikasi
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    const amount = form.type === 'expense' ? -Math.abs(Number(form.amount)) : Math.abs(Number(form.amount));
    const formattedCategory = form.category.trim().charAt(0).toUpperCase() + form.category.trim().slice(1);
    
    const finalData = { 
      title: form.title.trim(),
      category: formattedCategory,
      amount,
      date: form.date,
      type: form.type,
      updatedAt: serverTimestamp()
    };

    try {
      if (editingTransaction?.id) {
        const docRef = doc(db, "users", uid, "transactions", editingTransaction.id);
        await updateDoc(docRef, finalData);
      } else {
        const colRef = collection(db, "users", uid, "transactions");
        await addDoc(colRef, { ...finalData, createdAt: serverTimestamp() });
      }
      onClose(); // Muvaffaqiyatli qo'shilgach / yangilangach modalni yopish
    } catch (err) {
      console.error("Saqlashda xatolik:", err);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <form className={styles.modalContent} onClick={e => e.stopPropagation()} onSubmit={handleSubmit}>
        <div className={styles.modalHeader}>
          <h3>{editingTransaction ? "Tahrirlash" : "Yangi tranzaksiya"}</h3>
          <button type="button" className={styles.closeBtn} onClick={onClose}>×</button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.inputGroup}>
            <label>Nomi</label>
            <input type="text" name="title" value={form.title} onChange={handleChange} placeholder="Masalan: Supermarket" required />
          </div>

          <div className={styles.inputGroup}>
            <label>Summa</label>
            <input type="number" name="amount" value={form.amount} onChange={handleChange} min="1" placeholder="0" required />
          </div>

          <div className={styles.inputGroup}>
            <label>Kategoriya</label>
            <input type="text" name="category" value={form.category} onChange={handleChange} placeholder="Masalan: Ovqat" required />
          </div>

          <div className={styles.inputGroup}>
            <label>Sana</label>
            <input type="date" name="date" value={form.date} onChange={handleChange} required />
          </div>

          <div className={styles.inputGroup}>
            <label>Turi</label>
            <div className={styles.typeSelector}>
              {['expense', 'income'].map(t => (
                <button 
                  key={t} type="button" 
                  className={`${styles.typeBtn} ${form.type === t ? styles[`active${t.charAt(0).toUpperCase() + t.slice(1)}`] : ''}`}
                  onClick={() => setForm({ ...form, type: t })}
                >
                  {t === 'expense' ? (
                    <><FiArrowUpRight className={styles.ic}/> Xarajat</>
                  ) : (
                    <><FiArrowDownRight className={styles.ic}/> Daromad</>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.modalActions}>
          <button type="button" className={styles.cancelBtn} onClick={onClose}>Bekor qilish</button>
          <button type="submit" className={styles.submitBtn}>{editingTransaction ? "Yangilash" : "Qo'shish"}</button>
        </div>
      </form>
    </div>
  );
}

export default TransactionModal;