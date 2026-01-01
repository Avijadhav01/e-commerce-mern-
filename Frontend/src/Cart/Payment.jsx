import React, { useEffect } from 'react'
import "./CartStyles/Payment.css"
import PageTitle from '../components/pageTitle'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import CheckoutPath from './CheckoutPath';
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getKey, processPayment, removeErrors } from '../features/payment/paymentSlice'
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";

function Payment() {

  const { user } = useSelector(state => state.user);
  const { error } = useSelector(state => state.payment);
  const { shippingInfo } = useSelector(state => state.cart);
  const order = JSON.parse(sessionStorage.getItem("order"));

  const dispatch = useDispatch();

  const completePayment = async (amount) => {
    try {
      const { data: paymentOrder } = await dispatch(processPayment(amount)).unwrap();
      const { data: key } = await dispatch(getKey()).unwrap();

      console.log(paymentOrder);
      console.log(key);

      const productOrderId = order?._id
      const options = {
        key,
        amount: paymentOrder?.amount,
        currency: "INR",
        name: "ShopEasy",
        description: "Ecommerce Website Payment Transaction",
        order_id: paymentOrder?.id,
        callback_url: `/api/v1/payments/verification?orderId=${productOrderId}`,
        prefill: {
          name: user?.fullName,
          email: user?.email,
          contact: shippingInfo?.phoneNumber,
        },
        theme: { color: "#3399cc" }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error(error);
    }
  };

  const location = useLocation();
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const status = query.get("status");

    if (status === "failed") {
      toast.error("Payment failed. Please try again!");
    }
  }, [location]);


  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(removeErrors());
    }
  }, [error]);

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
          onClick={() => completePayment(order?.priceDetails?.totalPrice)}
          className='payment-btn'>
          Pay ({order?.priceDetails.totalPrice})/-
        </button>
      </div>
      <Footer />
    </>
  )
}

export default Payment