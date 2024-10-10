"use client";
import { useEffect, useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Swal from "sweetalert2";
// Components
import Preview from "./Preview";
import Customize from "./Customize";
import Link from 'next/link';
import "./styles.css";
const Home = () => {
  const [content, setContent] = useState([]); // State to hold content
  const [mode, setMode] = useState(""); // State to manage current mode
  const [isModesVisible, setModesVisible] = useState(true); // State for mode visibility
  const [arrowDirection, setArrowDirection] = useState("down"); // State for arrow direction
  const [selectedProducts, setSelectedProducts] = useState([]); // State to manage selected products
  const [loading, setLoading] = useState(false); // Track loading state when saving changes
  const [videoFile, setVideoFile] = useState(null); // State for storing the selected video file
  const [posterImage, setPosterImage] = useState(null); // State for storing the selected poster image file
  const [subscriptionType, setSubscriptionType] = useState("gold"); // State for the subscription type

  // Define subscription limits based on subscription typ
  const subscriptionLimits = {
    startup: {
      maxImages: 3,
      maxProducts: 0,
      maxCarousels: 0,
      maxVideos: 0,
    },
    silver: {
      maxImages: 15,
      maxProducts: 5,
      maxCarousels: 1,
      maxVideos: 0,
    },
    gold: {
      maxImages: 30,
      maxProducts: 10,
      maxCarousels: 5,
      maxVideos: 5,
    },
    platinum: {
      maxImages: Infinity, // No limit
      maxProducts: Infinity,
      maxCarousels: Infinity,
      maxVideos: Infinity,
    },
  };
  const limits = subscriptionLimits[subscriptionType]; // Get limits for current subscription
  // Define an array of products
  const products = [
    {
      id: 1,
      name: "Product 1",
      image:
        "https://firebasestorage.googleapis.com/v0/b/tache2-store.appspot.com/o/products%2Fproduct-1.png?alt=media&token=c2e0d070-bbce-44c5-a43d-cd9200965379",
      price: "40",
    },
    {
      id: 2,
      name: "Product 2",
      image:
        "https://firebasestorage.googleapis.com/v0/b/tache2-store.appspot.com/o/products%2Fproduct-2.png?alt=media&token=dddbb759-765e-458e-9155-4dc78f2f8389",
      price: "34",
    },
    {
      id: 3,
      name: "Product 3",
      image:
        "https://firebasestorage.googleapis.com/v0/b/tache2-store.appspot.com/o/products%2Fproduct-3.png?alt=media&token=77c26805-2c1e-4ed7-b304-182363cdeb54",
      price: "50",
    },
    {
      id: 4,
      name: "Product 4",
      image:
        "https://firebasestorage.googleapis.com/v0/b/tache2-store.appspot.com/o/products%2Fproduct-4.png?alt=media&token=e52bbedf-8b14-4031-b828-33ad9b4d6619",
      price: "48",
    },
    {
      id: 5,
      name: "Product 5",
      image:
        "https://firebasestorage.googleapis.com/v0/b/tache2-store.appspot.com/o/products%2Fproduct-5.png?alt=media&token=6b9c3724-223b-464a-b857-fc2a7ef6f9a8",
      price: "23",
    },
    {
      id: 6,
      name: "Product 6",
      image:
        "https://firebasestorage.googleapis.com/v0/b/tache2-store.appspot.com/o/products%2Fproduct-6.png?alt=media&token=e2dba5f8-9f01-42a8-ac61-8cf0a7289bc9",
      price: "2300",
    },
    {
      id: 7,
      name: "Product 7",
      image:
        "https://firebasestorage.googleapis.com/v0/b/tache2-store.appspot.com/o/products%2Fproduct-7.png?alt=media&token=7586063d-f0c8-48d0-9d29-3ed7c7a57210",
      price: "250",
    },
    {
      id: 8,
      name: "Product 8",
      image:
        "https://firebasestorage.googleapis.com/v0/b/tache2-store.appspot.com/o/products%2Fproduct-8.png?alt=media&token=441913e7-a7f1-461a-872a-31e04235f64b",
      price: "22",
    },
    {
      id: 9,
      name: "Product 9",
      image:
        "https://firebasestorage.googleapis.com/v0/b/tache2-store.appspot.com/o/products%2Fproduct-9.png?alt=media&token=c66e1543-3304-42c8-b698-7d7aa745e313",
      price: "2400",
    },
  ];
  // Effect to show alert if the current mode exceeds subscription limits
  useEffect(() => {
    if (mode === "products" && limits.maxProducts <= 0) {
      Swal.fire({
        title: "Feature Not Supported!",
        text: "Your current subscription plan does not include the option to add products. Please upgrade your plan to enable this feature.",
        icon: "warning",
        confirmButtonText: "Okay",
      });
    }
    if (mode === "imageUpload" && limits.maxImages <= 0) {
      Swal.fire({
        title: "Feature Not Supported!",
        text: "Your current subscription plan does not include the option to add images. Please upgrade your plan to enable this feature.",
        icon: "warning",
        confirmButtonText: "Okay",
      });
    }
    if (mode === "carousel" && limits.maxCarousels <= 0) {
      Swal.fire({
        title: "Feature Not Supported!",
        text: "Your current subscription plan does not include the option to add Carousel. Please upgrade your plan to enable this feature.",
        icon: "warning",
        confirmButtonText: "Okay",
      });
    }
    if (mode === "video" && limits.maxVideos <= 0) {
      Swal.fire({
        title: "Feature Not Supported!",
        text: "Your current subscription plan does not include the option to add Video. Please upgrade your plan to enable this feature.",
        icon: "warning",
        confirmButtonText: "Okay",
      });
    }
  }, [mode]);

  const [currentInsertIndex, setCurrentInsertIndex] = useState(null); // State to determine the index to insert content

  return (
    <div className="store-container">
      {/* Subscription Type Dropdown */}
      <div className="subscription-type-selector">
        <label htmlFor="subscriptionType">Select Subscription Type:</label>
        <select
          id="subscriptionType"
          value={subscriptionType}
          onChange={(e) => setSubscriptionType(e.target.value)}
        >
          <option value="startup">Startup</option>
          <option value="silver">Silver</option>
          <option value="gold">Gold</option>
          <option value="platinum">Platinum</option>
        </select>
      </div>
      <h1 className="store-title">Customize Your Store</h1>
      {/* Preview component to allow the user preview his store */}
      <Preview
        content={content}
        setContent={setContent}
        setModesVisible={setModesVisible}
        setArrowDirection={setArrowDirection}
        setCurrentInsertIndex={setCurrentInsertIndex}
        selectedProducts={selectedProducts}
        setSelectedProducts={setSelectedProducts}
        limits={limits}
        loading={loading}
        setLoading={setLoading}
        videoFile={videoFile}
        setVideoFile={setVideoFile}
        posterImage={posterImage}
        setPosterImage={setPosterImage}
        products={products}
      />
      {/* Button to navigate to the /stores page */}
      <Link href="/stores">
        <button className="view-stores-button">View All Stores</button>
      </Link>
      {/* Customize component to allow the user to customizee his store */}
      <Customize
        content={content}
        setContent={setContent}
        setModesVisible={setModesVisible}
        isModesVisible={isModesVisible}
        currentInsertIndex={currentInsertIndex}
        setCurrentInsertIndex={setCurrentInsertIndex}
        arrowDirection={arrowDirection}
        setArrowDirection={setArrowDirection}
        mode={mode}
        setMode={setMode}
        loading={loading}
        setLoading={setLoading}
        limits={limits}
        videoFile={videoFile}
        setVideoFile={setVideoFile}
        posterImage={posterImage}
        setPosterImage={setPosterImage}
        products={products}
        selectedProducts={selectedProducts}
        setSelectedProducts={setSelectedProducts}
      />
    </div>
  );
};

export default Home;
