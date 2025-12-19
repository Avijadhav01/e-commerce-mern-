import React, { useEffect, useState } from 'react'
import "./UserStyles/Form.css"
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { removeErrors, updateProfile } from '../features/user/userSlice';
import { toast } from 'react-toastify';
import PageTitle from '../components/PageTitle';
import Navbar from '../components/Navbar';

function UpdateProfileForm() {

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("/profile.png");
  const { user, error, loading } = useSelector((state) => state.user)

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const fd = new FormData();
    if (formData.fullName) fd.append("fullName", formData.fullName);
    if (formData.email) fd.append("email", formData.email);
    if (formData.phone) fd.append("phone", formData.phone);
    if (avatarFile) fd.append("avatar", avatarFile);

    // for (let pair of fd.entries()) {
    //   console.log(pair[0], ":", pair[1]);
    // }

    dispatch(updateProfile(fd)).then((res) => {
      if (res.type === "updateProfile/fulfilled") {
        toast.success("Profile updated successfully !");
        navigate("/profile");
      }
    });
  };

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || ""
      });
    }
    if (error) {
      // toast.error(error); // uncomment if using toast
      dispatch(removeErrors());
    }
  }, [user, error, dispatch]);

  useEffect(() => {
    if (avatarFile) {
      const objectUrl = URL.createObjectURL(avatarFile);
      setAvatarPreview(objectUrl);

      return () => URL.revokeObjectURL(objectUrl); // cleanup previous URL
    } else {
      setAvatarPreview("/profile.png");
    }
  }, [avatarFile]);

  const isFormUnchanged = () => {
    return (
      user &&
      formData.fullName === (user.fullName || "") &&
      formData.email === (user.email || "") &&
      formData.phone === (user.phone || "") &&
      avatarFile === null // no new avatar selected
    );
  };


  return (
    <>
      <PageTitle title="Account - Details Update" />
      <Navbar />
      <div className='form-container container'>
        <div className="form-content">
          <form className="form" onSubmit={handleSubmit}>
            <h2>Edit Profile</h2>

            {/* FULL NAME */}
            <div className="input-group">
              <input
                type="text"
                placeholder='Full Name'
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>

            {/* EMAIL */}
            <div className="input-group">
              <input
                type="email"
                placeholder='Email'
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="input-group">
              <input
                type="text"
                placeholder='Phone Number'
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            {/* AVATAR */}
            <div className="input-group">
              <input
                type="file"
                accept="image/*"
                className='file-input'
                onChange={(e) => setAvatarFile(e.target.files[0])}
              />
            </div>

            {
              <div className="avatar-preview">
                <img src={avatarPreview} alt="preview" />
              </div>
            }

            <div className="input-group">
              <button
                type="submit"
                disabled={loading || isFormUnchanged()}
                className={`login-btn ${loading || isFormUnchanged() ? "disabled" : ""}`}
              >
                {loading ? "Loading..." : "Update"}
              </button>

            </div>

          </form>
        </div>
      </div>
    </>
  )
}

export default UpdateProfileForm;