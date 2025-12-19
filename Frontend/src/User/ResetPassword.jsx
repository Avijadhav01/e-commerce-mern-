import React, { useEffect, useState } from 'react'
import "./UserStyles/Form.css"
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { removeErrors, resetPassword } from '../features/user/userSlice';
import { toast } from 'react-toastify';
import { useParams } from "react-router-dom";

function ResetPassword() {
  const { token } = useParams();  // <-- get param from URL

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: ""
  })

  const { successMessage, error, loading } = useSelector(state => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }


    dispatch(resetPassword({
      token,
      password: formData.password,
      confirmPassword: formData.confirmPassword
    })).then((res) => {
      if (res.type === "user/resetPassword/fulfilled") {
        toast.success(successMessage);
      }
    });
  }
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(removeErrors());
    }
  }, [error, dispatch])

  return (
    <>
      <div className='form-container container'>
        <div className="form-content">
          {
            successMessage ?
              (<p>Your password has been successfully reset.</p>) :
              (<form className="form" onSubmit={handleSubmit}>
                <h2>Reset Password</h2>

                {/* New PASSWORD */}
                <div className="input-group">
                  <input
                    type="password"
                    placeholder='Password'
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
                    {loading ? "Loading..." : "Reset Password"}
                  </button>
                </div>
              </form>)
          }
        </div>
      </div>
    </>
  )
}

export default ResetPassword;