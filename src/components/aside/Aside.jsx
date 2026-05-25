import React from 'react'
import { NavLink } from 'react-router-dom'
import styles from "./Aside.module.css"
import { TbWallet } from "react-icons/tb";
import { TbLayoutDashboard } from "react-icons/tb";
import { GoArrowSwitch } from "react-icons/go";
import { RiFolderChartLine } from "react-icons/ri";
import { FaRegChartBar } from "react-icons/fa";
import { FiUser } from "react-icons/fi";
import { links } from "../constants/data";


function Sidebar() {
  return (
    <aside>
      <div className={styles.asideContainer}>

        <div className={styles.asideHdr}>
              <div className={styles.hdrLogo}>
                  <TbWallet/>
              </div>
              <div>
                  <p className={styles.asideHdrtext}>Xarajatlar</p>
                  <p className={styles.asideDesc}>Boshqaruv tizimi</p>
              </div>
        </div>
        <ul>
          {links.map((link) => (
            <li key={link.title}>
              <NavLink
                end
                className={({ isActive }) => (isActive ? styles.active : "")}
                to={link.path}
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

/* 
 <ul>
        <li><NavLink to="/"className={({ isActive }) => isActive ? styles.active : ""}><TbLayoutDashboard className={styles.asideIc}/>Dashboard</NavLink></li>
        <li><NavLink to="/products"className={({ isActive }) => isActive ? styles.active : ""}><GoArrowSwitch className={styles.asideIc}/>Tranzaksiyalar</NavLink></li>
        <li><NavLink to="/categories"className={({ isActive }) => isActive ? styles.active : ""}><RiFolderChartLine className={styles.asideIc}/>Kategoriyalar</NavLink></li>
        <li><NavLink to="/Statistic"className={({ isActive }) => isActive ? styles.active : ""}><FaRegChartBar  className={styles.asideIc}/>Statistika</NavLink></li>
        <li><NavLink to="/profile"className={({ isActive }) => isActive ? styles.active : ""}><x  className={styles.asideIc}/>Profil</NavLink></li>
      </ul>*/