import React, { useState } from 'react'
import styles from "./Categories.module.css"
import { LuBriefcase, LuCar, LuGamepad2, LuShoppingCart } from "react-icons/lu";
  
import {  
  FiHome, 
  FiCoffee, 
  FiHeart, 
  FiGift ,
  FiBriefcase, 
} from 'react-icons/fi';
import CategoryModal from '../../components/modals/CategoryModal';

const Categories = () => {

  const [isModalOpen, setIsModalOpen] = useState(false);
      const categories = [
        { id: 1, title: "Ovqat", count: 24, amount: 850000, percentage: 25.2, color: 'var(--blue)', icon: <LuShoppingCart /> },
        { id: 2, title: "Transport", count: 15, amount: 420000, percentage: 12.5, color: 'var(--green-2)', icon: <LuCar /> },
        { id: 3, title: 'To\'lovlar', count: 8, amount: 650000, percentage: 19.3, color: "var(--carrot-clr)", icon: <FiHome /> },
        { id: 4, title: 'O\'yin-kulgi', count: 12, amount: 320000, percentage: 9.5, color: "var(--violet)", icon: <LuGamepad2 /> },
        { id: 5, title: 'Kafe', count: 18, amount: 280000, percentage: 8.3, color: "var(--pink)", icon: <FiCoffee /> },
        { id: 6, title: 'Salomatlik', count: 6, amount: 450000, percentage: 13.4, color: "var(--carrot-clr-2)", icon: <FiHeart /> },
        { id: 7, title: 'Ish', count: 9, amount: 180000, percentage: 5.3, color: "var( --blue-2)", icon: <LuBriefcase /> },
        { id: 8, title: 'Sovg\'alar', count: 7, amount: 220000, percentage: 6.5, color: "var(--gold-clr)", icon: <FiGift /> }
    ];


    
  return (
    <div className={styles.categories}>
            <div className={styles.ctHdr}>
        <div>
          <p className={styles.ctTitle}>Kategoriyalar</p>
          <p className={styles.ctDesc}>Xarajatlaringizni kategoriyalar bo'yicha boshqaring</p>
        </div>
        <button className={styles.button} onClick={() => setIsModalOpen(true)}><span>+</span>Yangi kategoriya</button>
        <CategoryModal isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}/>
      </div>

        <div className={styles.gridContainer}>
          {categories.map((cat) => (
            <div key={cat.id} className={styles.card}>
              <div className={styles.cardTop}>
                <div className={styles.iconCircle} style={{ backgroundColor: cat.color }}>
                  {cat.icon}
                </div>
                <p className={styles.percentage}>{cat.percentage}%</p>
              </div>

              <div className={styles.cardMain}>
                <p className={styles.title}>{cat.title}</p>
                <p className={styles.count}>{cat.count} ta tranzaksiya</p>
                <p className={styles.amount}>{cat.amount.toLocaleString('uz-UZ')} so'm</p>
              </div>

              <div className={styles.progressBarBg}>
                <div 
                  className={styles.progressBarFill} 
                  style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }}
                />
              </div>
            </div>
          ))}
        </div>

        
            <div className={styles.container}>
          <h3 className={styles.headerTitle}>Umumiy xarajatlar</h3>
          
          <div className={styles.list}>
            {categories.map((item) => (
              <div key={item.id} className={styles.row}>
                <div className={styles.iconCircle} style={{ backgroundColor: item.color }}>
                  {item.icon}
                </div>

                <div className={styles.content}>
                  <div className={styles.topInfo}>
                    <span className={styles.title}>{item.title}</span>
                    <span className={styles.amount}>{item.amount.toLocaleString('uz-UZ')} so'm</span>
                  </div>

                  <div className={styles.progressContainer}>
                    <div className={styles.progressBarBg}>
                      <div 
                        className={styles.progressBarFill} 
                        style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                      />
                    </div>
                  </div>
                </div>
                    <span className={styles.percentage}>{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        </div>
  )
}

export default Categories
