import React from 'react'
import "./CartStyles/CheckoutPath.css";
import { FaTruck } from "react-icons/fa";
import { BsCreditCardFill, BsCheckCircleFill } from "react-icons/bs";




function CheckoutPath({ activePath }) {

  const path = [
    {
      label: "Shipping Details",
      icon: <FaTruck />
    }, {
      label: "Confirm Order",
      icon: <BsCheckCircleFill />
    }, {
      label: "Payment",
      icon: <BsCreditCardFill />
    },
  ];


  return (
    <div className="checkoutPath">
      {
        path?.map((item, idx) => (
          <div className="checkoutPath-step" key={idx}
            active={activePath === idx ? "true" : "false"}
            completed={activePath > idx ? "true" : "false"}
          >
            <p className="checkoutPath-icon">{item.icon}</p>
            <p className="checkoutPath-label">{item.label}</p>
          </div>
        ))
      }
    </div >
  )
}

export default CheckoutPath