import React, { useState } from 'react'
import "./componentStyles/Navbar.css"
import "../pages/pageStyles/Search.css"
import { Link, useNavigate, NavLink, useLocation } from "react-router-dom"
import {
  FaSearch,
  FaShoppingCart,
  FaUserPlus,
  FaBars,
  FaTimes
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux"
import { setSearchKeyword } from "../features/products/productSlice"

function Navbar({ search, cartIconHide }) {

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery) {
      dispatch(setSearchKeyword(searchQuery));
      if (location.pathname !== "/products") navigate("/products");
    }
  }

  const { isAuthenticated } = useSelector(state => state.user);
  const { cartItems } = useSelector(state => state.cart);

  return (
    <>
      <div className={`overlay ${isMenuOpen ? 'show' : ''}`} onClick={() => setIsMenuOpen(false)}></div>
      <nav className='navbar'>
        <div className="navbar-container">

          <div className="navbar-logo">
            <Link to="/" onClick={() => setIsMenuOpen(false)}>ShopEasy</Link>
          </div>

          < div className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
            <ul>
              <li>
                <NavLink to="/"
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/products"
                  className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                  Products
                </NavLink>
              </li>
              <li>
                <NavLink to="/about-us"
                  className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                  About Us
                </NavLink>
              </li>
              <li>
                <NavLink to="/contact-us"
                  className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                  Contact Us
                </NavLink>
              </li>
            </ul>
          </div>

          {search ?
            (<div className={`search-container `}>
              <form
                className={`search-form active`}
                onSubmit={handleSearchSubmit}>
                <input type="text"
                  className="search-input"
                  autoComplete="off"
                  placeholder='Search products..'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type='submit'
                  className='search-icon'>
                  <FaSearch focusable="false" />
                </button>
              </form>
            </div>) : null
          }

          <div className='navbar-icons'>

            {cartIconHide ? null
              : <Link to="/cart" className={`cartIconContainer ${cartItems.length > 0 ? "has-items" : ""}`}>
                <FaShoppingCart className='cart-icon' />
                <span className='cart-badge'>{cartItems?.length}</span>
              </Link>
            }

            {!isAuthenticated &&
              <Link to="/register" className='register-link'>
                <FaUserPlus className='icon' />
              </Link>
            }

            <div className='navbar-hamburger' onClick={toggleMenu}>
              {isMenuOpen ? <FaTimes className='icon' /> : <FaBars className='icon' />}
            </div>

          </div>

        </div>
      </nav >
    </>
  )
}

export default Navbar;