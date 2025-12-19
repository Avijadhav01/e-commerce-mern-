import React, { useState, useEffect } from "react";
import "./CartStyles/Shipping.css";

import PageTitle from "../components/pageTitle";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CheckoutPath from "./CheckoutPath";

import { useDispatch, useSelector } from "react-redux";
import { saveShippingInfo } from "../features/cart/cartSlice";
import { Country, State, City } from 'country-state-city';
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom";
function Shipping() {

  // FULLY CONTROLLED INPUTS
  const [formData, setFormData] = useState({
    address: "",
    pinCode: "",
    phoneNumber: "",
    country: "",
    state: "",
    city: "",
  });

  const { shippingInfo } = useSelector(state => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Load saved shipping info if exists
  useEffect(() => {
    if (shippingInfo) {
      setFormData({
        address: shippingInfo.address || "",
        pinCode: shippingInfo.pinCode || "",
        phoneNumber: shippingInfo.phoneNumber || "",
        country: shippingInfo.country || "",
        state: shippingInfo.state || "",
        city: shippingInfo.city || "",
      });
    }
  }, [shippingInfo]);

  // Validation form
  const validateForm = () => {
    if (!formData.address || !formData.pinCode || !formData.phoneNumber) {
      toast.error("All fields are required");
      return false;
    }

    // Pincode → exactly 6 digits
    if (!/^\d{6}$/.test(formData.pinCode)) {
      toast.error("Please enter a valid 6-digit pincode");
      return false;
    }

    // Phone number → exactly 10 digits
    if (!/^\d{10}$/.test(formData.phoneNumber)) {
      toast.error("Please enter a valid 10-digit phone number");
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;  // ❗ stop form if invalid

    dispatch(saveShippingInfo(formData));
    navigate("/order/confirm");
    // console.log("Shipping saved:", formData);
  };


  const countries = Country.getAllCountries();
  const states = State.getStatesOfCountry(formData.country);
  const cities = City.getCitiesOfState(formData.country, formData.state);


  return (
    <>
      <PageTitle title={"Shipping Info"} />
      <Navbar cartIconHide={true} />
      <CheckoutPath activePath={0} />

      <div className="shipping-form-container">
        <form className="shipping-form" onSubmit={handleSubmit}>
          <h1 className="shipping-form-header">Shipping Details</h1>

          <div className="sections">

            {/* LEFT SIDE */}
            <div className="shipping-section">

              {/* ADDRESS */}
              <div className="shipping-form-group">
                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  id="address"
                  placeholder="Enter Your Address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>

              {/* PINCODE */}
              <div className="shipping-form-group">
                <label htmlFor="pinCode">Pincode</label>
                <input
                  type="text"
                  id="pinCode"
                  placeholder="Enter Your Pincode"
                  value={formData.pinCode}
                  onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })}
                />
              </div>

              {/* PHONE */}
              <div className="shipping-form-group">
                <label htmlFor="phoneNumber">Phone Number</label>
                <input
                  type="text"
                  id="phoneNumber"
                  placeholder="Enter Your Phone Number"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                />
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="shipping-section">

              {/* COUNTRY */}
              <div className="shipping-form-group">
                <label htmlFor="country">Country</label>
                <select
                  id="country"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                >
                  <option value="">Select a Country</option>
                  {countries?.map((country) => (
                    <option key={country.isoCode} value={country.isoCode}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* STATE */}
              <div className="shipping-form-group">
                <label htmlFor="state">State</label>
                <select
                  id="state"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                >
                  <option value="">Select a State</option>
                  {states?.map((state) => (
                    <option key={state.isoCode} value={state.isoCode}>
                      {state.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* CITY */}
              <div className="shipping-form-group">
                <label htmlFor="city">City</label>
                <select
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                >
                  <option value="">Select a City</option>
                  {cities?.map((city) => (
                    <option key={city.name} value={city.name}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>

            </div>

          </div>

          <button type="submit" className="shipping-submit-btn">
            Continue
          </button>
        </form>
      </div>

      <Footer />
    </>
  );
}

export default Shipping;
