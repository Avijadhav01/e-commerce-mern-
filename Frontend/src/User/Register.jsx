import { useEffect, useState } from 'react';
import "./UserStyles/Form.css";
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { registerUser, removeErrors } from '../features/user/userSlice';
import { toast } from "react-toastify";

function Register() {

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "user",
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("/profile.png");
  const [errors, setErrors] = useState({});

  // VALIDATION
  const validate = () => {
    let newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.password.trim()) newErrors.password = "Password is required";
    if (!avatarFile) newErrors.avatar = "Avatar is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    const fd = new FormData();
    fd.append("fullName", formData.fullName);
    fd.append("email", formData.email);
    fd.append("password", formData.password);
    fd.append("role", formData.role);

    if (avatarFile) fd.append("avatar", avatarFile);

    dispatch(registerUser(fd)).then((res) => {
      if (res.type === "registerUser/fulfilled") {
        toast.success("Registration successful! Please login.");
        navigate("/login");
      }
    });
  };

  const { error, loading } = useSelector((state) => state.user)

  useEffect(() => {
    if (error) {
      // toast.error(error);
      dispatch(removeErrors());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (avatarFile) {
      const objectUrl = URL.createObjectURL(avatarFile);
      setAvatarPreview(objectUrl);

      return () => URL.revokeObjectURL(objectUrl); // cleanup previous URL
    } else {
      setAvatarPreview("/profile.png");
    }
  }, [avatarFile]);

  return (
    <div className='form-container container'>
      <div className="form-content">
        <form className="form" onSubmit={handleSubmit}>
          <h2>Sign Up</h2>

          {/* FULL NAME */}
          <div className="input-group">
            <input
              type="text"
              placeholder='Full Name'
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            />
            {errors.fullName && <p className="error-text">{errors.fullName}</p>}
          </div>

          {/* EMAIL */}
          <div className="input-group">
            <input
              type="email"
              placeholder='Email'
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>

          {/* PASSWORD */}
          <div className="input-group">
            <input
              type="password"
              placeholder='Password'
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            {errors.password && <p className="error-text">{errors.password}</p>}
          </div>

          {/* AVATAR */}
          <div className="input-group">
            <input
              type="file"
              accept="image/*"
              className='file-input'
              onChange={(e) => setAvatarFile(e.target.files[0])}
            />
            {errors.avatar && <p className="error-text">{errors.avatar}</p>}
          </div>

          {
            <div className="avatar-preview">
              <img src={avatarPreview} alt="preview" />
            </div>
          }

          {/* ROLE */}
          <div className="input-group">
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <option value="user">user</option>
              <option value="admin">admin</option>
            </select>
          </div>

          <div className="input-group">
            <button
              type="submit"
              disabled={loading}
              className={`login-btn ${loading ? "disabled" : ""}`}
            >
              {loading ? "Loading..." : "Register"}
            </button>

          </div>

          <p className='form-links'>
            Already have an account? <Link to="/login"> Sign in here</Link>
          </p>

        </form>
      </div>
    </div>
  );
}

export default Register;
