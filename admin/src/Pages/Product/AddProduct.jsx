import { useState, useEffect } from "react"
import "./Product.css"
import { postData } from "../../utils/api"
import { useContext } from "react"
import { myContext } from "../../App"
import { Link } from "react-router-dom"

const AddProduct = () => {
  const context = useContext(myContext)
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description:"",
    images: [],
    price: "",
    discount: "",
    ratings: "",
    features: [],
    highlights: [],
    insideBox: [],
    category:"",
    sellerId:"",
  })


  const [tempInputs, setTempInputs] = useState({
    image: "",
    feature: "",
    highlight: "",
    insideBoxItem: "",
  })

  const handleInputChange = (e) => {
  const { name, value } = e.target;
  setFormData((prev) => ({
    ...prev,
    [name]: name === "discount" || name === "ratings" || name === "referralPercentage"
      ? parseInt(value) || 0
      : value,
  }));
};

  const handleTempInputChange = (e) => {
    const { name, value } = e.target
    setTempInputs((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const addImage = () => {
    if (tempInputs.image.trim()) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, tempInputs.image.trim()],
      }))
      setTempInputs((prev) => ({ ...prev, image: "" }))
    }
  }

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const addArrayItem = (field, tempField) => {
    if (tempInputs[tempField].trim()) {
      setFormData((prev) => ({
        ...prev,
        [field]: [...prev[field], tempInputs[tempField].trim()],
      }))
      setTempInputs((prev) => ({ ...prev, [tempField]: "" }))
    }
  }

  const removeArrayItem = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }))
  }

 const handleSubmit = (e) => {
  e.preventDefault();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  console.log("USER FROM LOCALSTORAGE:", user);

  if (!user?.id || typeof user.id !== "string") {
    alert("Invalid user ID. Please log in again.");
    return;
  }

  const productData = {
    ...formData,
    sellerId: user.id,
    createdById: user.id, 
  };
console.log(user.id);
  postData("/product/create-product", productData).then((res) => {
    context.setAlertBox({
      open: true,
      msg: "Product added successfully!",
      error: false,
    });
 console.log("user.id =>", user.id);
    setFormData({
      id: "",
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
    });

    setTimeout(() => {
      window.location.href = "/viewproduct";
    }, 1000);
  });
};

  return (
    <div className="product-container">
      <div className="product-header">
        <h1>Add Product</h1>
       <Link to="/viewproduct"> <div className="product-stats">View Products</div></Link>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-row">
            <div className="form-group">
              <label>Product Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label>Price</label>
              <input
                type="text"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
              className="form-textarea"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Discount (%)</label>
              <input
                type="number"
                name="discount"
                value={formData.discount}
                onChange={handleInputChange}
                className="form-input"
                min="0"
                max="100"
              />
            </div>

            <div className="form-group">
              <label>Ratings (1-5)</label>
              <input
                type="number"
                name="ratings"
                value={formData.ratings}
                onChange={handleInputChange}
                className="form-input"
                min="1"
                max="5"
              />
            </div>
             <div className="form-group">
              <label>Category</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>       
          </div>

          {/* Images Section */}
          <div className="form-section">
            <h3 className="section-title">Product Images</h3>
            <div className="input-with-add">
              <input
                type="url"
                name="image"
                value={tempInputs.image}
                onChange={handleTempInputChange}
                placeholder="Enter image URL"
                className="form-input"
              />
              <button type="button" onClick={addImage} className="add-btn">
                Add 
              </button>
            </div>

            {formData.images.length > 0 && (
              <div className="preview-container">
                <h4 className="preview-title">Image Preview</h4>
                <div className="preview-grid">
                  {formData.images.map((image, index) => (
                    <div key={index} className="preview-item image-preview">
                      <button
                        type="button"
                        className="delete-preview-btn"
                        onClick={() => removeImage(index)}
                        title="Remove image"
                      >
                        ×
                      </button>
                      <img src={image || "/placeholder.svg"} alt={`Product ${index + 1}`} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Features Section */}
          <div className="form-section">
            <h3 className="section-title">Features</h3>
            <div className="input-with-add">
              <input
                type="text"
                name="feature"
                value={tempInputs.feature}
                onChange={handleTempInputChange}
                placeholder="Enter product feature"
                className="form-input"
              />
              <button type="button" onClick={() => addArrayItem("features", "feature")} className="add-btn">
                Add 
              </button>
            </div>

            {formData.features.length > 0 && (
              <div className="preview-container">
                <h4 className="preview-title">Features Preview</h4>
                <div className="preview-tags">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="preview-tag">
                      <span>{feature}</span>
                      <button
                        type="button"
                        className="delete-tag-btn"
                        onClick={() => removeArrayItem("features", index)}
                        title="Remove feature"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Highlights Section */}
        {/* Highlights Section */}
        <div className="form-section">
          <h3 className="section-title">Highlights</h3>
          <div className="input-with-add">
            <input
              type="url"
              name="highlight"
              value={tempInputs.highlight}
              onChange={handleTempInputChange}
              placeholder="Enter highlight image URL"
              className="form-input"
            />
            <button type="button" onClick={() => addArrayItem("highlights", "highlight")} className="add-btn">
              Add 
            </button>
          </div>

          {formData.highlights.length > 0 && (
            <div className="preview-container">
              <h4 className="preview-title">Highlight Preview</h4>
              <div className="preview-grid">
                {formData.highlights.map((highlight, index) => (
                  <div key={index} className="preview-item image-preview">
                    <button
                      type="button"
                      className="delete-preview-btn"
                      onClick={() => removeArrayItem("highlights", index)}
                      title="Remove highlight"
                    >
                      ×
                    </button>
                    <img src={highlight || "/placeholder.svg"} alt={`Highlight ${index + 1}`} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>


          {/* Inside Box Section */}
          <div className="form-section">
            <h3 className="section-title">Inside Box</h3>
            <div className="input-with-add">
              <input
                type="text"
                name="insideBoxItem"
                value={tempInputs.insideBoxItem}
                onChange={handleTempInputChange}
                placeholder="Enter item inside box"
                className="form-input"
              />
              <button type="button" onClick={() => addArrayItem("insideBox", "insideBoxItem")} className="add-btn">
                Add 
              </button>
            </div>

            {formData.insideBox.length > 0 && (
              <div className="preview-container">
                <h4 className="preview-title">Inside Box Preview</h4>
                <div className="preview-tags">
                  {formData.insideBox.map((item, index) => (
                    <div key={index} className="preview-tag inbox-preview">
                      <span>{item}</span>
                      <button
                        type="button"
                        className="delete-tag-btn"
                        onClick={() => removeArrayItem("insideBox", index)}
                        title="Remove item"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-btn">
             Add Product
            </button>    
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddProduct





