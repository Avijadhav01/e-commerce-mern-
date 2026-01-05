import React, { useState, useEffect } from 'react';
import "./CartStyles/Cart.css";
import { FaTrash } from "react-icons/fa";
import { useDispatch } from 'react-redux';
import { editItemInCart, removeFromCart } from '../features/cart/cartSlice';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

function CartItem({ product }) {
  const [quantity, setQuantity] = useState(product.quantity);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(editItemInCart({ productId: product.productId, quantity }));
  }, [quantity]);

  const increaseQuantity = () => {
    if (quantity >= product.stock) return;
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity <= 1) return;
    setQuantity(prev => prev - 1);
  };

  const handleOnRemove = () => {
    dispatch(removeFromCart({ productId: product.productId }));
    toast.success("Item removed successfully");
  };




  return (
    <div className="cart-item">
      <div className="item-info">
        <Link to={`/products/${product.productId}`}>
          <img src={product?.image} alt={product?.name} className='item-image' />
        </Link>
        <div className="item-details">
          <h3 className='item-name'>{product?.name}</h3>
          <p className="item-quantity"><strong>Price: </strong>{product?.price}/-</p>
          <p className="item-quantity"><strong>Quantity: </strong>{quantity}</p>
        </div>
      </div>

      <div className="quantity-controls">
        <button
          className={` ${quantity <= 1 ? "active" : ""} quantity-button decrease-btn`}
          onClick={decreaseQuantity}
          disabled={quantity <= 1}
        >
          -
        </button>
        <input type="number" className="quantity-input" value={quantity} readOnly min="1" />
        <button
          className={` ${quantity >= product.stock ? "active" : ""} quantity-button increase-btn`}
          onClick={increaseQuantity}
          disabled={quantity >= product.stock}
        >
          +
        </button>
      </div>

      <div className="item-total">
        <span className="item-total-price">
          ₹{product?.price * quantity}.00
        </span>
      </div>

      <div className="item-actions">
        <button className="update-item-btn" onClick={handleOnRemove}>
          Remove
        </button>
      </div>
    </div>
  );
}

export default CartItem;
