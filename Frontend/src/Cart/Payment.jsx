import React, { useEffect } from 'react'
import "./CartStyles/Payment.css"
import PageTitle from '../components/pageTitle'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import CheckoutPath from './CheckoutPath';
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getKey, processPayment } from '../features/payment/paymentSlice'
import { useLocation } from "react-router-dom";

function Payment() {

  const orderSummary = JSON.parse(sessionStorage.getItem("orderSummary"));
  const orderId = sessionStorage.getItem("orderId");

  const { user } = useSelector(state => state.user);
  const { shippingInfo } = useSelector(state => state.cart);

  const dispatch = useDispatch();

  const completePayment = async (amount) => {
    try {
      const { data: order } = await dispatch(processPayment(amount)).unwrap();
      const { data: key } = await dispatch(getKey()).unwrap();

      const options = {
        key,
        amount: order.amount,
        currency: "INR",
        name: "ShopEasy",
        description: "Ecommerce Website Payment Transaction",
        order_id: order.id,
        callback_url: `/api/v1/payments/verification?orderId=${orderId}`,
        prefill: {
          name: user.fullName,
          email: user.email,
          contact: shippingInfo.phoneNumber,
        },
        theme: { color: "#3399cc" }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error(error);
      alert("Payment initialization failed");
    }
  };

  const location = useLocation();
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const status = query.get("status");

    if (status === "failed") {
      alert("Payment failed. Please try again!");
    }
  }, [location]);


  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <PageTitle title={"Order Payment"} />
      <Navbar cartIconHide={true} />
      <CheckoutPath activePath={2} />
      <div className="payment-container">
        <Link to={"/order/confirm"}
          className='payment-go-back'>
          Go Back
        </Link>
        <button
          onClick={() => completePayment(orderSummary?.priceToPay)}
          className='payment-btn'>Pay ({orderSummary?.priceToPay})/-</button>
      </div>
      <Footer />
    </>
  )
}

export default Payment