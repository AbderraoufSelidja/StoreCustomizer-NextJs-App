"use client";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { app } from "@/app/components/Firebase";
import { useEffect, useState } from "react";
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
        // console.log(snapshot.docs);
        const storesList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })); 
        // console.log(storesList);
        setStores(storesList);
      } catch (error) {
        console.error("There was an error fetching the stores!", error);
      }
    };
    fetchStores(); // Call the async function
    // console.log(products);
  }, []);
  if (!stores)
    return (
      <h2>
        <strong>Loading...</strong>
      </h2>
    );
  return (
    <div className="productsPage">
      <h1 className="stores-list">Stores List</h1>
      {stores.map((store) => (
        <li  style={{fontSize: "20px", marginTop: "20px"}} key={store.id}>
          <Link href={`/stores/${store.id}`}><strong>View Store</strong></Link>
        </li>
      ))}
    </div>
  );
}
