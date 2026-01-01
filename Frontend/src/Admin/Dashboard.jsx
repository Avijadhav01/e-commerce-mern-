import React, { useEffect, useState } from "react";
import "./AdminStyles/Dashboard.css";

import { MdDashboard } from "react-icons/md";
import {
  FaBoxes,
  FaPlusSquare,
  FaUsers,
  FaShoppingBag,
  FaStar,
  FaRupeeSign,
  FaTimesCircle,
  FaCheckCircle,
  FaBars,
  FaTimes
} from "react-icons/fa";

import PageTitle from "../components/pageTitle"
import Navbar from "../components/Navbar";

import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminProducts, fetchOrders, fetchUsers } from "../features/Admin/adminSlice";

function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const dispatch = useDispatch();

  const { products, orders, users } = useSelector((state) => state.admin);


  useEffect(() => {
    dispatch(fetchAdminProducts());
    dispatch(fetchOrders());
    dispatch(fetchUsers());
  }, [])


  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const [totalRevenue, setTotalRevenue] = useState(0);
  const [inStock, setInStock] = useState(0);
  const [outOfStock, setOutOfStock] = useState(0);

  useEffect(() => {
    if (orders && Array.isArray(orders)) {
      const revenue = orders.reduce((acc, order) => {
        return acc + (order?.priceDetails?.totalPrice || 0);
      }, 0);

      const revenueTwoDecimals = revenue.toFixed(2);
      setTotalRevenue(revenueTwoDecimals);
    }

    if (products && Array.isArray(products)) {
      const inStockCount = products.filter((product) => product.stock !== 0).length;
      setInStock(inStockCount);

      const outOfStockCount = products.filter((product) => product.stock === 0).length;
      setOutOfStock(outOfStockCount);
    }
  }, [orders, products]);



  return (
    <>
      <PageTitle title="Admin Dashboard" />
      <Navbar cartIconHide={true} />

      {/* Overlay (mobile only) */}
      <div
        className={`dashboard-overlay ${isSidebarOpen ? "show" : ""}`}
        onClick={toggleSidebar}
      />

      {/* Toggle Button (Mobile only) */}
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        {isSidebarOpen ? <FaTimes /> : <FaBars />}
      </button>

      <div className={`dashboard-container `}>

        {/* ===== Sidebar ===== */}
        <aside className={`${isSidebarOpen ? "active" : ""} sidebar`}>
          <div className="logo">
            <MdDashboard className="logo-icon" />
            Admin Dashboard
          </div>

          <nav className="nav-menu">
            {/* Products */}
            <div className="nav-section">
              <h3>Products</h3>

              <NavLink to="/admin/products">
                <FaBoxes className="nav-icon" />
                All Products
              </NavLink>

              <NavLink to="/admin/product/create">
                <FaPlusSquare className="nav-icon" />
                Create Product
              </NavLink>
            </div>

            {/* Users */}
            <div className="nav-section">
              <h3>Users</h3>

              <NavLink to="/admin/users">
                <FaUsers className="nav-icon" />
                All Users
              </NavLink>
            </div>

            {/* Orders */}
            <div className="nav-section">
              <h3>Orders</h3>

              <NavLink to="/admin/orders">
                <FaShoppingBag className="nav-icon" />
                All Orders
              </NavLink>
            </div>

            {/* Reviews */}
            <div className="nav-section">
              <h3>Reviews</h3>

              <NavLink to="/admin/reviews">
                <FaStar className="nav-icon" />
                All Reviews
              </NavLink>
            </div>
          </nav>
        </aside>

        {/* ===== Main Content ===== */}
        <main className="main-content">
          <div className="stats-grid">
            <div className="stat-box">
              <FaBoxes className="icon" />
              <h3>Total Products</h3>
              <p>{products?.length}</p>
            </div>

            <div className="stat-box">
              <FaShoppingBag className="icon" />
              <h3>Total Orders</h3>
              <p>{orders?.length}</p>
            </div>

            <div className="stat-box">
              <FaUsers className="icon" />
              <h3>Total Users</h3>
              <p>{users?.length}</p>
            </div>

            <div className="stat-box">
              <FaRupeeSign className="icon" />
              <h3>Total Revenue</h3>
              <p>₹{totalRevenue}</p>
            </div>

            <div className="stat-box">
              <FaTimesCircle className="icon" />
              <h3>Out Of Stock</h3>
              <p>{outOfStock}</p>
            </div>

            <div className="stat-box">
              <FaCheckCircle className="icon" />
              <h3>In Stock</h3>
              <p>{inStock}</p>
            </div>
          </div>
        </main>

      </div>
    </>
  );
}

export default Dashboard;
