"use client";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { app } from "@/app/components/Firebase";
import { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import "./stores.css";
import Link from "next/link";

export default function Product() {
  const [stores, setStores] = useState(null);
  const db = getFirestore(app);
  
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const colRef = collection(db, "stores");
        const snapshot = await getDocs(colRef);
        const storesList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setStores(storesList);
      } catch (error) {
        console.error("There was an error fetching the stores!", error);
      }
    };
    fetchStores();
  }, []);

  if (!stores)
    return (
      <div className="loading-container">
        <ClipLoader color="#4A90E2" size={50} />
        <p className="loading-text">Loading stores, please wait...</p>
      </div>
    );

  return (
    <div className="productsPage">
      <h1 className="stores-list">Stores List</h1>
      {stores.map((store) => (
        <li style={{ fontSize: "20px", marginTop: "20px" }} key={store.id}>
          <Link href={`/stores/${store.id}`}>
            <strong>View Store</strong>
          </Link>
        </li>
      ))}
    </div>
  );
}
