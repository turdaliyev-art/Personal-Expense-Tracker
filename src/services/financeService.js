import { db, auth } from "../firebase/firebaseConfig";
import { collection, onSnapshot, query, orderBy, doc, deleteDoc } from "firebase/firestore";


const getUid = () => auth.currentUser?.uid;

export const subscribeToTransactions = (callback) => {
  const uid = getUid();
  if (!uid) return callback([]), () => {};

  const q = query(collection(db, "users", uid, "transactions"), orderBy("date", "desc"));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  }, () => callback([]));
};

export const subscribeToCategories = (callback) => {
  const uid = getUid();
  if (!uid) return callback([]), () => {};

  const q = query(collection(db, "users", uid, "categories"), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  }, () => callback([]));
};

export const deleteTransactionDoc = async (id) => {
  const uid = getUid();
  if (uid && id) await deleteDoc(doc(db, "users", uid, "transactions", id));
};

export const deleteCategoryDoc = async (id) => {
  const uid = getUid();
  if (uid && id) await deleteDoc(doc(db, "users", uid, "categories", id));
};