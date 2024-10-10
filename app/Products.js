"use client";
import { useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Swal from "sweetalert2";
import "./styles.css";
import Product from "./Product";
const Products = ({
  content,
  setContent,
  item,
  index,
  editting,
  setEditting,
  loading,
  selectedProducts,
  setSelectedProducts,
  limits,
  products,
}) => {
  const [showAddProducts, setShowAddProducts] = useState(false); // State to manage visibility of add products section
  // Function to handle product deletion
  const handleDeleteProduct = (contentIndex, productIndex) => {
    // Map through content to find the right item and filter out the deleted product
    const updatedContent = content.map((item, indx) => {
      if (indx === contentIndex && item.type === "products") {
        const updatedProducts = item.value.filter((_, i) => i !== productIndex);
        setSelectedProducts(updatedProducts);
        return { ...item, value: updatedProducts };
      }
      return item; // Return the item unchanged if not found
    });
    setContent(updatedContent); // Update the content state
  };
  return (
    <div>
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
            setShowAddProducts(false);
          }}
        ></i>
      )}
      <div className="products-container">
        {item.value.map((product, productIndex) => (
          <div key={product.id} className="product">
            {editting === index && ( // Show delete button only in edit mode
              <i
                className="fas fa-trash delete-icon"
                onClick={() => handleDeleteProduct(index, productIndex)} // Delete product on click
              ></i>
            )}
            <img
              src={product.image}
              alt={product.name}
              className="product-image"
            />
            <h3 className="product-title">{product.name}</h3>
            <p className="product-price">${product.price}</p>
          </div>
        ))}
        {/* Show add icon only in edit mode */}
        {editting === index && (
          <i
            className="fas fa-plus add-icon product"
            onClick={() => setShowAddProducts(true)} // Toggle add products modal
          ></i>
        )}
      </div>
      {/* Show add products section if toggled on */}
      {showAddProducts && (
        <div>
          <h2 className="add-more">Add More Products</h2>
          <div className="products-container">
            {products
              .filter((prod) => !item.value.some((p) => p.id === prod.id)) // Filter out already added products
              .map((product) => {
                const isAdded = selectedProducts.some(
                  // Check if product is selected
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
          {/* Button to submit added products */}
          <button
            onClick={() => {
              const newProducts = [...selectedProducts];
              item.value = newProducts; // Update the item value
              setSelectedProducts([]); // Clear selected products
              setShowAddProducts(false); // Hide add products section
              // Show success notification
              Swal.fire({
                icon: "success",
                title: "Success!",
                text: "Products has been added.",
                position: "top-end",
                showConfirmButton: false,
                timer: 2500,
                toast: true,
              });
            }}
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
      )}
    </div>
  );
};
export default Products;
