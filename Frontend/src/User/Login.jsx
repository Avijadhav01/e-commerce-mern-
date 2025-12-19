import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { logInUser, removeErrors } from '../features/user/userSlice';
import { toast } from "react-toastify";
import "./UserStyles/Form.css";
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';

function Login() {

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { isAuthenticated, error, loading } = useSelector((state) => state.user)

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const redirect = new URLSearchParams(location.search)
    .get("redirect") || "/"

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(logInUser(formData)).then((res) => {
      if (res.type === "logInUser/fulfilled") {
        toast.success("LogIn successful");
        navigate(redirect);
      }
    });
  }

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(removeErrors());
    }
  }, [error, dispatch]);

  return (
    <div className='form-container container'>
      <div className="form-content">
        <form className="form" onSubmit={handleSubmit}>
          <h2>SignIn</h2>

          {/* EMAIL */}
          <div className="input-group">
            <input
              type="email"
              placeholder='Enter email'
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          {/* PASSWORD */}
          <div className="input-group">
            <input
              type="password"
              placeholder='Enter password'
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <div className="input-group">
            <button
              type="submit"
              disabled={loading}
              className={`login-btn ${loading ? "disabled" : ""}`}>
              {loading ? "Loading..." : "Log In"}
            </button>
          </div>

          <p className='form-links'>
            Forgot your password? <Link to="/password/forgot"> Forgot here</Link>
          </p>

          <p className='form-links'>
            Not have an account? <Link to="/register"> SignUp here</Link>
          </p>

        </form>
      </div>
    </div>
  )
}

export default Login;