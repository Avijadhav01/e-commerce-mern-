import React, { useEffect, useState } from 'react'
import "./AdminStyles/OrdersList.css"
import { useDispatch, useSelector } from "react-redux"
import { clearAdminSuccess, deleteOrder, fetchOrders, removeAdminErrors, updateOrderStatus } from '../features/Admin/adminSlice'

import { FaPen, FaTrash } from "react-icons/fa";
import Navbar from "../components/Navbar"
import PageTitle from "../components/PageTitle"
import Loader from "../components/Loader"

import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

function OrdersList() {
  const dispatch = useDispatch()
  const { orders, error, loading, success, message } = useSelector(state => state.admin);

  useEffect(() => {
    if (success) {
      toast.success(message);
      dispatch(fetchOrders());
      dispatch(clearAdminSuccess());
    }
  }, [success, message, dispatch])

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch])

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(removeAdminErrors());
    }
  }, [error, dispatch])

  const handleDelete = (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      dispatch(deleteOrder(orderId));
    }
  };

  return (
    <>
      <Navbar cartIconHide={true} />
      <PageTitle title={"All Orders"} />
      <div className="ordersList-container">
        {

          (orders && orders.length === 0) ? (<div className='no-orders-container'>
            Orders not found!
          </div>) :
            (
              <>
                <h1 className="ordersList-title">All Orders</h1>
                <div className="ordersList-table-container">
                  <table className="ordersList-table">
                    <thead>
                      <tr>
                        <th>SN</th>
                        <th>Order ID</th>
                        <th>Total Items</th>
                        <th>Total Price</th>
                        <th>Payment Status</th>
                        <th>Order Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        orders?.map((order, idx) => (
                          <tr key={order?._id}>
                            <td>{idx + 1}</td>
                            <td>{order?._id}</td>
                            <td>{order?.orderItems.length}</td>
                            <td>
                              ₹{order?.priceDetails.totalPrice.toLocaleString("en-IN")}
                            </td>
                            <td
                              className={`payment-status ${order?.paymentInfo.status}`}>
                              {order?.paymentInfo.status}
                            </td>
                            <td
                              className={`order-status ${order?.orderStatus.toLocaleLowerCase()}`}>
                              {order?.orderStatus}
                            </td>
                            <td>
                              <Link to={`/admin/orders/${order?._id}`} className='action-icon'>
                                <FaPen className='edit-icon' />
                              </Link>
                              <button
                                className="action-icon"
                                onClick={() => handleDelete(order?._id)}>
                                <FaTrash className='delete-icon' />
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </>
            )
        }
      </div>
    </>
  )
}

export default OrdersList;