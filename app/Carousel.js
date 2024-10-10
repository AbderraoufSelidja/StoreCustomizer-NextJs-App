// Carousel.js
"use client";
import { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
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
import "./styles.css";
const Carousel = ({
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
  const [showInputFile, setShowInputFile] = useState(false); // State to manage whether the input file is visible
  const [newCarouselImages, setNewCarouselImages] = useState([]); // State to store new images to add in carousel
  // Function to handle deletion of an image in the carousel
  const handleDeleteCarouselImage = async (
    carouselIndex,
    imageIndex,
    imageUrl
  ) => {
    const updatedContent = [...content]; // Clone the current content array
    updatedContent[carouselIndex].images.splice(imageIndex, 1); // Remove the image from the images array of the specific carousel
    setContent(updatedContent); // Update the content state with the modified carousel
    // Delete the image from Firebase Storage
    deleteFromFirebase(imageUrl);
    // Show success message using SweetAlert
    Swal.fire({
      icon: "success",
      title: "Success!",
      text: "Image has been deleted from carousel.",
      position: "top-end",
      showConfirmButton: false,
      timer: 2500,
      toast: true,
    });
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
  const handleSubmitCarouselEdit = async (carouselIndex) => {
    // Alert if no images are selected
    if (newCarouselImages.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Please select some images to add.",
        position: "top-end",
        showConfirmButton: false,
        timer: 2500,
        toast: true,
      });
      return;
    }
    setLoading(true); // Show loading spinner during image upload
    const updatedContent = [...content];
    // Loop through each selected image file and upload it to Firebase Storage
    for (const file of newCarouselImages) {
      const storageRef = ref(storage, `carousel/${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      updatedContent[carouselIndex].images.push(url); // Add the new image URL to the carousel
    }
    setLoading(false);
    setContent(updatedContent); // Update the content state with the newly added images
    setNewCarouselImages([]); // Clear the selected images from the state
    setShowInputFile(false); // Hide the input file selector after the operation
    setEditting(false); // Exit editing mode
    // Show success message
    Swal.fire({
      icon: "success",
      title: "Success!",
      text: "Images has been added to carousel.",
      position: "top-end",
      showConfirmButton: false,
      timer: 2500,
      toast: true,
    });
  };
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
  };
  return (
    <div className="carousel-container">
      {/* Render the edit or check icon based on whether the component is in editing mode */}
      {editting !== index ? (
        <i
          className="fas fa-edit edit-icon"
          onClick={() => setEditting(index)}
        ></i>
      ) : (
        <i
          className="fas fa-check save-icon"
          onClick={() => {
            setEditting(null);
            setShowInputFile(false);
          }}
        ></i>
      )}
      {/* Render current carousel images with delete button for each one if in editing mode */}
      {editting === index ? (
        <div className="edit-carousel-container">
          <div className="carousel-images">
            {item.images.map((img, imgIndex) => (
              <div
                key={imgIndex}
                className="carousel-image-item"
                style={{ position: "relative" }}
              >
                <img
                  className="carousel-image"
                  src={img}
                  alt={`Carousel ${imgIndex}`}
                />
                <i
                  className="fas fa-trash delete-icon"
                  onClick={() =>
                    handleDeleteCarouselImage(index, imgIndex, img)
                  }
                ></i>
              </div>
            ))}
          </div>

          {/* Button to add a new image */}
          <div className="add-carousel-image-container">
            <i
              className="fas fa-plus add-icon carousel"
              onClick={() => setShowInputFile(true)} // Show the input file
            ></i>

            {showInputFile && (
              <>
                <label htmlFor="edit-carousel" className="custom-file">
                  <i className="fas fa-upload"></i>Upload New Carousel Images
                </label>
                <input
                  id="edit-carousel"
                  type="file"
                  multiple
                  className="input-file carousel"
                  accept="image/*"
                  onChange={(e) =>
                    setNewCarouselImages(Array.from(e.target.files))
                  }
                />
                {/* Button to submit changes */}
                <button
                  className="submit-button"
                  onClick={(e) => handleSubmitCarouselEdit(index)}
                >
                  {loading ? (
                    <i className="fas fa-spinner fa-spin"></i>
                  ) : (
                    <i className="fas fa-paper-plane"></i>
                  )}
                  Save Carousel
                </button>
              </>
            )}
          </div>
        </div>
      ) : (
        // Render the carousel if not in editing mode
        <Slider {...settings}>
          {item.images.map((img, imgIndex) => (
            <div key={imgIndex}>
              <img
                className="carousel-image"
                src={img}
                alt={`Carousel ${imgIndex}`}
              />
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
};
export default Carousel;
