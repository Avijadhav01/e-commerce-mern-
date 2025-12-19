import React from "react";
import { Mail, Phone } from "lucide-react";
import { FaTwitter, FaInstagram, FaLinkedin, FaGithub } from "react-icons/fa";
import "./componentStyles/Footer.css"

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Section 1: Contact */}
        <div className="footer-section contact">
          <h3 >Contact Us</h3>
          <p >
            <Phone /> +9699403305
          </p>
          <p >
            <Mail /> avip3460@gmail.com
          </p>
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
            Providing web development tutorials and courses to help you grow your skills.
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
