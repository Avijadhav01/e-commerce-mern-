import React, { useEffect, useState } from 'react'
import "./UserStyles/UserDashboard.css"
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../features/user/userSlice';
import { FaSun, FaMoon, FaUserCircle, } from "react-icons/fa";
import { MdOutlineShoppingBag, MdLogout, MdDashboard } from "react-icons/md";
import { setTheme } from '../features/theme';

function UserDashboard({ user }) {
  const { theme } = useSelector((state) => state.theme);

  useEffect(() => {
    document.body.className = theme === "dark" ? "dark-theme" : "";
  }, [theme]);

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

  const toggleTheme = () => {
    if (theme === "dark") {
      dispatch(setTheme("light"));
    } else {
      dispatch(setTheme("dark"));
    }
  }

  const options = [
    { name: "Orders", functionName: orders, icon: <MdOutlineShoppingBag /> },
    { name: "My Profile", functionName: profile, icon: <FaUserCircle /> },
    {
      name: `${theme === "dark" ? "Light Mode" : "Dark Mode"}`,
      functionName: toggleTheme,
      icon: theme === "dark" ? <FaSun /> : <FaMoon />
    },
    { name: "Logout", functionName: logout, icon: <MdLogout /> },
  ]

  if (user.role === 'admin') {
    options.unshift({
      name: "Admin Dashboard", functionName: dashbord, icon: <MdDashboard />
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
          <img
            src={`${user.avatar.url || "/profile.png"}`}
            alt="Profile Pic"
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
                  {option.icon}
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