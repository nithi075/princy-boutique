import React from "react";
import "./contact.css";
import { FiMapPin, FiPhone, FiMail, FiClock } from "react-icons/fi";
import heroImg from "../../assets/contact-hero.png"; 
// 👆 use the clean image without text

export default function Contact() {
  return (
    <div className="contact-page">

      {/* HERO WITH IMAGE */}
      <div 
        className="contact-hero"
        style={{ backgroundImage: `url(${heroImg})` }}
      >
        <div className="hero-overlay">
          <p className="contact-sub">GET IN TOUCH</p>
          <h1>Contact Us</h1>
          <p className="contact-desc">
             For enquiries and support, use the information below.
          </p>
        </div>
      </div>

      <div className="contact-container">
        {/* LEFT INFO */}
        <div className="contact-info">
          <h3>Contact Information</h3>

          <div className="info-item">
            <FiMapPin />
            <div>
              <h4>Our Boutique:</h4>
              <p>4F/23,Raja Colony, 1st Main Road,<br/>Collector Office Road,Cantoment,<br/>Tiruchirappalli-620017</p>
            </div>
          </div>

          <div className="info-item">
            <FiPhone />
            <div>
              <h4>Call Us:</h4>
              <p>+91 96002 21838 ,+91 97863 93214</p>
            </div>
          </div>

          <div className="info-item">
            <FiMail />
            <div>
              <h4>Email Us:</h4>
              <p>info@princyboutique.com</p>
            </div>
          </div>

          <div className="info-item">
            <FiClock />
            <div>
              <h4>Working Hours:</h4>
              <p>Mon - Sat: 10:00 AM - 8:00 PM<br/>Sunday: Closed</p>
            </div>
          </div>
        </div>

        {/* RIGHT FORM */}
      
      </div>

      {/* MAP */}
      <div className="map-section">
        <h3>Visit Our Store</h3>
        <div className="map-box">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d979.7756093070204!2d78.67623759999998!3d10.803465900000008!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3baaf56da4ebff41%3A0x87f2a4c2dbe7ffa0!2s23%2C%20First%20Main%20Rd%2C%20SBI%20Officers%20Colony%2C%20Raja%20Colony%2C%20Tiruchirappalli%2C%20Tamil%20Nadu%20620001!5e0!3m2!1sen!2sin!4v1771345103891!5m2!1sen!2sin"
            width="600"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>

        </div>
      </div>

    </div>
  );
}
