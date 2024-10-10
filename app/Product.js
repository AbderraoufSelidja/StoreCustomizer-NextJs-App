// Product.js
import React from 'react';
import Swal from 'sweetalert2';
import "./styles.css"
const Product = ({ product, isAdded, selectedProducts, setSelectedProducts, limits }) => {
    const handleToggle = () => {
        if (isAdded) {
            setSelectedProducts(
              selectedProducts.filter(
                (p) => p.id !== product.id
              )
            );
          } else if (
            selectedProducts.length < limits.maxProducts
          ) {
            setSelectedProducts([
              ...selectedProducts,
              product,
            ]);
          } else {
            Swal.fire({
              title: "Limit Reached!",
              text: `You have reached the limit of ${limits.maxProducts} products.`,
              icon: "warning",
              confirmButtonText: "Okay",
            });
          }
      };
  return (
    <div className="product" style={{ opacity: isAdded ? 0.5 : 1 }}>
      <img src={product.image} alt={product.name} className="product-image" />
      <h3 className="product-title">{product.name}</h3>
      <p className="product-price">${product.price}</p>
      <button className="add-to-store" onClick={handleToggle}>
        {isAdded ? "Remove from Store" : "Add to Store"}
      </button>
    </div>
  );
};

export default Product;
