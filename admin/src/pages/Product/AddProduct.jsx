import { useState, useContext } from "react";
import "./Product.css";
import { postData } from "../../utils/api";
import { myContext } from "../../App";
import { Link } from "react-router-dom";

const AddProduct = () => {
  const context = useContext(myContext);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    images: [],
    price: "",
    discount: "",
    ratings: "",
    features: [],
    highlights: [],
    insideBox: [],
    category: "",
    sellerId: "",
    isTrendy: null,
  });

  const [tempInputs, setTempInputs] = useState({
    image: "",
    feature: "",
    highlight: "",
    insideBoxItem: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ["discount", "ratings"].includes(name)
        ? parseInt(value) || 0
        : value,
    }));
  };

  const handleTempInputChange = (e) => {
    const { name, value } = e.target;
    setTempInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileUpload = (e, targetField = "images") => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        [targetField]: [...prev[targetField], reader.result],
      }));
    };
    reader.readAsDataURL(file);
  };

  const addArrayItem = (field, tempField) => {
    if (tempInputs[tempField].trim()) {
      setFormData((prev) => ({
        ...prev,
        [field]: [...prev[field], tempInputs[tempField].trim()],
      }));
      setTempInputs((prev) => ({ ...prev, [tempField]: "" }));
    }
  };

  const removeArrayItem = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!user?.id || typeof user.id !== "string") {
      context.setAlertBox({
        open: true,
        msg: "Invalid user ID. Please log in again.",
        error: true,
      });
      setLoading(false);
      return;
    }

    const productData = {
      ...formData,
      sellerId: user.id,
      createdById: user.id,
    };

    await postData("/product/create-product", productData); 

    context.setAlertBox({
      open: true,
      msg: "Product added successfully!",
      error: false,
    });

    setFormData({
      name: "",
      description: "",
      images: [],
      price: "",
      discount: "",
      ratings: "",
      features: [],
      highlights: [],
      insideBox: [],
      category: "",
      sellerId: "",
      isTrendy: null,
    });

    setTimeout(() => {
      window.location.href = "/viewproduct";
    }, 1000);
  } catch (error) {
    console.error("Error updating item:", error);
    context.setAlertBox({
      open: true,
      msg: "Error adding product",
      error: true,
    });
  } finally {
    setLoading(false); 
  }
};


  return (
    <div className="product-container">
      <div className="product-header">
        <h1>Add Product</h1>
        <Link to="/viewproduct">
          <div className="product-stats">View Products</div>
        </Link>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit} className="product-form">
          {/* Basic Info */}
          <div className="form-row">
            <div className="form-group">
              <label>Product Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="form-input" required />
            </div>

            <div className="form-group">
              <label>Price</label>
              <input type="number" name="price" value={formData.price} onChange={handleInputChange} className="form-input" required />
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea name="description" value={formData.description} onChange={handleInputChange} rows="4" className="form-textarea" required />
          </div>

          {/* Meta */}
          <div className="form-row">
            <div className="form-group">
              <label>Discount (%)</label>
              <input type="number" name="discount" value={formData.discount} onChange={handleInputChange} className="form-input" min="0" max="100" />
            </div>

            <div className="form-group">
              <label>Ratings (1-5)</label>
              <input type="number" name="ratings" value={formData.ratings} onChange={handleInputChange} className="form-input" min="1" max="5" />
            </div>

            <div className="form-group">
              <label>Category</label>
              <input type="text" name="category" value={formData.category} onChange={handleInputChange} className="form-input" required />
            </div>

            <div className="form-group">
              <label>Is Trendy</label>
              <select
                name="isTrendy"
                value={formData.isTrendy === null ? "" : formData.isTrendy.toString()}
                onChange={(e) => setFormData((prev) => ({ ...prev, isTrendy: e.target.value === "true" }))}
                className="form-input"
                required
              >
                <option value="">Select Type</option>
                <option value="true">True</option>
                <option value="false">False</option>
              </select>
            </div>
          </div>

           {/* Product Images */}
        <div className="form-section">
          <label>Product Images (URL or Upload)</label>
          <div className="input-with-add">
            <input type="url" name="image" value={tempInputs.image} onChange={handleTempInputChange} placeholder="Enter image URL" />
            <button type="button" onClick={() => addArrayItem("images", "image")} className="add-btn"> Add</button>
          </div>
          <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, "images")} />

          <div className="preview-grid">
            {formData.images.map((img, idx) => (
              <div key={idx} className="preview-item">
                <img src={img} alt={`img-${idx}`} />
                <button type="button" onClick={() => removeArrayItem("images", idx)}>×</button>
              </div>
            ))}
          </div>
        </div>

          {/* Features */}
          <div className="form-section">
            <h3 className="section-title">Features</h3>
            <div className="input-with-add">
              <input type="text" name="feature" value={tempInputs.feature} onChange={handleTempInputChange} placeholder="Enter product feature" className="form-input" />
              <button type="button" onClick={() => addArrayItem("features", "feature")} className="add-btn">Add</button>
            </div>

            <div className="preview-tags">
              {formData.features.map((f, i) => (
                <div key={i} className="preview-tag">
                  <span>{f}</span>
                  <button type="button" onClick={() => removeArrayItem("features", i)} className="delete-tag-btn">×</button>
                </div>
              ))}
            </div>
          </div>

          {/* Highlights */}
         {/* Highlights */}
        <div className="form-section">
          <label>Highlights (URL or Upload)</label>
          <div className="input-with-add">
            <input type="url" name="highlight" value={tempInputs.highlight} onChange={handleTempInputChange} />
            <button type="button" onClick={() => addArrayItem("highlights", "highlight")} className="add-btn">Add</button>
          </div>
          <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, "highlights")} />
          <div className="preview-grid">
            {formData.highlights.map((h, i) => (
              <div key={i} className="preview-item">
                <img src={h} alt={`highlight-${i}`} />
                <button onClick={() => removeArrayItem("highlights", i)}>×</button>
              </div>
            ))}
          </div>
        </div>
       

          {/* Inside Box */}
          <div className="form-section">
            <h3 className="section-title">Inside Box</h3>
            <div className="input-with-add">
              <input type="text" name="insideBoxItem" value={tempInputs.insideBoxItem} onChange={handleTempInputChange} placeholder="Enter item inside box" className="form-input" />
              <button type="button" onClick={() => addArrayItem("insideBox", "insideBoxItem")} className="add-btn">Add</button>
            </div>

            <div className="preview-tags">
              {formData.insideBox.map((item, idx) => (
                <div key={idx} className="preview-tag inbox-preview">
                  <span>{item}</span>
                  <button type="button" onClick={() => removeArrayItem("insideBox", idx)} className="delete-tag-btn">×</button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="form-actions">
            <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? (
              <>
                <span className="spinner" /> Adding...
              </>
            ) : (
              "Add Product →"
            )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;







