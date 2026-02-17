import { useState } from "react";
import API from "../../api/axios";
import "./addProduct.css";

export default function AddProduct() {

  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    description: "",   // ⭐ NEW
    fabric: "",
    work: "",
    occasion: "",
    fit: "",
    readyMade: false,
    featured: false,
  });

  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState([]);

  /* OPTIONS */
  const categories = ["Saree","Kurti","Gown","Night Dress","Nighty"];
  const fabrics = ["Cotton","Silk","Rayon"];
  const works = ["Printed","Embroidered","Minimal","Plain"];
  const occasions = ["Daily Wear","Casual Wear","Festive Wear","Party Wear","Wedding Wear"];
  const fits = ["Straight Fit","A-Line","Flared","Anarkali","Nayra Cut","Regular Fit","Loose Fit"];

  const colorOptions = [
    "Red","Maroon","Pink","Blue","Green","Yellow",
    "Black","White","Gold","Silver","Purple","Orange"
  ];

  /* INPUT CHANGE */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));

    if (name === "category") {
      if (value === "Saree") setSizes(["Free"]);
      else setSizes([]);
    }
  };

  /* SIZE */
  const toggleSize = (size) => {
    setSizes(prev =>
      prev.includes(size)
        ? prev.filter(s => s !== size)
        : [...prev, size]
    );
  };

  /* COLOR */
  const toggleColor = (color) => {
    setColors(prev =>
      prev.includes(color)
        ? prev.filter(c => c !== color)
        : [...prev, color]
    );
  };

  /* IMAGE */
  const handleImages = (e) => {
    const files = Array.from(e.target.files);

    if (files.length + images.length > 5) {
      alert("Max 5 images only");
      return;
    }

    setImages(prev => [...prev, ...files]);
    setPreview(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
  };

  const removeImage = (i) => {
    setImages(prev => prev.filter((_, index)=> index !== i));
    setPreview(prev => prev.filter((_, index)=> index !== i));
  };

  /* SUBMIT */
  const submitProduct = async (e) => {
    e.preventDefault();

    if (form.category !== "Saree" && sizes.length === 0) {
      alert("Please select at least one size");
      return;
    }

    if (colors.length === 0) {
      alert("Select at least one color");
      return;
    }

    const formData = new FormData();

    Object.keys(form).forEach(key => {
      formData.append(key, form[key]);   // description included automatically
    });

    formData.append("sizes", JSON.stringify(sizes));
    formData.append("colors", JSON.stringify(colors));
    images.forEach(img => formData.append("images", img));

    try {
      await API.post("/products", formData,{
        headers:{"Content-Type":"multipart/form-data"}
      });

      alert("Product Added 🎉");

      setForm({
        name: "",
        category: "",
        price: "",
        description: "",   // reset
        fabric: "",
        work: "",
        occasion: "",
        fit: "",
        readyMade: false,
        featured: false,
      });

      setSizes([]);
      setColors([]);
      setImages([]);
      setPreview([]);

    } catch {
      alert("Upload failed");
    }
  };

  return (
    <div className="add-product-page">
      <h2>Add Boutique Product</h2>

      <form className="product-form" onSubmit={submitProduct}>

        <input name="name" placeholder="Product Name"
          value={form.name} onChange={handleChange} required />

        <select name="category" value={form.category} onChange={handleChange} required>
          <option value="">Select Category</option>
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>

        <input type="number" name="price" placeholder="Price ₹"
          value={form.price} onChange={handleChange} required />

        {/* ⭐ DESCRIPTION */}
        <textarea
          name="description"
          placeholder="Product Description (Fabric, work, styling details...)"
          value={form.description}
          onChange={handleChange}
        />

        <select name="fabric" value={form.fabric} onChange={handleChange}>
          <option value="">Fabric</option>
          {fabrics.map(f => <option key={f}>{f}</option>)}
        </select>

        <select name="work" value={form.work} onChange={handleChange}>
          <option value="">Work</option>
          {works.map(w => <option key={w}>{w}</option>)}
        </select>

        <select name="occasion" value={form.occasion} onChange={handleChange}>
          <option value="">Occasion</option>
          {occasions.map(o => <option key={o}>{o}</option>)}
        </select>

        <select name="fit" value={form.fit} onChange={handleChange}>
          <option value="">Fit</option>
          {fits.map(f => <option key={f}>{f}</option>)}
        </select>

        {/* SIZE */}
        {form.category !== "Saree" ? (
          <div className="size-box">
            {["XS","S","M","L","XL","Free"].map(size => (
              <button type="button" key={size}
                className={sizes.includes(size) ? "active" : ""}
                onClick={() => toggleSize(size)}>
                {size}
              </button>
            ))}
          </div>
        ) : (
          <p className="free-size-label">Free Size (Saree Default)</p>
        )}

        {/* COLOR */}
        <div className="color-box">
          {colorOptions.map(color => (
            <button type="button" key={color}
              className={`color-chip ${colors.includes(color) ? "active" : ""}`}
              onClick={() => toggleColor(color)}
              style={{ background: color.toLowerCase() }}
            />
          ))}
        </div>

        <input type="file" multiple accept="image/*" onChange={handleImages}/>

        <div className="preview-row">
          {preview.map((src,i)=>(
            <div key={i} className="preview-box">
              <img src={src} alt="preview"/>
              <span onClick={()=>removeImage(i)}>✕</span>
            </div>
          ))}
        </div>

        <label>
          <input type="checkbox" name="readyMade" checked={form.readyMade} onChange={handleChange}/>
          Ready to Wear
        </label>

        <label>
          <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange}/>
          Featured Product
        </label>

        <button>Add Product</button>

      </form>
    </div>
  );
}
