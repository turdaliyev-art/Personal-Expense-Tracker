import styles from './Dashboard.module.css'
import { FiArrowDownRight, FiCalendar} from "react-icons/fi";
import { TbWallet } from "react-icons/tb";
import { FaArrowTrendDown } from "react-icons/fa6";
import { FaArrowTrendUp } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa";
import { FiArrowUpRight } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {

  const navigate = useNavigate() 
  const oylar = ["Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun", "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"];
  const month = oylar[new Date().getMonth()];
  const year = new Date().getFullYear();


  
  const transactions = [
    { id: 1, title: 'Supermarket', category: "Ovqat", amount: -45000, date: '2026-05-15', type: 'expense' },
    { id: 2, title: 'Ish haqi', category: "Daromad", amount: 5000000, date: '2026-05-14', type: 'income' },
    { id: 3, title: 'Transport', category: "Transport", amount: -25000, date: '2026-05-14', type: 'expense' },
    { id: 4, title: 'Kafe', category: "Ovqat", amount: -60000, date: '2026-05-13', type: 'expense' },
    { id: 5, title: 'Kommunal', category: "To'lovlar", amount: -350000, date: '2026-05-12', type: 'expense' },
  ];


  const categories = [
    { id: 1, name: "Ovqat", amount: "850,000 so'm", percentage: '40%', color: 'var(--blue)' }, 
    { id: 2, name: "Transport", amount: "420,000 so'm", percentage: '18%', color: "var(--green-2)" }, 
    { id: 3, name: "To'lovlar", amount: "650,000 so'm", percentage: '30%', color: '#ea580c' }, 
    { id: 4, name: "O'yin-kulgi", amount: "320,000 so'm", percentage: '14%', color: '#9333ea' }, 
  ];
  
  const formatAmount = (num) => {
    const formatted = Math.abs(num).toLocaleString('uz-UZ') + " so'm";
    return num > 0 ? `+${formatted}` : `-${formatted}`;
  };
  return (
    <div className={styles.dashboard}>
      <div className={styles.dshHdr}>
        <div>
          <p className={styles.dshTitle}>Dashboard</p>
          <p className={styles.dshDesc}>Xarajatlaringizni boshqaring</p>
        </div>

        <span><FiCalendar/>{month} {year}</span>
      </div>

      <div className={styles.financeCards}>
        <div className={styles.card}>
          <span>Balans <TbWallet/></span>
          <p className={styles.money}>2,760,000 so'm</p>
          <p className={styles.text}>Umumiy balans</p>
        </div>
        <div className={styles.card}>
          <span>Daromad <FaArrowTrendUp className={styles.income}/></span>
          <p className={`${styles.money} ${styles.income}`}>5,000,000 so'm</p>
          <p className={styles.text}>Ushbu oy</p>
        </div>
        <div className={styles.card}>
          <span>Xarajat <FaArrowTrendDown className={styles.cost}/></span>
          <p className={`${styles.money} ${styles.cost}`}>2,240,000 so'm</p>
          <p className={styles.text}>Ushbu oy</p>
        </div>
      </div>

      <div className={styles.detailsContainer}>
      

      <div className={styles.transactionsCard}>
        <div className={styles.cardHeader}>
          <p>So'nggi tranzaksiyalar</p>
          <button className={styles.seeAllBtn} onClick={() => navigate("transaction")}>
            <FaRegEye/> Barchasini ko'rish
          </button>
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
                  <p>{item.category}</p>
                </div>
              </div>
              <div className={styles.itemRight}>
                <span className={`${styles.amount} ${styles[item.type]}`}>
                  {formatAmount(item.amount)}
                </span>
                <span className={styles.date}>{item.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    
      <div className={styles.categoriesCard}>
        <div className={styles.cardHeader}>
          <p>Kategoriyalar bo'yicha</p>
        </div>

        <div className={styles.categoryList}>

          {categories.map((cat) => (
            <div key={cat.id} className={styles.categoryItem}>
              <div className={styles.categoryInfo}>
                <span className={styles.catName}>{cat.name}</span>
                <span className={styles.catAmount}>{cat.amount}</span>
              </div>
              
              <div className={styles.progressBarBg}>
                <div 
                  className={styles.progressBarFill} 
                  style={{ width: cat.percentage, backgroundColor: cat.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
    </div>
  )
}

export default Dashboard
