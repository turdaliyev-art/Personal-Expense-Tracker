import React, { useState, useEffect, useMemo } from 'react';
import styles from './Dashboard.module.css';
import { FiArrowDownRight, FiCalendar, FiArrowUpRight } from "react-icons/fi";
import { TbWallet } from "react-icons/tb";
import { FaArrowTrendDown, FaArrowTrendUp, FaRegEye } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { subscribeToTransactions, subscribeToCategories } from '../../services/financeService';

const Dashboard = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const unsubTx = subscribeToTransactions(setTransactions);
    const unsubCat = subscribeToCategories(setCategories);
    return () => { unsubTx(); unsubCat(); };
  }, []);

  const stats = useMemo(() => {
    let income = 0, expense = 0;
    transactions.forEach(tx => {
      const amt = Number(tx.amount || 0);
      if (tx.type === 'income') income += amt;
      else if (tx.type === 'expense') expense += Math.abs(amt);
    });
    return { income, expense, balance: income - expense };
  }, [transactions]);
  
  const { dynamicCategories, totalCategoryExpense } = useMemo(() => {
    const list = categories.map(cat => {
      const name = cat.name?.toLowerCase().trim();
      const amt = transactions
        .filter(tx => tx.category?.toLowerCase().trim() === name && tx.type === 'expense')
        .reduce((sum, tx) => sum + Math.abs(Number(tx.amount || 0)), 0);
      return { ...cat, calculatedAmount: amt };
    });
    const total = list.reduce((sum, cat) => sum + cat.calculatedAmount, 0);
    return { dynamicCategories: list, totalCategoryExpense: total };
  }, [categories, transactions]);

  const recentTransactions = useMemo(() => transactions.slice(0, 5), [transactions]);
  const formatAmount = (num) => `${num > 0 ? '+' : '-'}${Math.abs(num).toLocaleString('uz-UZ')} so'm`;

  return (
    <div className={styles.dashboard}>
      <div className={styles.dshHdr}>
        <div>
          <p className={styles.dshTitle}>Dashboard</p>
          <p className={styles.dshDesc}>Xarajatlaringizni boshqaring</p>
        </div>
        <span><FiCalendar/> {new Date().toLocaleString('uz', { month: 'long' })} {new Date().getFullYear()}</span>
      </div>

      <div className={styles.financeCards}>
        <div className={styles.card}>
          <span>Balans <TbWallet/></span>
          <p className={styles.money}>{stats.balance.toLocaleString('uz-UZ')} so'm</p>
          <p className={styles.text}>Umumiy balans</p>
        </div>
        <div className={styles.card}>
          <span>Daromad <FaArrowTrendUp className={styles.income}/></span>
          <p className={`${styles.money} ${styles.income}`}>{stats.income.toLocaleString('uz-UZ')} so'm</p>
          <p className={styles.text}>Ushbu oy</p>
        </div>
        <div className={styles.card}>
          <span>Xarajat <FaArrowTrendDown className={styles.cost}/></span>
          <p className={`${styles.money} ${styles.cost}`}>{stats.expense.toLocaleString('uz-UZ')} so'm</p>
          <p className={styles.text}>Ushbu oy</p>
        </div>
      </div>

      <div className={styles.detailsContainer}>
        <div className={styles.transactionsCard}>
          <div className={styles.cardHeader}>
            <p>So'nggi tranzaksiyalar</p>
            <button className={styles.seeAllBtn} onClick={() => navigate("transaction")}><FaRegEye/> Barchasini ko'rish</button>
          </div>
          <div className={styles.transactionList}>
            {recentTransactions.length === 0 ? <p className={styles.noData}>Tranzaksiyalar mavjud emas</p> : 
              recentTransactions.map(item => (
                <div key={item.id} className={styles.transactionItem}>
                  <div className={styles.itemLeft}>
                    <div className={`${styles.iconCircle} ${styles[item.type]}`}>{item.type === 'income' ? <FiArrowDownRight/> : <FiArrowUpRight/>}</div>
                    <div><p className={styles.title}>{item.title}</p><p className={styles.categoryNameText}>{item.category}</p></div>
                  </div>
                  <div className={styles.itemRight}><span className={`${styles.amount} ${styles[item.type]}`}>{formatAmount(item.amount)}</span><span className={styles.date}>{item.date}</span></div>
                </div>
              ))
            }
          </div>
        </div>

        <div className={styles.categoriesCard}>
          <div className={styles.cardHeader}><p>Kategoriyalar bo'yicha (Xarajatlar)</p></div>
          <div className={styles.categoryList}>
            {dynamicCategories.length === 0 ? <p className={styles.noData}>Kategoriyalar mavjud emas</p> : 
              dynamicCategories.map(cat => {
                const percent = totalCategoryExpense > 0 ? Math.round((cat.calculatedAmount / totalCategoryExpense) * 100) : 0;
                return (
                  <div key={cat.id} className={styles.categoryItem}>
                    <div className={styles.categoryInfo}><span className={styles.catName}>{cat.name} ({percent}%)</span><span className={styles.catAmount}>{cat.calculatedAmount.toLocaleString('uz-UZ')} so'm</span></div>
                    <div className={styles.progressBarBg}><div className={styles.progressBarFill} style={{ width: `${percent}%`, backgroundColor: cat.color || 'var(--blue)' }}/></div>
                  </div>
                );
              })
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;