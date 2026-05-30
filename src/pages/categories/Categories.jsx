import React, { useState, useEffect, useMemo, useCallback } from 'react'
import styles from './Categories.module.css'
import { LuCar, LuGamepad2, LuShoppingCart, LuUtensils } from 'react-icons/lu'
import { FiHome, FiCoffee, FiHeart, FiGift, FiBriefcase, FiSmartphone, FiBookOpen, FiX } from 'react-icons/fi'
import { TbShirt } from 'react-icons/tb'
import { RiDeleteBin6Line } from 'react-icons/ri'
import { GrEdit } from 'react-icons/gr'
import CategoryModal from '../../components/modals/CategoryModal'
import DelConfirmModal from '../../components/modals/DelConfirm'
import { db, auth } from '../../firebase/firebaseConfig'
import { doc, deleteDoc } from 'firebase/firestore'
import { subscribeToTransactions, subscribeToCategories } from '../../services/financeService'

const ICONS = [
  <LuShoppingCart />, <LuCar />, <FiHome />, <LuGamepad2 />, <FiCoffee />, <FiHeart />,
  <FiBriefcase />, <FiGift />, <FiSmartphone />, <FiBookOpen />, <TbShirt />, <LuUtensils />
]

const Categories = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDelModalOpen, setIsDelModalOpen] = useState(false)
  const [categories, setCategories] = useState([])
  const [transactions, setTransactions] = useState([]) 
  const [selectedCategory, setSelectedCategory] = useState(null)

  // Real-time listenerlarni bir marta o'rnatish
  useEffect(() => {
    const unsubscribeCat = subscribeToCategories(setCategories);
    const unsubscribeTx = subscribeToTransactions(setTransactions);

    return () => {
      unsubscribeCat();
      unsubscribeTx();
    };
  }, [])

  // Tranzaksiyalar soni, summasi va foiz ko'rsatkichlarini hisoblashni keshlashtirish
  const finalCategories = useMemo(() => {
    const calculated = categories.map(cat => {
      const catNameLower = cat.name?.toLowerCase().trim();
      const matchedTransactions = transactions.filter(tx => tx.category?.toLowerCase().trim() === catNameLower);
      
      return {
        ...cat,
        count: matchedTransactions.length,
        amount: matchedTransactions.reduce((sum, tx) => sum + Number(tx.amount || 0), 0)
      };
    });

    const totalAllCategoriesAmount = calculated.reduce((sum, cat) => sum + Math.abs(cat.amount), 0);

    return calculated.map(cat => ({
      ...cat,
      percentage: totalAllCategoriesAmount > 0 
        ? Math.round((Math.abs(cat.amount) / totalAllCategoriesAmount) * 100) 
        : 0
    }));
  }, [categories, transactions]);

  // Click funksiyalarini xotirada qayta yaratilishidan himoya qilish
  const handleEditClick = useCallback((e, cat) => {
    e.stopPropagation()
    setSelectedCategory(cat)
    setIsModalOpen(true)
  }, [])

  const handleDeleteClick = useCallback((e, cat) => {
    e.stopPropagation()
    setSelectedCategory(cat)
    setIsDelModalOpen(true)
  }, [])

  const handleConfirmDelete = useCallback(async () => {
    const uid = auth.currentUser?.uid
    if (!uid || !selectedCategory) return
    try {
      await deleteDoc(doc(db, 'users', uid, 'categories', selectedCategory.id))
      setIsDelModalOpen(false)
      setSelectedCategory(null)
    } catch (err) {
      console.error(err)
    }
  }, [selectedCategory])

  return (
    <div className={styles.categories}>
      <div className={styles.ctHdr}>
        <div>
          <p className={styles.ctTitle}>Kategoriyalar</p>
          <p className={styles.ctDesc}>Xarajatlaringizni kategoriyalar bo'yicha boshqaring</p>
        </div>
        <button className={styles.button} onClick={() => { setSelectedCategory(null); setIsModalOpen(true); }}>
          <span>+</span>Yangi kategoriya
        </button>
        <CategoryModal 
          isOpen={isModalOpen} 
          onClose={() => { setIsModalOpen(false); setSelectedCategory(null); }} 
          categoryData={selectedCategory}
        />
        <DelConfirmModal 
          isOpen={isDelModalOpen} 
          onClose={() => { setIsDelModalOpen(false); setSelectedCategory(null); }} 
          onConfirm={handleConfirmDelete}
          title="Kategoriyani o'chirish"
          description="Ushbu kategoriyani o'chirishni xohlaysizmi?"
        />
      </div>

      {finalCategories.length === 0 ? (
        <p style={{ color: '#9ca3af', fontSize: '1.4rem', marginTop: '2rem' }}>
          Hali kategoriya qo'shilmagan
        </p>
      ) : (
        <>
          <div className={styles.gridContainer}>
            {finalCategories.map(cat => (
              <div key={cat.id} className={styles.card}>
                <div className={styles.actionsOverlay}>
                  <button onClick={(e) => handleEditClick(e, cat)} className={styles.editBtn}>
                    <GrEdit />
                  </button>
                  <button onClick={(e) => handleDeleteClick(e, cat)} className={styles.deleteBtn}>
                    <RiDeleteBin6Line />
                  </button>
                </div>
                <div className={styles.cardTop}>
                  <div className={styles.iconCircle} style={{ backgroundColor: cat.color }}>
                    {ICONS[cat.iconIndex]}
                  </div>
                  <p className={styles.percentage}>{cat.percentage}%</p>
                </div>
                <div className={styles.cardMain}>
                  <p className={styles.title}>{cat.name}</p>
                  <p className={styles.count}>{cat.count} ta tranzaksiya</p>
                  <p className={styles.amount}>{cat.amount.toLocaleString('uz-UZ')} so'm</p>
                </div>
                <div className={styles.progressBarBg}>
                  <div className={styles.progressBarFill} style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }} />
                </div>
              </div>
            ))}
          </div>

          <div className={styles.container}>
            <h3 className={styles.headerTitle}>Umumiy xarajatlar</h3>
            <div className={styles.list}>
              {finalCategories.map(item => (
                <div key={item.id} className={styles.row}>
                  <div className={styles.iconCircle} style={{ backgroundColor: item.color }}>
                    {ICONS[item.iconIndex]}
                  </div>
                  <div className={styles.content}>
                    <div className={styles.topInfo}>
                      <span className={styles.title}>{item.name}</span>
                      <span className={styles.amount}>{item.amount.toLocaleString('uz-UZ')} so'm</span>
                    </div>
                    <div className={styles.progressContainer}>
                      <div className={styles.progressBarBg}>
                        <div className={styles.progressBarFill} style={{ width: `${item.percentage}%`, backgroundColor: item.color }} />
                      </div>
                    </div>
                  </div>
                  <span className={styles.percentage}>{item.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Categories