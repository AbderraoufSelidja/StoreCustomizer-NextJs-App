// preview.js
"use client";
import { useState } from "react";
import { app } from "@/app/components/Firebase";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import {
  getStorage,
  ref,
  deleteObject,
} from "firebase/storage";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Swal from "sweetalert2";
import Text from "./Text";
import Carousel from "./Carousel";
import Image from "./Image";
import Video from "./Video";
import Form from "./Form";
import Products from "./Products";
const Preview = ({
  content,
  setContent,
  setModesVisible,
  setArrowDirection,
  setCurrentInsertIndex,
  selectedProducts,
  setSelectedProducts,
  limits,
  loading,
  setLoading,
  videoFile,
  setVideoFile,
  posterImage,
  setPosterImage,
  products
}) => {
  const db = getFirestore(app);
  const storage = getStorage(app);
  const [editting, setEditting] = useState(null); // Track editting mode for content
  // Function to handle content deletion (e.g., image, video, carousel)
  const handleDeleteContent = async (index) => {
    const itemToDelete = content[index];
    // console.log(itemToDelete);
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      // If the user confirms the action
      if (result.isConfirmed) {
        try {
          // Check if the content is of type "image" and delete it from storage
          if (itemToDelete.type === "image") {
            const imageRef = ref(storage, itemToDelete.value);
            await deleteObject(imageRef);
          }
          // If the content is a "carousel", loop through all images and delete each from storage
          else if (itemToDelete.type === "carousel") {
            for (const imageUrl of itemToDelete.images) {
              const imageRef = ref(storage, imageUrl);
              await deleteObject(imageRef);
            }
          }
          // If the content is a "video", delete the video and its poster image if available
          else if (itemToDelete.type === "video") {
            const videoRef = ref(storage, itemToDelete.value);
            await deleteObject(videoRef); // Delete video file

            if (itemToDelete.poster) {
              const posterRef = ref(storage, itemToDelete.poster);
              await deleteObject(posterRef); // Delete poster image
            }
          }
          // Update the content state by filtering out the deleted item
          const newContent = content.filter((_, i) => i !== index);
          setContent(newContent);
          // Show success message after successful deletion

          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "Content has been deleted.",
            position: "top-end",
            showConfirmButton: false,
            timer: 2500,
            toast: true,
          });
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Oops!",
            text: `Failed to delete content: ${error.message}`,
            position: "top-end",
            showConfirmButton: false,
            timer: 2500,
            toast: true,
          });
        }
      }
    });
  };
  const saveToFirebase = async () => {
    // Alert if no content is empty
    if (content.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Store is Empty!",
        text: "Please add some content before saving.",
        position: "top-end",
        showConfirmButton: false,
        timer: 2500,
        toast: true,
      });
      return;
    }
    try {
      // Show confirmation dialog
      Swal.fire({
        title: "Are you sure?",
        text: "Do you want to save the store content?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, save it!",
        cancelButtonText: "Cancel",
      }).then(async (result) => {
        if (result.isConfirmed) {
          // Save store if confirmed
          await addDoc(collection(db, "stores"), { content });
          setContent([]);
          Swal.fire({
            icon: "success",
            title: "Saved!",
            text: "Your store has been saved successfully.",
            position: "top-end",
            showConfirmButton: false,
            timer: 2500,
            toast: true,
          });
        }
      });
    } catch (e) {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Something went wrong while saving.",
        position: "top-end",
        showConfirmButton: false,
        timer: 2500,
        toast: true,
      });
    }
  };

  return (
    <div className="preview">
      {/* Add new content icon */}
      <i
        className="fas fa-plus add-icon position"
        onClick={() => {
          setModesVisible(true);
          setCurrentInsertIndex(-1);
          setArrowDirection("down");
        }}
      ></i>
      {/* Render all content items */}
      {content.map((item, index) => (
        <>
          <div key={index} className="content-item">
            <i
              className="fas fa-trash delete-icon"
              onClick={() => handleDeleteContent(index)}
            ></i>

            {item.type === "text" && (
              <Text
                content={content}
                item={item}
                index={index}
                editting={editting}
                setEditting={setEditting}
                loading={loading}
                setLoading={setLoading}
              />
            )}

            {/* Render different content types based on 'item.type' */}
            {item.type === "image" && (
              <Image
                content={content}
                setContent={setContent}
                item={item}
                index={index}
                editting={editting}
                setEditting={setEditting}
                loading={loading}
                setLoading={setLoading}
              />
            )}

            {item.type === "carousel" && (
              <Carousel
                content={content}
                setContent={setContent}
                item={item}
                index={index}
                editting={editting}
                setEditting={setEditting}
                loading={loading}
                setLoading={setLoading}
              />
            )}

            {item.type === "video" && (
              <Video
                content={content}
                setContent={setContent}
                item={item}
                index={index}
                editting={editting}
                setEditting={setEditting}
                loading={loading}
                setLoading={setLoading}
                videoFile={videoFile}
                setVideoFile={setVideoFile}
                posterImage={posterImage}
                setPosterImage={setPosterImage}
              />
            )}
            {item.type === "form" && <Form />}
            {item.type === "products" && (
              <Products
                content={content}
                setContent={setContent}
                item={item}
                index={index}
                editting={editting}
                setEditting={setEditting}
                loading={loading}
                selectedProducts={selectedProducts}
                setSelectedProducts={setSelectedProducts}
                limits={limits}
                products={products}
              />
            )}
          </div>
          <i
            className="fas fa-plus add-icon position"
            onClick={() => {
              setModesVisible(true);
              setCurrentInsertIndex(index);
              setArrowDirection("down");
            }}
          ></i>
        </>
      ))}
      <button className="save-button" onClick={saveToFirebase}>
        <i className="fas fa-save"></i> Save Store
      </button>
    </div>
  );
};

export default Preview;
