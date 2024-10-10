// Image.js
"use client";
import "./styles.css";
import { useState } from "react";
import { app } from "@/app/components/Firebase";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Swal from "sweetalert2";
const Image = ({
  content,
  setContent,
  item,
  index,
  editting,
  setEditting,
  loading,
  setLoading,
}) => {
  const storage = getStorage(app);
  const [imageFile, setImageFile] = useState(null); // State for storing the selected image file
  // Replaces and deletes the oldest image with the newest one
  const handleSubmitImageEdit = async (index) => {
    // Alert if no file is selected
    if (!imageFile) {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Please select an image to replace.",
        position: "top-end",
        showConfirmButton: false,
        timer: 2500,
        toast: true,
      });
      return;
    }
    setLoading(true); // Show loading spinner during image upload
    try {
      // Delete the previous image from Firebase
      await deleteFromFirebase(content[index].value);
      const storageRef = ref(storage, `images/${imageFile.name}`);
      // Upload new image saves in imageFile
      await uploadBytes(storageRef, imageFile);
      const newImageUrl = await getDownloadURL(storageRef);
      // Update content with the new image URL
      const updatedContent = [...content];
      updatedContent[index].value = newImageUrl;
      setContent(updatedContent); // Update content state
      setEditting(null); // Exit edit mode
      setImageFile(null); // Clear selected image file
      // Show success message
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Image has been replaced.",
        position: "top-end",
        showConfirmButton: false,
        timer: 2500,
        toast: true,
      });
    } catch (error) {
      // Show error message in case of failure
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An issue occurred while replacing the image.",
        position: "top-end",
        showConfirmButton: false,
        timer: 2500,
        toast: true,
      });
    } finally {
      setLoading(false);
    }
  };
  // Deletes an image from Firebase Storage

  const deleteFromFirebase = async (url) => {
    try {
      const storageRef = ref(storage, url);
      await deleteObject(storageRef);
    } catch (error) {
      console.error("Error deleting element:", error);
    }
  };
  return (
    <>
      {/* Render the edit or check icon based on whether the component is in editing mode */}
      {editting !== index ? (
        <i
          className="fas fa-edit edit-icon"
          onClick={() => setEditting(index)}
        ></i>
      ) : (
        <i
          className="fas fa-check save-icon"
          onClick={() => setEditting(null)}
        ></i>
      )}
      {/* Render the image input if in editing mode */}

      {editting === index ? (
        <div className="edit-image-container">
          <label htmlFor="edit-image" className="custom-file">
            <i className="fas fa-upload"></i>Upload New Image
          </label>
          <input
            id="edit-image"
            type="file"
            className="input-file"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
          <button
            onClick={() => handleSubmitImageEdit(index)}
            className="submit-button"
          >
            {loading ? (
              <i className="fas fa-spinner fa-spin"></i>
            ) : (
              <i className="fas fa-paper-plane"></i>
            )}
            Save New Image
          </button>
        </div>
      ) : (
        // Render the image if not in editing mode
        <img className="content-image" src={item.value} alt="Uploaded" />
      )}
    </>
  );
};
export default Image;
