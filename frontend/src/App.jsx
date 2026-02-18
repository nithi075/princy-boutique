import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import WhatsAppFloat from "./components/WhatsAppFloat/WhatsAppFloat";

/* PAGES */
import Home from "./pages/Home/Home";
import Product from "./pages/Product/Product";
import ProductDetails from "./pages/productDetails/productDetails";
import Cart from "./pages/Cart/Cart";
import Wishlist from "./pages/whishlist/whishlist";
import Contact from "./pages/contact/contact";
import Checkout from "./pages/Checkout/Checkout";

/* ADMIN */
import AddProduct from "./pages/Admin/AddProduct";
import Admin from "./pages/Admin/Admin";


/* ================= LAYOUT CONTROLLER ================= */
function Layout() {
  const location = useLocation();

  // if URL starts with /admin hide public layout
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <>
      {/* HEADER */}
      {!isAdmin && <Header />}

      {/* MAIN CONTENT */}
      <main className="main-content">
        <Routes>

          {/* ================= USER ROUTES ================= */}
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Product />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/checkout" element={<Checkout />} />

          {/* ================= ADMIN ROUTES ================= */}
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/add-product" element={<AddProduct />} />

        </Routes>
      </main>

      {/* FOOTER */}
      {!isAdmin && <Footer />}

      {/* FLOAT BUTTON */}
      {!isAdmin && <WhatsAppFloat />}
    </>
  );
}

/* ================= APP ROOT ================= */
function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;
