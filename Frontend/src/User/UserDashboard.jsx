import React, { useState } from 'react'
import "./UserStyles/UserDashboard.css"
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../features/user/userSlice';

function UserDashboard({ user }) {

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function orders() {
    navigate("/orders/user");
  }

  function profile() {
    navigate("/profile");
  }

  function logout() {
    dispatch(logoutUser()).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        toast.success("Logged Out Successfully !");
        navigate("/login");
      } else {
        toast.error("Logout failed!");
      }
    });
  }

  function dashbord() {
    navigate("/admin/dashboard")
  }

  const options = [
    { name: "Orders", functionName: orders },
    { name: "Account", functionName: profile },
    { name: "Logout", functionName: logout },
  ]

  if (user.role === 'admin') {
    options.unshift({
      name: "Admin Dashboard", functionName: dashbord
    })
  }

  const toggleMenuOpen = () => {
    setIsMenuOpen(!isMenuOpen);
  }

  return (
    <>
      <div className={`overlay ${isMenuOpen ? 'show' : ''}`} onClick={toggleMenuOpen}></div>
      <div className="dashbord-container">
        <div className="profile-header">
          <img src={`${user.avatar.url || "/profile.png"}`} alt="Profilt Pic"
            className='profile-avatar'
            onClick={toggleMenuOpen} />
        </div>
        <div className={`menu-options ${isMenuOpen ? 'active' : ''}`}>
          {
            options.map((option, idx) => (
              <div onClick={toggleMenuOpen} key={idx}>
                <button
                  className='menu-option-btn'
                  onClick={option.functionName}
                >
                  {option.name}
                </button>
              </div>
            ))
          }
        </div>
      </div>
    </>
  )
}

export default UserDashboard;