import React, { useEffect } from 'react'
import "./OrderStyles/OrderDetails.css"
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux"
import { getSingleOrder, removeErrors } from '../features/order/orderSlice';
import { toast } from "react-toastify"

import PageTitle from "../components/PageTitle"
import Navbar from "../components/Navbar"

function OrderDetails() {
  const { orderId } = useParams();

  const { order, error, loading } = useSelector(state => state.order);

  const formatDateOnly = (isoDate) => {
    return new Date(isoDate).toISOString().slice(0, 10);
  };


  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getSingleOrder(orderId));
  }, [orderId])

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(removeErrors());
    }
  }, [error, dispatch])

  return (
    <>
      <PageTitle title={`${orderId}`} />
      <Navbar cartIconHide={true} />
      <div className='order-box'>
        <h1 className='order-detail-title'>Order Details</h1>
        {/* Order Items Table */}
        <div className='table-block'>
          <h2 className='table-title'>Order Items</h2>
          <table className='table-main'>
            <thead className='table-head'>
              <tr>
                <th className="head-cell">Image</th>
                <th className="head-cell">Name</th>
                <th className="head-cell">Quantity</th>
                <th className="head-cell">Price</th>
              </tr>
            </thead>
            <tbody>
              {
                order?.orderItems?.map((item, idx) => (
                  <tr className='table-row' key={idx}>
                    <td className="table-cell">
                      <img src={item?.avatar} alt="Product" className='item-img' />
                    </td>
                    <td className="table-cell">{item?.name}</td>
                    <td className="table-cell">{item?.quantity}</td>
                    <td className="table-cell">₹ {item?.price}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>

        {/* Shipping Info Table */}
        <div className="table-block">
          <h2 className="table-title">Shipping Info</h2>
          <table className="table-main">
            <tbody>
              <tr className="table-row">
                <th className='table-cell'>Address : </th>
                <td className='table-cell'>
                  {`${order?.shippingAddress?.street || ""}, ${order?.shippingAddress?.city || ""}, ${order?.shippingAddress?.state || ""}, ${order?.shippingAddress?.country || ""} - ${order?.shippingAddress?.postalCode || ""}`}
                </td>
              </tr>
              <tr className="table-row">
                <th className='table-cell'>Phone : </th>
                <td className='table-cell'>{order?.shippingAddress?.phone}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Order Summary */}
        <div className="table-block">
          <h2 className="table-title">Order Summary</h2>
          <table className='table-main'>
            <tbody>
              <tr className="table-row">
                <th className="table-cell">Order Status</th>
                <td className="table-cell">
                  <span className={`status-tag ${order?.orderStatus}`}>
                    {order?.orderStatus}
                  </span>
                </td>
              </tr>
              <tr className="table-row">
                <th className="table-cell">Payment</th>
                <td className="table-cell">
                  <span className={`status-tag ${order?.isPaid ? "paid" : "not-paid"}`}>
                    {order?.isPaid ? "Paid" : "Not Paid"}
                  </span>
                </td>
              </tr>
              <tr className="table-row">
                <th className="table-cell">Paid At</th>
                <td className="table-cell">
                  {order?.paidAt ? formatDateOnly(order.paidAt) : "-"}
                </td>
              </tr>
              <tr className="table-row">
                <th className="table-cell">Items Price</th>
                <td className="table-cell">{order?.priceDetails?.itemsPrice} /-
                </td>
              </tr>
              <tr className="table-row">
                <th className="table-cell">Tax Price</th>
                <td className="table-cell">{order?.priceDetails?.taxPrice} /-
                </td>
              </tr>
              <tr className="table-row">
                <th className="table-cell">Shipping Price</th>
                <td className="table-cell">
                  {order?.priceDetails?.shippingPrice == 0 ?
                    <div className={`${order?.priceDetails?.shippingPrice == 0 ? "green" : ""}`}>Free Delivery</div>
                    : `${order?.priceDetails?.shippingPrice} /-`}
                </td>
              </tr>
              <tr className="table-row">
                <th className="table-cell">Total Price</th>
                <td className="table-cell">{order?.priceDetails?.totalPrice} /-
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </>
  )
}

export default OrderDetails;