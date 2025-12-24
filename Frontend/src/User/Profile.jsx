import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import PageTitle from "../components/pageTitle";

import "./UserStyles/profile.css";

const Profile = () => {
  const { user, loading, isAuthenticated } = useSelector(
    (state) => state.user
  );

  const navigate = useNavigate();
  const [showImagePreview, setShowImagePreview] = useState(false);

  useEffect(() => {
    if (isAuthenticated === false) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  return (
    <>
      <PageTitle title="Profile - Details" />
      <Navbar />

      {loading ? (
        <Loader />
      ) : (
        <div className="profilt-container">
          <div className="profile-image-container">
            <h1 className="profile-heading">My Profile</h1>

            {/* Profile Image */}
            <img
              src={user?.avatar?.url}
              alt="user profile"
              className="avatar"
              onClick={() => setShowImagePreview(true)}
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
              <p>
                {user?.createdAt
                  ? String(user.createdAt).substring(0, 10)
                  : "N/A"}
              </p>
            </div>

            <div className="profile-buttons">
              <Link to="/orders/user">My Orders</Link>
              <Link to="/password/update">Change Password</Link>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Overlay */}
      {showImagePreview && (
        <div className="image-preview-overlay" onClick={() => setShowImagePreview(false)}>
          <div
            className="image-preview-container"
            onClick={(e) => e.stopPropagation()}>
            {/* <button
              className="close-preview-btn"
              onClick={() => setShowImagePreview(false)}>
              ✕
            </button> */}
            <img
              src={user?.avatar?.url}
              alt="Full profile"
              className="full-profile-image"
            />
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default Profile;
