import React, { useState } from 'react';


import { 
  FiX, FiHome, 
  FiCoffee, FiHeart, FiBriefcase, 
  FiGift, FiSmartphone, FiBookOpen, FiActivity, 
} from 'react-icons/fi';
import {  LuGamepad2, LuShoppingCart ,LuUtensils,LuCar} from "react-icons/lu";

import styles from './CategoryModal.module.css';
import { TbShirt } from 'react-icons/tb';

function CategoryModal({ isOpen, onClose }) {
  const [selectedIcon, setSelectedIcon] = useState(0);
  const [selectedColor, setSelectedColor] = useState('#2563eb');

  if (!isOpen) return null;

  // Dizayndagi ikonkar ro'yxati
  const icons = [
    <LuShoppingCart />, <LuCar />, <FiHome />, <LuGamepad2 />, <FiCoffee />, <FiHeart />,
    <FiBriefcase />, <FiGift />, <FiSmartphone />, <FiBookOpen />, <TbShirt  />, <LuUtensils />
  ];

  // Dizayndagi ranglar palitrasi
  const colors = [
    'var(--blue)', 'var(--green-2)', 'var(--carrot-clr)', 'var(--violet)', 'var(--pink)',
    'var(--carrot-clr-2)', 'var(--blue-2)', 'var(--gold-clr)', 'var(--aqua)', 'var(--aqua-2)'
  ];

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className={styles.modalHeader}>
          <h3>Yangi kategoriya</h3>
          <button className={styles.closeBtn} onClick={onClose}>
            <FiX />
          </button>
        </div>

        {/* Input Group */}
        <div className={styles.inputGroup}>
          <label>Kategoriya nomi</label>
          <input type="text"  placeholder="Masalan: Ovqat" />
        </div>

        {/* Icon Grid */}
        <div className={styles.section}>
          <label className={styles.sectionLabel}>Icon tanlang</label>
          <div className={styles.iconGrid}>
            {icons.map((icon, index) => (
              <button 
                key={index} 
                className={`${styles.iconItem} ${selectedIcon === index ? styles.activeIcon : ''}`}
                onClick={() => setSelectedIcon(index)}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        {/* Color Grid */}
        <div className={styles.section}>
          <label className={styles.sectionLabel}>Rang tanlang</label>
          <div className={styles.colorGrid}>
            {colors.map((color, index) => (
              <button 
                key={index} 
                className={`${styles.colorItem} ${selectedColor === color ? styles.activeColor : ''}`}
                style={{ backgroundColor: color }}
                onClick={() => setSelectedColor(color)}
              />
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className={styles.modalActions}>
          <button className={styles.cancelBtn} onClick={onClose}>Bekor qilish</button>
          <button className={styles.submitBtn}>Qo'shish</button>
        </div>  
      </div>
    </div>
  );
}

export default CategoryModal;