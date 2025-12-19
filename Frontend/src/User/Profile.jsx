import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Loader from "../components/Loader"
import PageTitle from "../components/pageTitle";
import "./UserStyles/profile.css";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

const Profile = () => {

  const { user, loading, isAuthenticated } = useSelector(state => state.user)

  const navigate = useNavigate()
  useEffect(() => {
    if (isAuthenticated === false) {
      navigate("/login");
    }
  }, [isAuthenticated])

  return (
    <>
      <PageTitle title={"Profile - details"} />
      <Navbar />
      {
        loading ? <Loader /> :
          (<div className="profilt-container">
            <div className="profile-image-container">
              <h1 className="profile-heading">My Profile</h1>
              <img src={`${user?.avatar?.url}`}
                alt="user profile"
                className="avatar"
              />
              <Link to="/profile/update">Edit Profile</Link>
            </div>
            <div className="profile-details">
              <div className="profile-detail">
                <h2>Name :</h2>
                <p>{user?.fullName}</p>
              </div>
              <div className="profile-detail">
                <h2>Email :</h2>
                <p>{user?.email}</p>
              </div>
              <div className="profile-detail">
                <h2>Phone :</h2>
                <p>{user?.phone}</p>
              </div>
              <div className="profile-detail">
                <h2>Joined On :</h2>
                <p>{user?.createdAt ? String(user.createdAt).substring(0, 10) : "N/A"}</p>
              </div>
              <div className="profile-buttons">
                <Link to="/orders/user">My Orders</Link>
                <Link to="/password/update">Change Password</Link>
              </div>
            </div>

          </div>)
      }
      <Footer />
    </>
  );
};

export default Profile;
