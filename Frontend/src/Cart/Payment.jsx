import React from 'react'
import "./CartStyles/Payment.css"
import PageTitle from '../components/pageTitle'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import CheckoutPath from './CheckoutPath';
import { Link } from 'react-router-dom'

function Payment() {

  const orderSummary = JSON.parse(sessionStorage.getItem("orderSummary"));

  return (
    <>
      <PageTitle title={"Order Payment"} />
      <Navbar cartIconHide={true} />
      <CheckoutPath activePath={2} />
      <div className="payment-container">
        <Link to={"/order/confirm"}
          className='payment-go-back'
        >
          Go Back
        </Link>
        <button className='payment-btn'>Pay ({orderSummary?.total})/-</button>
      </div>
      <Footer />
    </>
  )
}

export default Payment