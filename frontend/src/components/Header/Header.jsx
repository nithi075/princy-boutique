import "./Header.css";
import {
  FiShoppingBag,
  FiMenu,
  FiX,
  FiHeart,
  FiUser,
  FiArrowRight,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import API from "../../api/axios";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [phone, setPhone] = useState("");

  const navigate = useNavigate();
  const { user, login, logout } = useContext(AuthContext);

  // ================= PHONE LOGIN =================
  const handlePhoneLogin = async () => {
    if (!/^[6-9]\d{9}$/.test(phone)) {
      alert("Enter valid 10 digit mobile number");
      return;
    }

    try {
      const res = await API.post("/auth/phone-login", { phone });

      // 🔥 Save FULL response (token + user)
      login(res.data);

      setOpen(false);
      setLoginOpen(false);
      setPhone("");

      navigate("/");
    } catch (err) {
      console.log(err.response?.data || err.message);
      alert("Login failed");
    }
  };

  // ================= LOGOUT =================
  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/");
  };

  return (
    <>
      {/* ================= HEADER ================= */}
      <header className="lux-header">
        <div className="lux-left">
          <div className="lux-menu" onClick={() => setOpen(true)}>
            <FiMenu />
          </div>
        </div>

        <div className="lux-logo" onClick={() => navigate("/")}>
          Princy Fashion Boutique
        </div>

        <div className="lux-icons">
          <FiHeart onClick={() => navigate("/wishlist")} />

       

          <FiShoppingBag onClick={() => navigate("/cart")} />
        </div>
      </header>

      {/* ================= OVERLAY ================= */}
      {open && (
        <div
          className="lux-overlay"
          onClick={() => {
            setOpen(false);
            setShopOpen(false);
            setLoginOpen(false);
          }}
        />
      )}

      {/* ================= DRAWER ================= */}
      <div className={`lux-drawer ${open ? "open" : ""}`}>
        <FiX className="lux-close" onClick={() => setOpen(false)} />

        <div
          className="lux-item"
          onClick={() => {
            navigate("/");
            setOpen(false);
          }}
        >
          Home
        </div>

        {/* SHOP */}
        <div
          className="lux-item arrow"
          onClick={() => {
            navigate("/shop");
            setOpen(false);
          }}
        >
          <span>Shop</span>

          <FiArrowRight
            className={`arrow-icon ${shopOpen ? "rotate" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              setShopOpen(!shopOpen);
            }}
          />
        </div>

       {/* UPDATED CATEGORY LIST */} {shopOpen && ( <div className="lux-category-dropdown"> <div className="lux-sub-item" onClick={() => { navigate("/shop?category=Saree"); setOpen(false); }}> Sarees </div> <div className="lux-sub-item" onClick={() => { navigate("/shop?category=Kurti"); setOpen(false); }}> Kurtis </div> <div className="lux-sub-item" onClick={() => { navigate("/shop?category=Gown"); setOpen(false); }}> Gowns </div> <div className="lux-sub-item" onClick={() => { navigate("/shop?category=Night Dress"); setOpen(false); }}> Night Dress </div> <div className="lux-sub-item" onClick={() => { navigate("/shop?category=Nighty"); setOpen(false); }}> Nighty </div> </div> )}

        {/* CONTACT */}
        <div
          className="lux-item"
          onClick={() => {
            navigate("/contact");
            setOpen(false);
          }}
        >
          Contact Us
        </div>

        {/* ================= LOGIN SECTION ================= */}
        {!user && (
          <>
            <div
              className="lux-item arrow"
              onClick={() => setLoginOpen(!loginOpen)}
            >
              <span>Login</span>
              <FiArrowRight
                className={`arrow-icon ${loginOpen ? "rotate" : ""}`}
              />
            </div>

            {loginOpen && (
              <div className="lux-login-dropdown">
                <input
                  type="tel"
                  maxLength="10"
                  placeholder="Enter mobile number"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value.replace(/\D/g, ""))
                  }
                  className="lux-phone-input"
                />

                <button className="lux-login-btn" onClick={handlePhoneLogin}>
                  Continue
                </button>
              </div>
            )}
          </>
        )}

        {/* ================= LOGOUT ================= */}
        {user && (
          <div className="lux-item" onClick={handleLogout}>
            Logout
          </div>
        )}
      </div>
    </>
  );
}
