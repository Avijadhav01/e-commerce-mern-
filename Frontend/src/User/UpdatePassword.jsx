import React, { useEffect, useState } from 'react'
import "./UserStyles/Form.css";
import { useDispatch, useSelector } from 'react-redux';
import { removeErrors, updatePassword } from '../features/user/userSlice';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar";
import PageTitle from "../components/PageTitle";
import { toast } from 'react-toastify';

function UpdatePassword() {

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  })

  const { error, loading } = useSelector(state => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(updatePassword(formData)).then((res) => {
      if (res.type === "updatePassword/fulfilled") {
        toast.success("Password updated successful");
        navigate("/profile");
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
    <>
      <PageTitle title="Password - Update" />
      <Navbar />
      <div className='form-container container'>
        <div className="form-content">
          <form className="form" onSubmit={handleSubmit}>
            <h2>Update Password</h2>

            {/* Old PASSWORD */}
            <div className="input-group">
              <input
                type="password"
                placeholder='Old Password'
                value={formData.oldPassword}
                onChange={(e) => setFormData({ ...formData, oldPassword: e.target.value })}
              />
            </div>

            {/* New PASSWORD */}
            <div className="input-group">
              <input
                type="password"
                placeholder='New Password'
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
              />
            </div>

            {/* Confirm PASSWORD */}
            <div className="input-group">
              <input
                type="password"
                placeholder='Confirm Password'
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
            </div>

            <div className="input-group">
              <button
                type="submit"
                disabled={loading}
                className={`login-btn ${loading ? "disabled" : ""}`}>
                {loading ? "Loading..." : "Update Password"}
              </button>
            </div>

            <p className='form-links'>
              Forgot your password? <Link to="/password/forgot"> Forgot here</Link>
            </p>
          </form>
        </div>
      </div>
    </>
  )
}

export default UpdatePassword;