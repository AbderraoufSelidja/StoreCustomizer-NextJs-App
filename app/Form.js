"use client";
import { useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Swal from "sweetalert2";
import "./styles.css";
const Form = () => {
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
  return (
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
          {" "}
          <i className="fas fa-paper-plane"></i>Send
        </button>
      </form>
    </div>
  );
};
export default Form;
