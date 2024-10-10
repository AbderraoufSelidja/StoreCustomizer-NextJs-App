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
import Product from "./Product";
const Customize = ({
  content,
  setContent,
  setModesVisible,
  isModesVisible,
  currentInsertIndex,
  setCurrentInsertIndex,
  arrowDirection,
  setArrowDirection,
  mode,
  setMode,
  loading,
  setLoading,
  limits,
  videoFile,
  setVideoFile,
  posterImage,
  setPosterImage,
  products,
  selectedProducts,
  setSelectedProducts,
}) => {
  const storage = getStorage(app); // State to store the given text
  const [inputText, setInputText] = useState("");
  const handleTextSubmit = () => {
    // Alert if no text is entered
    if (!inputText) {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Please enter some text.",
        position: "top-end",
        showConfirmButton: false,
        timer: 2500,
        toast: true,
      });
      return;
    }
    setLoading(true); // Show loading spinner during image upload
    // Check if there is a specific position to insert the text
    if (currentInsertIndex !== null) {
      // Insert the text content at the specified position in the array
      content.splice(currentInsertIndex + 1, 0, {
        type: "text",
        value: inputText,
      });
    } else {
      // If no specific position, add the text to the end of the content array
      setContent([...content, { type: "text", value: inputText }]);
    }
    setInputText(""); // Clear the input text field
    setMode(""); // Reset the mode to its initial state
    setModesVisible(false); // Hide the modes container
    setArrowDirection("right"); // Change the arrow direction to 'right'
    setCurrentInsertIndex(null); // Reset the current insert index
    // Show success alert
    Swal.fire({
      icon: "success",
      title: "Success!",
      text: "Text added to store.",
      position: "top-end",
      showConfirmButton: false,
      timer: 2500,
      toast: true,
    });

    // End loading state
    setLoading(false);
  };
  const [imageFile, setImageFile] = useState(null); // State to store the selected image file
  const handleImageUpload = async () => {
    // Alert if no image is selected
    if (!imageFile) {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Please upload an image.",
        position: "top-end",
        showConfirmButton: false,
        timer: 2500,
        toast: true,
      });
      return;
    }
    setLoading(true); // Show loading spinner during image upload
    // Upload the image to the specified storage location and get the url
    const storageRef = ref(storage, `images/${imageFile.name}`);
    await uploadBytes(storageRef, imageFile);
    const url = await getDownloadURL(storageRef);
    // Check if there is a specific position to insert the image
    if (currentInsertIndex !== null) {
      // Insert the image at the specified position in the array
      content.splice(currentInsertIndex + 1, 0, { type: "image", value: url });
    } else {
      setContent([...content, { type: "image", value: url }]);
    }
    setImageFile(null); // Clear the selected image file
    setModesVisible(false); // Hide the modes container
    setArrowDirection("right"); // Change the arrow direction to 'right'
    setCurrentInsertIndex(null); // Reset the current insert index
    setMode(""); // Reset the mode to its initial state
    // Show success alert
    Swal.fire({
      icon: "success",
      title: "Success!",
      text: "Image added to store.",
      position: "top-end",
      showConfirmButton: false,
      timer: 2500,
      toast: true,
    });

    // End loading state
    setLoading(false);
  };
  const [carouselImages, setCarouselImages] = useState([]);
  const handleCarouselImageUpload = async () => {
    // Alert if no carousel images are selected
    if (carouselImages.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Please upload some images.",
        position: "top-end",
        showConfirmButton: false,
        timer: 2500,
        toast: true,
      });
      return;
    }
    setLoading(true); // Show loading spinner during image upload
    let urls = []; // Array to store the URLs of the uploaded images
    for (const file of carouselImages) {
      const storageRef = ref(storage, `carousel/${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      urls.push(url);
    }
    // Check if there is a specific position to insert the carousel
    if (currentInsertIndex !== null) {
      // Insert the carousel at the specified position in the array
      content.splice(currentInsertIndex + 1, 0, {
        type: "carousel",
        images: urls,
      });
    } else {
      // If no specific position, add the carousel to the end of the content array
      setContent([...content, { type: "carousel", images: urls }]);
    }

    setCarouselImages([]); // Clear the selected carousel images
    setMode(""); // Reset the mode to its initial state
    setModesVisible(false); // Hide the modes container
    setArrowDirection("right"); // Change the arrow direction to 'right'
    setCurrentInsertIndex(null); // Reset the current insert index
    setLoading(false); // End the loading state
    Swal.fire({
      icon: "success",
      title: "Success!",
      text: "Carousel added to store.",
      position: "top-end",
      showConfirmButton: false,
      timer: 2500,
      toast: true,
    });
  };
  const handleVideoUpload = async () => {
    try {
      // Alert if no video file is selected
      if (!videoFile) {
        Swal.fire({
          icon: "error",
          title: "Oops!",
          text: "Please upload a video file.",
          position: "top-end",
          showConfirmButton: false,
          timer: 2500,
          toast: true,
        });
        return;
      }

      setLoading(true); // Show loading spinner during image upload
      const videoRef = ref(storage, `videos/${videoFile.name}`);
      await uploadBytes(videoRef, videoFile);
      const videoURL = await getDownloadURL(videoRef);

      let posterURL = null;
      // Check if a poster image has been selected
      if (posterImage) {
        const posterRef = ref(storage, `posters/${posterImage.name}`);
        await uploadBytes(posterRef, posterImage);
        posterURL = await getDownloadURL(posterRef);
      }
      // Check if there is a specific position to insert the video
      if (currentInsertIndex !== null) {
        // Insert the video at the specified position in the array
        content.splice(currentInsertIndex + 1, 0, {
          type: "video",
          value: videoURL,
          poster: posterURL,
        }); // Insert after the current position
      } else {
        // If no specific position, add the video to the end of the content array
        setContent([
          ...content,
          { type: "video", value: videoURL, poster: posterURL },
        ]);
      }
      setVideoFile(null); // Clear the selected video file
      setPosterImage(null); // Clear the selected poster image
      setModesVisible(false); // Hide the modes container
      setArrowDirection("right"); // Change the arrow direction to 'right'
      setCurrentInsertIndex(null); // Reset the current insert index
      setMode(""); // Reset the mode to its initial state
      // Show a success alert using SweetAlert after the video is uploaded
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Video uploaded to store.",
        position: "top-end",
        showConfirmButton: false,
        timer: 2500,
        toast: true,
      });
    } catch (error) {
      console.error("Video upload failed:", error);
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: "Something went wrong during the upload. Please try again.",
        position: "top-end",
        showConfirmButton: false,
        timer: 2500,
        toast: true,
      });
    } finally {
      setLoading(false); // End the loading state regardless of the outcome
    }
  };
  const [supplierGmail, setSupplierGmail] = useState("");
  const handleGmailSubmit = (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    // Check if there is a specific position to insert the form
    if (currentInsertIndex !== null) {
      content.splice(currentInsertIndex + 1, 0, {
        type: "form",
        email: supplierGmail,
      });
    } else {
      setContent([...content, { type: "form", email: supplierGmail }]);
    }
    setSupplierGmail(""); // Clear the supplier Gmail input
    setMode(""); // Reset the mode to its initial state
    setModesVisible(false); // Hide the modes container
    setArrowDirection("right"); // Change the arrow direction to 'right'
    // Show a success alert using SweetAlert after the form is added
    Swal.fire({
      icon: "success",
      title: "Success!",
      text: "Form added to store.",
      position: "top-end",
      showConfirmButton: false,
      timer: 2500,
      toast: true,
    });
  };
  const handleSubmitProducts = () => {
    try {
      // Check if any products have been selected
      if (selectedProducts.length === 0) {
        Swal.fire({
          icon: "error",
          title: "Oops!",
          text: "Please choose some products.",
          position: "top-end",
          showConfirmButton: false,
          timer: 2500,
          toast: true,
        });
        return;
      }

      setLoading(true); // Show loading spinner to indicate the operation is in progress
      // Check if there is a specific position to insert the products
      if (currentInsertIndex !== null) {
        content.splice(currentInsertIndex + 1, 0, {
          type: "products",
          value: selectedProducts,
        }); //  // Insert the new products after the current index
      } else {
        // If no specific position, add the products to the end of the content array
        setContent([...content, { type: "products", value: selectedProducts }]);
      }
      setCurrentInsertIndex(null); // Reset the current insert index
      setModesVisible(false); // Hide the modes container
      setArrowDirection("right"); // Change the arrow direction to 'right'
      setMode(""); // Reset the mode to its initial state

      // Show a success alert using SweetAlert after the products are added
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Products added to your store.",
        position: "top-end",
        showConfirmButton: false,
        timer: 2500,
        toast: true,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Operation Failed",
        text: "Something went wrong while adding the products. Please try again.",
        position: "top-end",
        showConfirmButton: false,
        timer: 2500,
        toast: true,
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="customize-container">
      {/* Button to toggle the visibility of the modes container */}
      <button
        className="add-button"
        onClick={() => {
          setModesVisible(!isModesVisible);
          setCurrentInsertIndex(null);
          setArrowDirection(isModesVisible ? "right" : "down"); // Change the arrow direction based on the visibility
        }}
      >
        {isModesVisible ? "Hide Modes" : "Add Something"}
        {/* Change button text based on visibility */}
        <i
          className={`fas fa-chevron-${
            arrowDirection === "right" ? "right" : "down" // Display the appropriate arrow direction icon
          }`}
        ></i>
      </button>
      {/* Modes container to display different mode options based on visibility */}
      <div
        className={`modes-container ${
          isModesVisible ? "visible" : "notVisible"
        }`}
      >
        <div className="buttons-container">
          {/* Button for selecting the "Text" mode */}
          <button
            className={`mode-button ${mode === "text" ? "active" : ""}`}
            onClick={() => {
              setMode("text");
              if (!isModesVisible) setModesVisible(true);
            }}
          >
            <i className="fas fa-file-alt"></i> Text
          </button>
          {/* Button for selecting the "Image Upload" mode */}
          <button
            className={`mode-button ${mode === "imageUpload" ? "active" : ""}`}
            onClick={() => {
              setMode("imageUpload");
              if (!isModesVisible) setModesVisible(true);
            }}
          >
            <i className="fas fa-image"></i> Image
          </button>
          {/* Button for selecting the "Carousel" mode */}
          <button
            className={`mode-button ${mode === "carousel" ? "active" : ""}`}
            onClick={() => {
              setMode("carousel");
              if (!isModesVisible) setModesVisible(true);
            }}
          >
            <i className="fas fa-images"></i> Carousel
          </button>
          {/* Button for selecting the "Video" mode */}
          <button
            className={`mode-button ${mode === "video" ? "active" : ""}`}
            onClick={() => {
              setMode("video");
              if (!isModesVisible) setModesVisible(true);
            }}
          >
            <i className="fas fa-video"></i> Video
          </button>
          {/* Button for selecting the "Products" mode */}
          <button
            className={`mode-button ${mode === "products" ? "active" : ""}`}
            onClick={() => {
              setMode("products");
              if (!isModesVisible) setModesVisible(true);
            }}
          >
            <i className="fas fa-shopping-cart"></i> Products
          </button>
          {/* Button for selecting the "Form" mode */}
          <button
            className={`mode-button ${mode === "form" ? "active" : ""}`}
            onClick={() => setMode("form")}
          >
            <i className="fas fa-envelope"></i> Form
          </button>
        </div>
        {/* Content container to handle different modes' specific content */}
        <div className="content-container">
          {mode === "text" && (
            <div className="text-input">
              {/* Text editor component for entering user text */}
              {/* 'indice' differentiates the Text component's purpose: "inputText": for user input, "item.value": for content preview*/}
             
              <button className="submit-button" onClick={handleTextSubmit}>
                {loading ? (
                  <i className="fas fa-spinner fa-spin"></i>
                ) : (
                  <i className="fas fa-paper-plane"></i>
                )}
                Submit Text
              </button>
            </div>
          )}
          {mode === "imageUpload" &&
            (limits.maxImages > 0 ? (
              <div className="image-upload">
                <label htmlFor="image-upload" className="custom-file">
                  <i className="fas fa-upload"></i>Upload Image
                </label>
                <input
                  id="image-upload"
                  type="file"
                  className="input-file"
                  onChange={(e) => {
                    const imageCount = content.filter(
                      (item) => item.type === "image"
                    ).length;

                    if (imageCount < limits.maxImages) {
                      setImageFile(e.target.files[0]);
                    } else {
                      Swal.fire({
                        title: "Image Limit Reached!",
                        text: `You can only upload up to ${limits.maxImages} images based on your subscription.`,
                        icon: "warning",
                        confirmButtonText: "Okay",
                      });
                    }
                  }}
                />

                <button className="submit-button" onClick={handleImageUpload}>
                  {loading ? (
                    <i className="fas fa-spinner fa-spin"></i>
                  ) : (
                    <i className="fas fa-paper-plane"></i>
                  )}
                  Submit Image
                </button>
              </div>
            ) : (
              <button></button>
            ))}

          {mode === "carousel" &&
            (limits.maxCarousels > 0 ? (
              <div className="carousel-upload">
                <label htmlFor="carousel-upload" className="custom-file">
                  <i className="fas fa-upload"></i>Upload Carousel Images
                </label>
                <input
                  id="carousel-upload"
                  type="file"
                  multiple
                  className="input-file"
                  onChange={(e) => {
                    const carouselCount = content.filter(
                      (item) => item.type === "carousel"
                    ).length;

                    if (carouselCount < limits.maxCarousels) {
                      // Proceed if within limits
                      setCarouselImages(Array.from(e.target.files));
                    } else {
                      Swal.fire({
                        title: "Carousel Image Limit Reached!",
                        text: `You can only upload up to ${limits.maxCarousels} carousels based on your subscription.`,
                        icon: "warning",
                        confirmButtonText: "Okay",
                      });
                    }
                  }}
                />

                <button
                  className="submit-button"
                  onClick={handleCarouselImageUpload}
                >
                  {loading ? (
                    <i className="fas fa-spinner fa-spin"></i>
                  ) : (
                    <i className="fas fa-paper-plane"></i>
                  )}
                  Submit Carousel Images
                </button>
              </div>
            ) : (
              <button></button>
            ))}
          {mode === "video" &&
            (limits.maxVideos > 0 ? (
              <div className="video-upload">
                <label htmlFor="video-upload" className="custom-file">
                  <i className="fas fa-upload"></i>Upload Video
                </label>
                <input
                  id="video-upload"
                  type="file"
                  className="input-file"
                  accept="video/*"
                  onChange={(e) => {
                    const videoCount = content.filter(
                      (item) => item.type === "video"
                    ).length;
                    if (videoCount < limits.maxVideos) {
                      setVideoFile(e.target.files[0]);
                    } else {
                      Swal.fire({
                        title: "Carousel Image Limit Reached!",
                        text: `You can only upload up to ${limits.maxVideos} videos based on your subscription.`,
                        icon: "warning",
                        confirmButtonText: "Okay",
                      });
                    }
                  }}
                />
                <label htmlFor="poster" className="custom-file">
                  <i className="fas fa-upload"></i>Upload Poster Image
                  (optional)
                </label>
                <input
                  id="poster"
                  type="file"
                  className="input-file"
                  accept="image/*"
                  onChange={(e) => {
                    setPosterImage(e.target.files[0]);
                  }}
                />
                <button className="submit-button" onClick={handleVideoUpload}>
                  {loading ? (
                    <i className="fas fa-spinner fa-spin"></i>
                  ) : (
                    <i className="fas fa-paper-plane"></i>
                  )}
                  Submit Video
                </button>
              </div>
            ) : (
              <button></button>
            ))}
          {mode === "form" && (
            <form className="form-input" onSubmit={handleGmailSubmit}>
              <label htmlFor="supplierEmail">Supplier Gmail:</label>
              <input
                id="supplierEmail"
                type="email"
                value={supplierGmail}
                onChange={(e) => setSupplierGmail(e.target.value)}
                placeholder="Enter your Gmail address"
                required
              />
              <button type="submit" className="submit-button">
                {loading ? (
                  <i className="fas fa-spinner fa-spin"></i>
                ) : (
                  <i className="fas fa-paper-plane"></i>
                )}
                Submit Form
              </button>
            </form>
          )}
          {mode === "products" &&
            (limits.maxProducts > 0 ? (
              <div className="product-list">
                <div className="products-container">
                  {products.map((product) => {
                    const isAdded = selectedProducts.some(
                      (p) => p.id === product.id
                    );
                    return (
                      <Product
                        key={product.id}
                        product={product}
                        isAdded={isAdded}
                        selectedProducts={selectedProducts}
                        setSelectedProducts={setSelectedProducts}
                        limits={limits}
                      />
                    );
                  })}
                </div>
                <button
                  onClick={handleSubmitProducts}
                  className="submit-button"
                >
                  {loading ? (
                    <i className="fas fa-spinner fa-spin"></i>
                  ) : (
                    <i className="fas fa-paper-plane"></i>
                  )}
                  Submit Products
                </button>
              </div>
            ) : (
              <button></button>
            ))}
        </div>
      </div>
    </div>
  );
};
export default Customize;
