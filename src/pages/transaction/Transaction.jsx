import React, { useState, useEffect, useMemo, useCallback } from "react";
import styles from "./Transaction.module.css";
import { FiArrowDownRight, FiArrowUpRight, FiCalendar, FiSearch } from 'react-icons/fi'; 
import { RiDeleteBin6Line } from "react-icons/ri";
import { GrEdit as GrEditIcon } from "react-icons/gr"; 
import TransactionModal from "../../components/modals/TransactionModal";
import DelConfirmModal from "../../components/modals/DelConfirm"; 
import { subscribeToTransactions, deleteTransactionDoc } from "../../services/financeService";

const Transaction = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDelModalOpen, setIsDelModalOpen] = useState(false); 
  const [activeFilter, setActiveFilter] = useState("all"); 
  const [searchQuery, setSearchQuery] = useState("");
  const [editingTransaction, setEditingTransaction] = useState(null); 
  const [selectedId, setSelectedId] = useState(null); 
  const [transactions, setTransactions] = useState(null); 

  useEffect(() => {
    return subscribeToTransactions(setTransactions);
  }, []);

  const openDelete = useCallback((id) => { setSelectedId(id); setIsDelModalOpen(true); }, []);
  const openEdit = useCallback((item) => { setEditingTransaction(item); setIsModalOpen(true); }, []);

  const handleConfirmDelete = async () => {
    if (selectedId) {
      await deleteTransactionDoc(selectedId);
      setIsDelModalOpen(false);
      setSelectedId(null);
    }
  };

  const filteredTransactions = useMemo(() => {
    if (!transactions) return [];
    return transactions.filter(item => {
      const matchType = activeFilter === "all" || item.type === activeFilter;
      const matchSearch = item.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.category?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchType && matchSearch;
    });
  }, [transactions, activeFilter, searchQuery]);

  return (
    <div className={styles.transaction}>
      <div className={styles.trHdr}>
        <div><p className={styles.trTitle}>Tranzaksiyalar</p><p className={styles.trDesc}>Barcha o'tkazmalar</p></div>
        <button onClick={() => { setEditingTransaction(null); setIsModalOpen(true); }}><span>+</span>Yangi tranzaksiya</button>
      </div>

      <TransactionModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingTransaction(null); }} editingTransaction={editingTransaction} />
      <DelConfirmModal isOpen={isDelModalOpen} onClose={() => { setIsDelModalOpen(false); setSelectedId(null); }} onConfirm={handleConfirmDelete} title="Tranzaksiyani O'chirish" description="Tranzaksiyani o'chirasizmi?" />

      <div className={styles.trListContainer}>
        <div className={styles.catHdr}>
          <div className={styles.search}><FiSearch className={styles.searchIc}/><input type="text" placeholder='Qidirish...' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/></div>
          <div className={styles.filterButtons}>
            {['all', 'income', 'expense'].map(f => (
              <button key={f} className={activeFilter === f ? styles.active : ''} onClick={() => setActiveFilter(f)}>
                {f === 'all' ? 'Barchasi' : f === 'income' ? 'Daromad' : 'Xarajat'}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.transactionList}>
          {transactions === null && <p className={styles.noData}>Yuklanmoqda...</p>}
          {transactions && filteredTransactions.length === 0 && <h2 className={styles.noData}>Tranzaksiya topilmadi!</h2>}

          {filteredTransactions.map(item => (
            <div key={item.id} className={styles.transactionItem}>
              <div className={styles.itemLeft}>
                <div className={`${styles.iconCircle} ${styles[item.type]}`}>{item.type === 'income' ? <FiArrowDownRight/> : <FiArrowUpRight/>}</div>
                <div><p className={styles.title}>{item.title}</p><p>{item.category} <span>• <FiCalendar/> {item.date}</span></p></div>
              </div>
              <div className={styles.itemRight}>
                <span className={`${styles.amount} ${styles[item.type]}`}>{item.amount > 0 ? '+' : '-'}${Math.abs(item.amount).toLocaleString()} so'm</span>
                <div className={styles.catActions}>
                  <button onClick={() => openEdit(item)}><GrEditIcon/></button>
                  <button onClick={() => openDelete(item.id)}><RiDeleteBin6Line/></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Transaction;