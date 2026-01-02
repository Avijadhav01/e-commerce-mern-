import React from 'react'
import "./OrderStyles/MyOrders.css"
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from 'react';
import { clearOrderSuccess, removeErrors, getUserOrders } from '../features/order/orderSlice';
import { toast } from 'react-toastify';

import Loader from "../components/Loader.jsx"
import Navbar from "../components/Navbar.jsx"
import Footer from "../components/Footer.jsx"

import PageTitle from "../components/PageTitle.jsx"
import { Link, useNavigate } from 'react-router-dom';
import { MdLaunch } from "react-icons/md";
import Pagination from '../components/Pagination.jsx';

function MyOrders() {

  const {
    orders,
    error,
    loading,
    success,
    currPage,
    isNextPage,
    isPrevPage,
    totalPages
  } = useSelector(state => state.order)


  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getUserOrders({ page: 1, limit: 10 }));
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(removeErrors());
    }
  }, [error, dispatch]);


  const handlePageChange = (page) => {
    dispatch(getUserOrders({ page: page, limit: 10 }));
  }

  return (
    <>
      <Navbar cartIconHide />
      <PageTitle title="User Orders" />

      <div className="my-orders-container">
        <h1>My Orders</h1>

        <div className="table-responsive">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Items</th>
                <th>Status</th>
                <th>Total</th>
                <th>View</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5">
                    <Loader />
                  </td>
                </tr>
              ) : orders?.length > 0 ? (
                orders?.map(order => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{order.orderItems.length}</td>
                    <td>{order.orderStatus}</td>
                    <td>₹ {order.priceDetails.totalPrice}</td>
                    <td>
                      <Link to={`/orders/${order._id}`} className="order-check-link">
                        <MdLaunch fontSize={22} />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" >
                    <div className="no-orders">
                      No Orders Found
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currPage={currPage || 1}
          isNextPage={isNextPage}
          isPrevPage={isPrevPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </>
  )
}

export default MyOrders;