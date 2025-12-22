import React, { useEffect } from 'react'
import "./CartStyles/OrderConfirm.css";
import PageTitle from '../components/pageTitle';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CheckoutPath from './CheckoutPath';

import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function OrderConfirm() {

  const { shippingInfo, cartItems } = useSelector(state => state.cart);
  const { user } = useSelector(state => state.user);

  // Price Summary calculation
  const subtotal = cartItems?.reduce((total, item) => {
    const itemTotal = item.price * item.quantity;
    return total + itemTotal;
  }, 0);

  const tax = (subtotal * 6) / 100
  const shippingCharges = subtotal > 1000 ? 0 : 60;
  const total = subtotal + tax + shippingCharges;

  const navigate = useNavigate();

  // Create order and go to payment page
  const proceedToPayment = async () => {
    const shippingDetails = {
      name: user?.fullName,
      phone: shippingInfo?.phoneNumber,
      street: shippingInfo?.address,
      city: shippingInfo?.city,
      state: shippingInfo?.state,
      country: shippingInfo?.country,
      postalCode: shippingInfo?.pinCode,
    }
    const orderData = {
      shippingAddress: shippingDetails,
      orderItems: cartItems.map(item => ({
        product: item.productId,
        quantity: item.quantity,
      })),
    };

    try {
      // console.log(orderData);
      // 1️⃣ Create the order in backend
      const { data } = await axios.post("/api/v1/orders/create", orderData, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });

      // 2️⃣ Get order ID from response
      const order = data.data;
      const orderId = order._id;

      // 3️⃣ Store order info for payment page
      sessionStorage.setItem("orderId", orderId);
      sessionStorage.setItem("orderSummary", JSON.stringify({ priceToPay: total }));

      // 4️⃣ Navigate to payment page
      navigate("/order/payment");

    } catch (error) {
      console.error(error);
      alert("Error creating order. Please try again.");
    }
  }

  return (
    <>
      <PageTitle title={"Order Confirmation page"} />
      <Navbar cartIconHide={true} />
      <CheckoutPath activePath={1} />
      <div className="confirm-container">
        <h1 className="confirm-header">Order Confirmation</h1>
        <div className="confirm-table-container">

          {/* User Info */}
          <table className="confirm-table">
            <caption>Shipping Details</caption>
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Address</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{user?.fullName}</td>
                <td>{user?.phone}</td>
                <td>{shippingInfo?.address}, {shippingInfo?.city}, {shippingInfo?.state}, {shippingInfo?.country} - {shippingInfo?.pinCode}</td>
              </tr>
            </tbody>
          </table>

          {/* Order Items */}
          <table className="confirm-table cart-table">
            <caption>Cart Items</caption>
            <thead>
              <tr>
                <th>Image</th>
                <th>Product Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>TotalPrice</th>
              </tr>
            </thead>
            <tbody>
              {
                cartItems?.map((item, idx) => (
                  <tr key={idx} className='product-row'>
                    <td><img src={item?.image} alt={item?.name} className='product-img' /></td>
                    <td>{item?.name}</td>
                    <td>{item?.price}/-</td>
                    <td>{item?.quantity}</td>
                    <td>{item?.quantity * item?.price}/-</td>
                  </tr>
                ))
              }
            </tbody>
          </table>

          {/* Order Summary */}
          <table className="confirm-table">
            <caption>Order Summary</caption>
            <thead>
              <tr>
                <th>Subtotal</th>
                <th>Shipping Charges</th>
                <th>GST</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{subtotal}/-</td>
                <td>{shippingCharges === 0 ? "Free Delivery" : `${shippingCharges}/-`}</td>
                <td>{tax}/-</td>
                <td>₹ {total}/-</td>
              </tr>
            </tbody>
          </table>

        </div>
        <button className="proceed-button"
          onClick={proceedToPayment}
        >
          Proceed to Payment
        </button>
      </div>
      <Footer />
    </>
  )
}

export default OrderConfirm