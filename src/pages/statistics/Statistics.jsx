import React, { useState, useEffect, useMemo } from 'react';
import { FiCalendar, FiTrendingUp, FiTrendingDown, FiDollarSign, FiActivity } from 'react-icons/fi';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';
import styles from './Statistics.module.css';
import { subscribeToTransactions, subscribeToCategories } from '../../services/financeService';

function Statistics() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);

  // Firebase real-time listenerlarni ulash
  useEffect(() => {
    const unsubscribeTx = subscribeToTransactions(setTransactions);
    const unsubscribeCat = subscribeToCategories(setCategories);

    return () => {
      unsubscribeTx();
      unsubscribeCat();
    };
  }, []);

  const joriyYil = new Date().getFullYear();

  // 1. Oylik Daromad va Xarajat tendensiyasini hisoblashni keshlashtirish
  const lineData = useMemo(() => {
    const oylarQisqa = ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyun', 'Iyul', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek'];
    return oylarQisqa.map((oyNom, index) => {
      const oyTx = transactions.filter(tx => {
        const txSana = new Date(tx.date);
        return txSana.getFullYear() === joriyYil && txSana.getMonth() === index;
      });

      const daromad = oyTx.filter(tx => tx.type === 'income').reduce((sum, tx) => sum + Number(tx.amount || 0), 0);
      const xarajat = oyTx.filter(tx => tx.type === 'expense').reduce((sum, tx) => sum + Math.abs(Number(tx.amount || 0)), 0);

      return { name: oyNom, daromad, xarajat };
    });
  }, [transactions, joriyYil]);

  // 2. Faqat xarajat tranzaksiyalarini keshlashtirish (filtr amallarini kamaytirish uchun)
  const xarajatTx = useMemo(() => transactions.filter(tx => tx.type === 'expense'), [transactions]);

  // 3. Umumiy xarajat miqdorini keshlashtirish
  const umumiyXarajatMiyqdori = useMemo(() => {
    return xarajatTx.reduce((sum, tx) => sum + Math.abs(Number(tx.amount || 0)), 0);
  }, [xarajatTx]);

  // 4. Kategoriyalar bo'yicha taqsimotni (PieChart) hisoblashni keshlashtirish
  const pieData = useMemo(() => {
    return categories.map(cat => {
      const catNameLower = cat.name?.toLowerCase().trim();
      const catSumma = xarajatTx
        .filter(tx => tx.category?.toLowerCase().trim() === catNameLower)
        .reduce((sum, tx) => sum + Math.abs(Number(tx.amount || 0)), 0);

      const foiz = umumiyXarajatMiyqdori > 0 ? Math.round((catSumma / umumiyXarajatMiyqdori) * 100) : 0;

      return {
        name: `${cat.name} ${foiz}%`,
        value: catSumma,
        color: cat.color || '#3b82f6',
        rawPercentage: foiz
      };
    }).filter(item => item.value > 0);
  }, [categories, xarajatTx, umumiyXarajatMiyqdori]);

  // 5. Haftalik xarajatlarni (BarChart) hisoblashni keshlashtirish
  const barData = useMemo(() => {
    const haftalar = ['Yak', 'Dush', 'Sesh', 'Chor', 'Pay', 'Juma', 'Shan'];
    const haftalarUz = ['Dush', 'Sesh', 'Chor', 'Pay', 'Juma', 'Shan', 'Yak'];
    
    return haftalarUz.map(kun => {
      const kunTx = xarajatTx.filter(tx => {
        const txSana = new Date(tx.date);
        return haftalar[txSana.getDay()] === kun;
      });

      const jamiKunlik = kunTx.reduce((sum, tx) => sum + Math.abs(Number(tx.amount || 0)), 0);
      return { name: kun, xarajat: jamiKunlik };
    });
  }, [xarajatTx]);

  // 6. Pastki kartalar (Summary Stats) uchun umumiy hisob-kitoblarni keshlashtirish
  const summaryStats = useMemo(() => {
    const jamiDaromad = transactions.filter(tx => tx.type === 'income').reduce((sum, tx) => sum + Number(tx.amount || 0), 0);
    const jamiXarajat = xarajatTx.reduce((sum, tx) => sum + Math.abs(Number(tx.amount || 0)), 0);

    const ortachaKunlik = transactions.length > 0 ? Math.round(jamiXarajat / 30) : 0;

    let engKopXarajatCatName = "Mavjud emas";
    let engKopXarajatCatSumma = 0;

    categories.forEach(cat => {
      const catNameLower = cat.name?.toLowerCase().trim();
      const catSumma = xarajatTx
        .filter(tx => tx.category?.toLowerCase().trim() === catNameLower)
        .reduce((sum, tx) => sum + Math.abs(Number(tx.amount || 0)), 0);

      if (catSumma > engKopXarajatCatSumma) {
        engKopXarajatCatSumma = catSumma;
        engKopXarajatCatName = cat.name;
      }
    });

    const tejashNisbati = jamiDaromad > 0 ? Math.round(((jamiDaromad - jamiXarajat) / jamiDaromad) * 100) : 0;

    return {
      ortachaKunlik,
      engKopXarajatCatName,
      engKopXarajatCatSumma,
      tejashNisbati,
      jamiTranzaksiyalarSoni: transactions.length
    };
  }, [transactions, categories, xarajatTx]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.pageTitle}>Statistika</h2>
          <p className={styles.pageSubtitle}>Xarajatlaringiz bo'yicha tahlil</p>
        </div>
        <div className={styles.dateSelector}>
          <FiCalendar />
          <span>{joriyYil} yil</span>
        </div>
      </div>

      <div className={styles.mainChartCard}>
        <h3 className={styles.cardTitle}>Daromad va xarajatlar tendensiyasi</h3>
        <div className={styles.chartWrapper}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="name" stroke="#9ca3af" fontSize="1.2rem" tickLine={false} />
              <YAxis stroke="#9ca3af" fontSize="1.2rem" tickLine={false} axisLine={false} />
              <Tooltip formatter={(value) => [`${value.toLocaleString()} so'm`]} />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
              <Line type="monotone" dataKey="daromad" name="Daromad" stroke="#16a34a" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="xarajat" name="Xarajat" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={styles.splitGrid}>
        <div className={styles.gridCard}>
          <h3 className={styles.cardTitle}>Kategoriyalar bo'yicha taqsimot</h3>
          <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius="75%" label={{ fontSize: '1.1rem', fontWeight: 500 }}>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value.toLocaleString()} so'm`, 'Xarajat']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={styles.gridCard}>
          <h3 className={styles.cardTitle}>Haftalik xarajatlar</h3>
          <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize="1.2rem" tickLine={false} />
                <YAxis stroke="#9ca3af" fontSize="1.2rem" tickLine={false} axisLine={false} />
                <Tooltip formatter={(value) => [`${value.toLocaleString()} so'm`, 'Xarajat']} />
                <Bar dataKey="xarajat" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className={styles.bottomSummaryGrid}>
        <div className={styles.summaryCard}>
          <div className={styles.summaryTop}>
            <div>
              <p className={styles.summaryLabel}>O'rtacha kunlik xarajat</p>
              <h4 className={styles.summaryValue}>{summaryStats.ortachaKunlik.toLocaleString('uz-UZ')} so'm</h4>
            </div>
            <FiTrendingDown className={`${styles.summaryIcon} ${styles.expenseIcon}`} />
          </div>
          <p className={styles.summaryFooter}>Oxirgi 30 kun</p>
        </div>

        <div className={styles.summaryCard}>
          <div className={styles.summaryTop}>
            <div>
              <p className={styles.summaryLabel}>Eng ko'p xarajat</p>
              <h4 className={styles.summaryValue}>{summaryStats.engKopXarajatCatName}</h4>
            </div>
            <FiDollarSign className={styles.summaryIcon} />
          </div>
          <p className={styles.summaryFooter}>{summaryStats.engKopXarajatCatSumma.toLocaleString('uz-UZ')} so'm</p>
        </div>

        <div className={styles.summaryCard}>
          <div className={styles.summaryTop}>
            <div>
              <p className={styles.summaryLabel}>Tejash nisbati</p>
              <h4 className={styles.summaryValue}>{summaryStats.tejashNisbati}%</h4>
            </div>
            <FiTrendingUp className={`${styles.summaryIcon} ${styles.incomeIcon}`} />
          </div>
          <p className={styles.summaryFooter}>Daromaddan</p>
        </div>

        <div className={styles.summaryCard}>
          <div className={styles.summaryTop}>
            <div>
              <p className={styles.summaryLabel}>Jami tranzaksiyalar</p>
              <h4 className={styles.summaryValue}>{summaryStats.jamiTranzaksiyalarSoni}</h4>
            </div>
            <FiActivity className={styles.summaryIcon} />
          </div>
          <p className={styles.summaryFooter}>Ushbu oy</p>
        </div>
      </div>
    </div>
  );
}

export default Statistics;