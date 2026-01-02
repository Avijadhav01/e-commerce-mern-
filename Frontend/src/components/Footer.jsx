import React from "react";
import { FaEnvelope, FaPhoneAlt, FaTwitter, FaInstagram, FaLinkedin, FaGithub } from "react-icons/fa";
import "./componentStyles/Footer.css"

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Section 1: Contact */}
        <div className="footer-section contact">
          <h3 >Contact Us</h3>
          <div>
            <p >
              <FaPhoneAlt className="social-icon" /> +9699403305
            </p>
            <p >
              <FaEnvelope className="social-icon" /> avip3460@gmail.com
            </p>
          </div>
        </div>

        {/* Section 2: Social */}
        <div className="footer-section social">
          <h3 >Follow Me  </h3>
          <div className="social-links">
            <a href="#" >
              <FaGithub className="social-icon" />
            </a>
            <a href="#">
              <FaLinkedin className="social-icon" />
            </a>
            <a href="#" >
              <FaInstagram className="social-icon" />
            </a>
            <a href="#">
              <FaTwitter className="social-icon" />
            </a>
          </div>
        </div>
        {/* Section 3: About */}
        <div className="footer-section about">
          <h3 >About  </h3>
          <p >
            We are dedicated to bringing you the best online shopping experience with a wide range of quality products.
            Our mission is to make shopping easy, enjoyable, and trustworthy for everyone. Discover the latest trends, great deals, and exceptional customer service right at your fingertips.
          </p>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <p >&copy; 2025 Jadhav. All rights reserved</p>
      </div>
    </footer>

  );
}

export default Footer;
