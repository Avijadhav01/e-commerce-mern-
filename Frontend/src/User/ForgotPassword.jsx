import React, { useEffect, useState } from 'react'
import "./UserStyles/Form.css"
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PageTitle from '../components/PageTitle';
import { forgotPassword, removeErrors } from '../features/user/userSlice';
import { toast } from 'react-toastify';

function ForgotPassword() {

  const [email, setEmail] = useState("");
  const { successMessage, error, loading } = useSelector(state => state.user);

  // console.log(successMessage, error, loading);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (email) {
      dispatch(forgotPassword({ email })).then((res) => {
        if (res.type === "user/forgotPassword/fulfilled") {
          toast.success(successMessage);
          navigate("/profile");
        }
      })
    }
  }

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(removeErrors());
    }
  }, [error, dispatch])

  return (
    <>
      <PageTitle />
      <Navbar />
      <div className='form-container container'>
        <div className="form-content ">
          <form className="form" onSubmit={handleSubmit}>
            <h2>Forgot Password</h2>

            <div className="input-group">
              <input
                type="email"
                placeholder='Email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="input-group">
              <button
                type="submit"
                disabled={loading}
                className={`login-btn ${loading ? "disabled" : ""}`}>
                {loading ? "Loading..." : "Continue"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </>
  )
}

export default ForgotPassword