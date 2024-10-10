// Text.js
import React from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Swal from "sweetalert2";
const Text = ({ content, item, index, editting, setEditting }) => {
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
      {/* If in edit mode, show the Froala editor to modify the text */}
      {editting === index ? (
        <div className="edit-text-container">
          {/* 'indice' differentiates the Text component's purpose: "inputText": for user input, "item.value": for content preview*/}
          <button
            onClick={() => {
              setEditting(null);
              Swal.fire({
                icon: "success",
                title: "Success!",
                text: "Text has been replaced.",
                position: "top-end",
                showConfirmButton: false,
                timer: 2500,
                toast: true,
              });
            }}
            className="submit-button"
          >
            Save New Text
          </button>
        </div>
      ) : (
        // Display the saved content text when not in edit mode
        <p className="content-text">
          <div
            className="fr-view"
            dangerouslySetInnerHTML={{ __html: item.value }}
          />{" "}
          {/* Display content */}
        </p>
      )}
    </>
  );
};
export default Text;
