// StorePage.jsx or StorePage.tsx
"use client";

import React, { useEffect, useState } from "react";
import { getFirestore, collection, getDocs, doc, getDoc } from "firebase/firestore";
import { app } from "@/app/components/Firebase";
import StoreContent from "./StoreContent"; // Import your client component
import Swal from "sweetalert2";

const StorePage = ({ params }) => {
  const [store, setStore] = useState(null);
  const db = getFirestore(app);

  useEffect(() => {
    const fetchStoreContent = async () => {
      const storeId = params.storeId; // Get storeId from params

      try {
        const docRef = doc(db, "stores", storeId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setStore(docSnap.data());
        } else {
          console.error("No such document!");
        }
      } catch (error) {
        console.error("There was an error fetching the store content!", error);
      }
    };

    fetchStoreContent();
  }, [params.storeId]);

  if (!store) {
    return (
      <h2>
        <strong>Loading...</strong>
      </h2>
    );
  }

  return <StoreContent store={store} />;
};

export default StorePage;
