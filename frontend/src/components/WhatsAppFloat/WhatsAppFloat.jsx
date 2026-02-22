import React from "react";
import "./WhatsAppFloat.css";
import { FaWhatsapp } from "react-icons/fa";

export default function WhatsAppFloat() {

  const phoneNumber = "919786393214";  // ✅ Updated number (with country code 91)
  const message = "Hi Princy Boutique, I would like to know more about your collections.";

  const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float"
    >
      <FaWhatsapp />
    </a>
  );
}
