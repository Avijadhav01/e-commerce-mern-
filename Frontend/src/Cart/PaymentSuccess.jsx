import React, { useEffect } from 'react'
import "./CartStyles/PaymentSuccess.css";
import { Link, useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar';
import PageTitle from '../components/PageTitle';

import { useDispatch } from 'react-redux';
import { clearCart } from '../features/cart/cartSlice';

function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get('reference');

  const dispatch = useDispatch();

  useEffect(() => {
    // Clear Redux store
    dispatch(clearCart());

    // Clear localStorage
    localStorage.removeItem("cartItems");
    localStorage.removeItem("shippingInfo");
  }, []);

  return (
    <>
      <Navbar cartIconHide={true} />
      <PageTitle title={"Payment Success"} />
      <div className="payment-success-container">
        <div className="success-icon">
          <div className="checkmark"></div>
        </div>
        <h1>Order Confirmed!</h1>
        <p>Your payment was successful. Reference ID <strong>{reference}</strong></p>
        <Link className='explore-btn' to="/">Explore more Products</Link>
      </div>
    </>
  )
}

export default PaymentSuccess