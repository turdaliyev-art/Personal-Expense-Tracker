import React from 'react';
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
import { FaCodeCommit } from "react-icons/fa6";
import styles from './Statistics.module.css';

function Statistics() {
  const lineData = [
    { name: 'Yan', daromad: 4500000, xarajat: 4500000 },
    { name: 'Fev', daromad: 4800000, xarajat: 4800000 },
    { name: 'Mar', daromad: 5200000, xarajat: 5200000 },
    { name: 'Apr', daromad: 4900000, xarajat: 4900000 },
    { name: 'May', daromad: 5000000, xarajat: 5000000 }
  ];

  const pieData = [
    { name: 'Ovqat 38%', value: 38, color: '#2563eb' },
    { name: 'Transport 19%', value: 19, color: '#16a34a' },
    { name: 'To\'lovlar 29%', value: 29, color: '#ea580c' },
    { name: 'O\'yin-kulgi 14%', value: 14, color: '#9333ea' }
  ];

  const barData = [
    { name: 'Dush', xarajat: 85000 },
    { name: 'Sesh', xarajat: 120000 },
    { name: 'Chor', xarajat: 95000 },
    { name: 'Pay', xarajat: 110000 },
    { name: 'Juma', xarajat: 150000 },
    { name: 'Shan', xarajat: 185000 },
    { name: 'Yak', xarajat: 140000 }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.pageTitle}>Statistika</h2>
          <p className={styles.pageSubtitle}>Xarajatlaringiz bo'yicha tahlil</p>
        </div>
        <div className={styles.dateSelector}>
          <FiCalendar />
          <span>2026 yil</span>
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
              {/* <Tooltip /> */}
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
              <Line type="monotone" dataKey="daromad" name="Daromad" stroke="#16a34a" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="xarajat" name="Xarajat" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>

            {/* {console.log(stroke)} */}
          </ResponsiveContainer>
        </div>
      </div>

      <div className={styles.splitGrid}>
        <div className={styles.gridCard}>
          <h3 className={styles.cardTitle}>Kategoriyalar bo'yicha taqsimot</h3>
          <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius="80%" label={{ fontSize: '1.2rem', fontWeight: 500 }}>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
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
              <h4 className={styles.summaryValue}>74,000 so'm</h4>
            </div>
            <FiTrendingDown className={`${styles.summaryIcon} ${styles.expenseIcon}`} />
          </div>
          <p className={styles.summaryFooter}>Oxirgi 30 kun</p>
        </div>

        <div className={styles.summaryCard}>
          <div className={styles.summaryTop}>
            <div>
              <p className={styles.summaryLabel}>Eng ko'p xarajat</p>
              <h4 className={styles.summaryValue}>Ovqat</h4>
            </div>
            <FiDollarSign className={styles.summaryIcon} />
          </div>
          <p className={styles.summaryFooter}>850,000 so'm</p>
        </div>

        <div className={styles.summaryCard}>
          <div className={styles.summaryTop}>
            <div>
              <p className={styles.summaryLabel}>Tejash nisbati</p>
              <h4 className={styles.summaryValue}>55%</h4>
            </div>
            <FiTrendingUp className={`${styles.summaryIcon} ${styles.incomeIcon}`} />
          </div>
          <p className={styles.summaryFooter}>Daromaddan</p>
        </div>

        <div className={styles.summaryCard}>
          <div className={styles.summaryTop}>
            <div>
              <p className={styles.summaryLabel}>Jami tranzaksiyalar</p>
              <h4 className={styles.summaryValue}>127</h4>
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