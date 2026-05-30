import { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export const useCollection = (collectionName) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, collectionName),
      (querySnapshot) => {
        const dataFromCollection = [];
        
        querySnapshot.forEach((doc) => { 
          dataFromCollection.push({ id: doc.id, ...doc.data() });
        });
        
        setData(dataFromCollection);
      },
      (error) => {
        console.error("Firebase-dan ma'lumot olishda xatolik:", error);
      }
    );

    return () => unsubscribe();
  }, [collectionName]);

  return { data };
};