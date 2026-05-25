import styles from "./Transaction.module.css"
import { FiArrowDownRight, FiArrowUpRight, FiCalendar, FiSearch } from 'react-icons/fi'; 
import { RiDeleteBin6Line } from "react-icons/ri";
import { FiEdit2 } from "react-icons/fi";
import { GrEdit } from "react-icons/gr";
import TransactionModal from "../../components/modals/TransactionModal";
import { useState } from "react";


const Transaction = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
  

  const transactions = [
    { id: 1, title: 'Supermarket', category: "Ovqat", amount: -45000, date: '2026-05-15', type: 'expense' },
    { id: 2, title: 'Ish haqi', category: "Daromad", amount: 5000000, date: '2026-05-14', type: 'income' },
    { id: 3, title: 'Transport', category: "Transport", amount: -25000, date: '2026-05-14', type: 'expense' },
    { id: 4, title: 'Kafe', category: "Ovqat", amount: -60000, date: '2026-05-13', type: 'expense' },
    { id: 5, title: 'Kommunal', category: "To'lovlar", amount: -350000, date: '2026-05-12', type: 'expense' },
    { id: 6, title: 'Supermarket', category: "Ovqat", amount: -45000, date: '2026-05-15', type: 'expense' },
    { id: 7, title: 'Ish haqi', category: "Daromad", amount: 5000000, date: '2026-05-14', type: 'income' },
    { id: 8, title: 'Transport', category: "Transport", amount: -25000, date: '2026-05-14', type: 'expense' },
    { id: 9, title: 'Kafe', category: "Ovqat", amount: -60000, date: '2026-05-13', type: 'expense' },
    { id: 10, title: 'Kommunal', category: "To'lovlar", amount: -350000, date: '2026-05-12', type: 'expense' },
  ];

    const formatAmount = (num) => {
    const formatted = Math.abs(num).toLocaleString('uz-UZ') + " so'm";
    return num > 0 ? `+${formatted}` : `-${formatted}`;
  };

  return (
    <div className={styles.transaction}>
      <div className={styles.trHdr}>
        <div>
          <p className={styles.trTitle}>Tranzaksiyalar</p>
          <p className={styles.trDesc}>Barcha xarajat va daromadlar</p>
        </div>
        <button onClick={() => setIsModalOpen(true)}><span>+</span>Yangi tranzaksiya</button>
      </div>

      {/* <TransactionModal/> */}
     <TransactionModal isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}/>
      <div className={styles.trListContainer}>
            <div className={styles.catHdr}>
              <div className={styles.search}>
                <FiSearch className={styles.searchIc}/><input type="text" placeholder='Qidirish...'/>
              </div>

            <div className={styles.filterButtons}>
                <button
                  // className={`${styles.filterBtn} ${activeFilter === 'all' ? styles.active : ''}`}
                  // onClick={() => handleFilter('all')}
                >
                  Barchasi
                </button>
                <button
                  // className={`${styles.filterBtn} ${activeFilter === 'income' ? styles.active : ''}`}
                  // onClick={() => handleFilter('income')}
                >
                  Daromad
                </button>
                <button
                  // className={`${styles.filterBtn} ${activeFilter === 'expense' ? styles.active : ''}`}
                  // onClick={() => handleFilter('expense')}
                >
                  Xarajat
                </button>
            </div>
          </div>
        <div className={styles.transactionList}>

          {transactions.map((item) => (
            <div key={item.id} className={styles.transactionItem}>
              <div className={styles.itemLeft}>
              
                <div className={`${styles.iconCircle} ${styles[item.type]}`}>
                  {item.type === 'income' ? <FiArrowDownRight/> : <FiArrowUpRight/>}
                </div>
                <div>
                  <p className={styles.title}>{item.title}</p>
                  <p>{item.category}<span>• <FiCalendar/> {item.date}</span></p>
                </div>
              </div>
              <div className={styles.itemRight}>
                <span className={`${styles.amount} ${styles[item.type]}`}>
                  {formatAmount(item.amount)}
                </span>
                <div className={styles.catActions}>
                  <button><GrEdit/></button>
                  <button><RiDeleteBin6Line/></button>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>

            
            
    </div>
  )
}

export default Transaction
