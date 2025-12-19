import React from 'react'
import "./CartStyles/Cart.css";
import PageTitle from '../components/pageTitle';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

import CartItem from './CartItem';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';


function Cart() {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { cartItems } = useSelector(state => state.cart)

  // Price Summary calculation
  const subtotal = cartItems.reduce((total, item) => {
    const itemTotal = item.price * item.quantity;
    return total + itemTotal;
  }, 0);

  const tax = (subtotal * 6) / 100
  const shippingCharges = subtotal > 1000 ? 0 : 60;
  const total = subtotal + tax + shippingCharges;

  const checkoutHandler = () => {
    navigate("/login?redirect=/shipping");
  }

  return (
    <>
      <PageTitle title="My Cart" />
      <Navbar cartIconHide={true} />
      {
        cartItems && cartItems.length !== 0 ? (
          <div className="cart-page">

            <div className="cart-items">
              <div className="heading">
                Your Cart
              </div>

              {/* Cart Item header */}
              <div className="cart-table">
                <div className="cart-table-header">
                  <div className="header-product">Product</div>
                  <div className="header-product">Info</div>
                  <div className="header-quantity">Quantity</div>
                  <div className="header-total item-total-heading">Item Total</div>
                  <div className="header-action item-total-heading">Actions</div>
                </div>

                <div className='items-container'>
                  {
                    cartItems && cartItems.map((item, idx) => (
                      <CartItem product={item} key={idx} />
                    ))
                  }
                </div>
              </div>
            </div>

            {/* Price summary */}
            <div className="price-summary">
              <h3 className="price-summary-heading">Price Summary</h3>
              <div className="summary-item">
                <p className='summary-lable'>Subtotal : </p>
                <p className='summary-lable'>{subtotal}/- </p>
              </div>
              <div className="summary-item">
                <p className='summary-lable'>Tax (6%) : </p>
                <p className='summary-lable'>{tax}/- </p>
              </div>
              <div className="summary-item">
                <p className='summary-lable'>Shipping Charges : </p>
                <p className='summary-lable'>
                  {shippingCharges === 0 ? "Free Delivery" : `₹${shippingCharges}`}
                </p>
              </div>
              <div className="summary-total">
                <p className='total-lable'>Total : </p>
                <p className='total-lable'>{total}/- </p>
              </div>
              <button
                className="checkout-btn"
                onClick={checkoutHandler}
              >Checkout</button>
            </div>

          </div>
        ) : (<div className="cart-empty">
          <h3>Your cart is empty</h3>
          <Link to="/products" ><button className="btn">View Products</button></Link>
        </div>)
      }
      <Footer />
    </>
  )
}

export default Cart;