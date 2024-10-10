// StorePage.jsx or StorePage.tsx
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { app } from "@/app/components/Firebase";
import StoreContent from "./StoreContent"; // Import your client component

export async function generateStaticParams() {
  const db = getFirestore(app);
  const storeIds = [];

  try {
    const querySnapshot = await getDocs(collection(db, "stores"));
    querySnapshot.forEach((doc) => {
      storeIds.push(doc.id); // Push each store ID into the array
    });
  } catch (error) {
    console.error("Error fetching store IDs: ", error);
  }

  return storeIds.map((id) => ({ storeId: id }));
}

const StorePage = async ({ params }) => {
  return <StoreContent params={params} />;
};

export default StorePage;
