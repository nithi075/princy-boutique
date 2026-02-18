import "./Footer.css";
import { FiInstagram, FiFacebook, FiTwitter } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">

      {/* TOP SECTION */}
      <div className="footer-top">

        {/* BRAND */}
        <div className="footer-col">
          <h3 className="footer-logo">Princy Boutique</h3>
          <p>
            Timeless elegance crafted with love.
            Discover premium ethnic wear designed
            for modern women.
          </p>
        </div>

        {/* QUICK LINKS */}
        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/new-arrivals">New Arrivals</Link></li>
            <li><Link to="/admin/add-product">Collections</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        {/* PHONE LOGIN / SUBSCRIBE */}
        <div className="footer-col">
          <h4>Stay Connected</h4>
          <p>Login with your phone for exclusive updates</p>

          <div className="phone-box">
            <span className="country">+91</span>
            <input type="tel" placeholder="Enter phone number" />
          </div>

          <button className="footer-btn">Continue</button>

          {/* SOCIAL */}
          <div className="social-icons">
            <FiInstagram />
            <FiFacebook />
            <FiTwitter />
          </div>
        </div>

      </div>

      {/* BOTTOM */}
      <div className="footer-bottom">
        © 2026 Princy Boutique. All Rights Reserved.
      </div>

    </footer>
  );
}
