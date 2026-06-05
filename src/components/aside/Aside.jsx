import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import styles from "./Aside.module.css"
import { TbWallet } from "react-icons/tb"
import { IoMenu, IoClose } from "react-icons/io5"
import { links } from "../constants/data"

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <aside>
      <div className={styles.asideBurger} onClick={() => setIsOpen(true)}>
        <IoMenu />
      </div>

      <div 
        className={`${styles.overlay} ${isOpen ? styles.show : ""}`} 
        onClick={() => setIsOpen(false)}
      />

      <div className={`${styles.asideContainer} ${isOpen ? styles.open : ""}`}>
        <div className={styles.asideHdr}>
          <div className={styles.hdrLogo}>
            <TbWallet/>
          </div>
          <div>
            <p className={styles.asideHdrtext}>Xarajatlar</p>
            <p className={styles.asideDesc}>Boshqaruv tizimi</p>
          </div>
          <div className={styles.closeIc} onClick={() => setIsOpen(false)}>
            <IoClose />
          </div>
        </div>
        
        <ul>
          {links.map((link) => (
            <li key={link.title}>
              <NavLink
                end
                className={({ isActive }) => (isActive ? styles.active : "")}
                to={link.path}
                onClick={() => setIsOpen(false)}
              >
                <span className={styles.asideIc}>{link.icon}</span>
                {link.title}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}

export default Sidebar