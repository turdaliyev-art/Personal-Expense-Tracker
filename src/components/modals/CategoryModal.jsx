import React, { useState, useEffect } from 'react'
import { FiX, FiHome, FiCoffee, FiHeart, FiBriefcase, FiGift, FiSmartphone, FiBookOpen } from 'react-icons/fi'
import { LuGamepad2, LuShoppingCart, LuUtensils, LuCar } from 'react-icons/lu'
import { TbShirt } from 'react-icons/tb'
import styles from './CategoryModal.module.css'
import { db, auth } from '../../firebase/firebaseConfig'
import { collection, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore'

const ICONS = [
  <LuShoppingCart />, <LuCar />, <FiHome />, <LuGamepad2 />, <FiCoffee />, <FiHeart />,
  <FiBriefcase />, <FiGift />, <FiSmartphone />, <FiBookOpen />, <TbShirt />, <LuUtensils />
]

const COLORS = [
  'var(--blue)', 'var(--green-2)', 'var(--carrot-clr)', 'var(--violet)', 'var(--pink)',
  'var(--carrot-clr-2)', 'var(--blue-2)', 'var(--gold-clr)', 'var(--aqua)', 'var(--aqua-2)'
]

function CategoryModal({ isOpen, onClose, categoryData }) {
  const [name, setName] = useState('')
  const [selectedIcon, setSelectedIcon] = useState(0)
  const [selectedColor, setSelectedColor] = useState(COLORS[0])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      if (categoryData) {
        setName(categoryData.name || '')
        setSelectedIcon(Number(categoryData.iconIndex) || 0)
        setSelectedColor(categoryData.color || COLORS[0])
      } else {
        setName('')
        setSelectedIcon(0)
        setSelectedColor(COLORS[0])
      }
    }
  }, [categoryData, isOpen])

  if (!isOpen) return null

  const handleSubmit = async () => {
    if (!name.trim()) return
    const uid = auth.currentUser?.uid
    if (!uid) return

    try {
      setLoading(true)
      
      if (categoryData && categoryData.id) {
        const docRef = doc(db, 'users', uid, 'categories', categoryData.id)
        await updateDoc(docRef, {
          name: name.trim(),
          iconIndex: selectedIcon,
          color: selectedColor
        })
      } else {
        await addDoc(collection(db, 'users', uid, 'categories'), {
          name: name.trim(),
          iconIndex: selectedIcon,
          color: selectedColor,
          count: 0,
          amount: 0,
          percentage: 0,
          createdAt: serverTimestamp()
        })
      }
      
      onClose()
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        
        <div className={styles.modalHeader}>
          <h3>{categoryData ? 'Kategoriyani tahrirlash' : 'Yangi kategoriya'}</h3>
          <button className={styles.closeBtn} onClick={onClose}><FiX /></button>
        </div>

        <div className={styles.inputGroup}>
          <label>Kategoriya nomi</label>
          <input
            type="text"
            placeholder="Masalan: Ovqat"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>

        <div className={styles.section}>
          <label className={styles.sectionLabel}>Icon tanlang</label>
          <div className={styles.iconGrid}>
            {ICONS.map((icon, i) => (
              <button
                key={i}
                type="button"
                className={`${styles.iconItem} ${selectedIcon === i ? styles.activeIcon : ''}`}
                onClick={() => setSelectedIcon(i)}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <label className={styles.sectionLabel}>Rang tanlang</label>
          <div className={styles.colorGrid}>
            {COLORS.map((color, i) => (
              <button
                key={i}
                type="button"
                className={`${styles.colorItem} ${selectedColor === color ? styles.activeColor : ''}`}
                style={{ backgroundColor: color }}
                onClick={() => setSelectedColor(color)}
              />
            ))}
          </div>
        </div>

        <div className={styles.modalActions}>
          <button type="button" className={styles.cancelBtn} onClick={onClose}>Bekor qilish</button>
          <button type="button" className={styles.submitBtn} onClick={handleSubmit} disabled={loading}>
            {loading ? 'Saqlanmoqda...' : categoryData ? 'Saqlash' : "Qo'shish"}
          </button>
        </div>

      </div>
    </div>
  )
}

export default CategoryModal