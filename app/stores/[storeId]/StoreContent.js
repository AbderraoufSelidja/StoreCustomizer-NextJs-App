// StoreContent.jsx or StoreContent.tsx

"use client";
import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./storeContent.css";
import Swal from "sweetalert2";

const StoreContent = ({ store }) => {
  const [userMessage, setUserMessage] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userMessageObject, setUserMessageObject] = useState("");

  const handleSendMessage = (event) => {
    event.preventDefault();
    Swal.fire({
      icon: "success",
      title: "Message Sent!",
      text: "Your message has been successfully sent.",
      position: "top-end",
      showConfirmButton: false,
      timer: 2500,
      toast: true,
    });

    setUserEmail("");
    setUserMessage("");
    setUserMessageObject("");
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="preview">
      {store.content.map((item, index) => (
        <div key={index} className="content-item">
          {item.type === "text" && <div className="fr-view" dangerouslySetInnerHTML={{ __html: item.value }} />}
          {item.type === "image" && <img className="content-image" src={item.value} alt="Uploaded" />}
          {item.type === "carousel" && (
            <div className="carousel-container">
              <Slider {...settings}>
                {item.images.map((img, imgIndex) => (
                  <div key={imgIndex}>
                    <img className="carousel-image" src={img} alt={`Carousel ${imgIndex}`} />
                  </div>
                ))}
              </Slider>
            </div>
          )}
          {item.type === "video" && (
            <div className="video-container">
              <video className="content-video" controls poster={item.poster}>
                <source src={item.value} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}
          {item.type === "form" && (
            <div className="form-container">
              <div className="title">Send message to supplier</div>
              <form onSubmit={handleSendMessage} className="message-container">
                <div className="form-section-container">
                  <label htmlFor="userEmail">Email:</label>
                  <input
                    type="email"
                    id="userEmail"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="email"
                    required
                  />
                </div>
                <div className="form-section-container">
                  <label htmlFor="userObject">Object:</label>
                  <input
                    type="text"
                    id="userObject"
                    value={userMessageObject}
                    onChange={(e) => setUserMessageObject(e.target.value)}
                    className="object"
                    required
                  />
                </div>
                <div className="form-section-container">
                  <label htmlFor="userMessage">Message:</label>
                  <textarea
                    id="userMessage"
                    value={userMessage}
                    onChange={(e) => setUserMessage(e.target.value)}
                    className="message"
                    required
                  />
                </div>
                <button type="submit" className="submit">
                  <i className="fas fa-paper-plane"></i> Send
                </button>
              </form>
            </div>
          )}
          {item.type === "products" && (
            <div className="products-container">
              {item.value.map((product) => (
                <div key={product.id} className="product">
                  <img src={product.image} alt={product.name} className="product-image" />
                  <h3 className="product-title">{product.name}</h3>
                  <p className="product-price">${product.price}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default StoreContent;
