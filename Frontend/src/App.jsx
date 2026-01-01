import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { loadUser } from "./features/user/userSlice.js";

import ProtectedRoute from "./utils/ProtectedRoute.jsx";
import PublicRoute from "./utils/PublicRoute.jsx"

import Home from "./pages/Home.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import Products from "./pages/Products.jsx";
import Register from "./User/Register.jsx";
import Login from "./User/Login.jsx";
import Profile from "./User/Profile.jsx";
import UpdateProfileForm from "./User/UpdateProfileForm.jsx";
import UpdatePassword from "./User/UpdatePassword.jsx";
import ForgotPassword from "./User/ForgotPassword.jsx";
import ResetPassword from "./User/ResetPassword.jsx";
import UserDashboard from "./User/userDashboard.jsx";
import Cart from "./Cart/Cart.jsx";
import Shipping from "./Cart/Shipping.jsx";
import OrderConfirm from "./Cart/OrderConfirm.jsx";
import Payment from "./Cart/Payment.jsx";
import PaymentSuccess from "./Cart/PaymentSuccess.jsx";
import MyOrders from "./Order/MyOrders.jsx";
import OrderDetails from "./Order/OrderDetails.jsx";
import Dashboard from "./Admin/Dashboard.jsx";
import ProductList from "./Admin/ProductList.jsx";
import OrdersList from "./Admin/OrdersList.jsx";
import CreateProduct from "./Admin/CreateProduct.jsx";
import UpdateProduct from "./Admin/UpdateProduct.jsx";
import UsersList from "./Admin/UsersList.jsx";
import UpdateOrder from "./Admin/UpdateOrder.jsx";
import ReviewList from "./Admin/ReviewList.jsx";

function App() {

  const { user, isAuthenticated, loading } = useSelector((state) => state.user)
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch])

  // console.log(user, isAuthenticated);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />

          <Route path="/register" element={<PublicRoute element={<Register />} />} />
          <Route path="/login" element={<PublicRoute element={<Login />} />} />

          {/* Protected Routes */}
          <Route
            path="/profile"
            element={<ProtectedRoute element={<Profile />} />}
          />

          <Route
            path="/profile/update"
            element={<ProtectedRoute element={<UpdateProfileForm />} />}
          />

          <Route
            path="/password/update"
            element={<ProtectedRoute element={<UpdatePassword />} />}
          />

          <Route path="/password/forgot" element={<ForgotPassword />} />
          <Route path="/password/reset/:token" element={<ResetPassword />} />

          <Route path="/cart" element={<Cart />} />
          <Route
            path="/shipping"
            element={<ProtectedRoute element={<Shipping />} />}
          />

          <Route
            path="/order/confirm"
            element={<ProtectedRoute element={<OrderConfirm />} />}
          />

          <Route
            path="/order/payment"
            element={<ProtectedRoute element={<Payment />} />}
          />

          <Route
            path="/payment-success"
            element={<ProtectedRoute element={<PaymentSuccess />} />}
          />

          <Route
            path="/orders/user"
            element={<ProtectedRoute element={<MyOrders />} />}
          />

          <Route
            path="/orders/:orderId"
            element={<ProtectedRoute element={<OrderDetails />} />}
          />

          <Route
            path="/admin/dashboard"
            element={<ProtectedRoute element={<Dashboard />} adminOnly={true} />}
          />

          <Route
            path="/admin/products"
            element={<ProtectedRoute element={<ProductList />} adminOnly={true} />}
          />

          <Route
            path="/admin/product/create"
            element={<ProtectedRoute element={<CreateProduct />} adminOnly={true} />}
          />

          <Route
            path="/admin/product/:productId"
            element={<ProtectedRoute element={<UpdateProduct />} adminOnly={true} />}
          />

          <Route
            path="/admin/orders"
            element={<ProtectedRoute element={<OrdersList />} adminOnly={true} />}
          />

          <Route
            path="/admin/orders/:orderId"
            element={<ProtectedRoute element={<UpdateOrder />} adminOnly={true} />}
          />

          <Route
            path="/admin/users"
            element={<ProtectedRoute element={<UsersList />} adminOnly={true} />}
          />

          <Route
            path="/admin/reviews"
            element={<ProtectedRoute element={<ReviewList />} adminOnly={true} />}
          />

        </Routes>
        {/* Sidebar only for logged-in user */}
        {isAuthenticated && <UserDashboard user={user} />}
      </Router>
    </>
  )
}

export default App
