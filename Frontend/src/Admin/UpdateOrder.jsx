import React, { useEffect, useState } from 'react'
import "./AdminStyles/UpdateOrder.css"
import Navbar from "../components/Navbar"
import PageTitle from "../components/PageTitle"
import { useDispatch, useSelector } from 'react-redux'
import { clearAdminSuccess, fetchOrder, removeAdminErrors, updateOrderStatus } from '../features/Admin/adminSlice'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'


function UpdateOrder() {
  const { orderId } = useParams();
  // console.log(orderId);
  const array = [
    "Pending",
    "Processing",
    "Packed",
    "Shipped",
    "Delivered",
    "Cancelled",
    "Refunded",
  ]

  const [selectedStatus, setSelectedStatus] = useState("");

  const { order, success, error, message } = useSelector(state => state.admin);
  const dispatch = useDispatch();

  useEffect(() => {
    if (orderId) {
      dispatch(fetchOrder(orderId));
    }
  }, [dispatch, orderId])

  useEffect(() => {
    if (success) {
      toast.success(message);
      dispatch(clearAdminSuccess());
    }
  }, [success, message, dispatch])

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(removeAdminErrors());
    }
  }, [dispatch, error])

  const handleOnClick = () => {
    if (!selectedStatus) {
      toast.warning("Please select order status");
      return;
    }
    dispatch(updateOrderStatus({ orderStatus: selectedStatus, orderId }));
  }

  return (
    <>
      <Navbar cartIconHide={true} />
      <PageTitle title={"Update Order"} />
      <div className="order-container">
        <h1 className="order-title">Update Order</h1>
        <div className="order-details">
          <h2>Order Information</h2>
          <p><strong>Order ID: </strong>{order?._id}</p>
          <p><strong>Shipping Address: </strong>
            {`${order?.shippingAddress?.street || ""}, ${order?.shippingAddress?.city || ""}, ${order?.shippingAddress?.state || ""}, ${order?.shippingAddress?.country || ""} - ${order?.shippingAddress?.postalCode || ""}`}
          </p>
          <p><strong>Phone: </strong>{order?.shippingAddress?.phone}</p>
          <p>
            <strong>Order Status: </strong>
            {order?.orderStatus
              ? order.orderStatus.charAt(0).toUpperCase() +
              order.orderStatus.slice(1)
              : ""}
          </p>
          <p>
            <strong>Payment Status: </strong>
            {order?.paymentInfo?.status
              ? order.paymentInfo.status.charAt(0).toUpperCase() +
              order.paymentInfo.status.slice(1)
              : ""}
          </p>
          <p><strong>Total Price: </strong>{order?.priceDetails?.totalPrice}</p>
        </div>
        <div className="order-items">
          <h2>Order Items</h2>
          <table className="order-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Quantity</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {
                order?.orderItems.map((item, idx) => (
                  <tr key={item._id || idx}>
                    <td>
                      <img className='order-item-image '
                        src={item?.avatar} alt={item?.name} />
                    </td>
                    <td>{item?.name}</td>
                    <td>{item?.quantity}</td>
                    <td>₹{item?.price}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
        <div className="order-status">
          <h2>Update Status</h2>
          <select className="status-select"
            value={selectedStatus || order?.orderStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}>
            {
              array.map((status) => (
                <option value={status} key={status}>{status}</option>
              ))
            }
          </select>
          <button
            onClick={handleOnClick}
            className='update-button'>
            update Status
          </button>
        </div>
      </div>
    </>
  )
}

export default UpdateOrder