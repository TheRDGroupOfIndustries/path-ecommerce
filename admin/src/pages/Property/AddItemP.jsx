import { useState } from "react"
import { postData } from "../../utils/api"
import "../MarketPlace/AddItemM.css"
import { SquareCheckBig } from "lucide-react"

const AddItemP = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageUrl: [],
    category: "",
    createdById: "",
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false);
 const [tempInputs, setTempInputs] = useState({ image: "" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

 const handleTempInputChange = (e) => {
    const { name, value } = e.target;
    setTempInputs((prev) => ({ ...prev, [name]: value }));
  };

 const addImage = () => {
    if (tempInputs.image.trim()) {
      setFormData((prev) => ({
        ...prev,
        imageUrl: [...prev.imageUrl, tempInputs.image.trim()],
      }));
      setTempInputs({ image: "" });
    }
  };
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        imageUrl: [...prev.imageUrl, reader.result],
      }));
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      imageUrl: prev.imageUrl.filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    } else if (formData.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters"
    }

    if (!formData.category.trim()) {
      newErrors.category = "Category is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user?.id) {
      alert("User ID not found. Please login again.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = { ...formData, createdById: user.id };
      await postData("/property/create", payload);

      setSubmitSuccess(true);
      setFormData({
        name: "",
        description: "",
        imageUrl: [],
        category: "",
        createdById: "",
      });
      setTempInputs({ image: "" });

      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (err) {
      console.error("Error creating item:", err);
      alert("Failed to add item. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: "",
      description: "",
      imageUrl: [],
      category: "",
      createdById: "",
    });
    setTempInputs({ image: "" });
    setErrors({});
    setSubmitSuccess(false);
  };

  return (
    <div className="add-item-container">
      <div className="add-item-header">
        <div className="add-item-title">+ Add new</div>
        <div className="add-item-subtitle">Fill the information below to add a new product</div>
      </div>

      {submitSuccess && (
        <div className="success-message">
          <span className="success-icon"><SquareCheckBig /></span>
          Item added successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="add-item-form">
        <div className="form-grid">
          {/* Name Field */}
          <div className="input-group1">
            <label htmlFor="name" className="form-label">
              Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`form-input ${errors.name ? "input-error" : ""}`}
              placeholder="Enter product name"
              style={{ borderRadius: 12, fontSize: 16, padding: '16px 20px' }}
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          {/* Category Field  */}
          <div className="input-group1">
            <label htmlFor="category" className="form-label">
              Category <span className="required">*</span>
            </label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className={`form-input ${errors.category ? "input-error" : ""}`}
              placeholder="Enter property category"
              style={{ borderRadius: 12, fontSize: 16, padding: '16px 20px' }}
            />
            {errors.category && <span className="error-text">{errors.category}</span>}
          </div>

          {/* Image Upload */}
          <div className="form-section">
            <label className="form-label" style={{ fontWeight: 600, marginBottom: 8 }}>
              Product Images
            </label>
            <div style={{ display: "flex", gap: 12,alignItems: 'center', marginBottom: 10 }}>
              <input
                type="url"
                name="image"
                value={tempInputs.image}
                onChange={handleTempInputChange}
                placeholder="Enter image URL"
                className="form-input"
                style={{ flex: 1, borderRadius: 12, padding: "16px 20px" }}
              />
              <button
                type="button"
                onClick={addImage}
                className="add-btn"
                style={{
                  background: "#353896",
                  color: "white",
                  borderRadius: 10,
                  padding: "16px 28px",
                  fontWeight: 600,
                  fontSize: 16
                }}
              >
                + Add
              </button>
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              style={{ marginBottom: 16 }}
            />

            {formData.imageUrl.length > 0 && (
              <div className="preview-grid" style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                {formData.imageUrl.map((image, index) => (
                  <div
                    key={index}
                    className="preview-item image-preview"
                    style={{
                      position: "relative",
                      border: "1px solid #eee",
                      padding: 8,
                      borderRadius: 10,
                      background: "#f9f9f9",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="delete-preview-btn"
                      style={{
                        position: "absolute",
                        top: 2,
                        right: 2,
                        background: "#e74c3c",
                        color: "white",
                        borderRadius: "50%",
                        width: 22,
                        height: 22,
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      ×
                    </button>
                    <img
                      src={image}
                      alt={`Product ${index + 1}`}
                      style={{ maxWidth: 150, maxHeight: 80, borderRadius: 8 }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Description Field */}
          <div className="input-group-full">
            <label htmlFor="description" className="form-label">
              Description <span className="required">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className={`form-textarea ${errors.description ? "input-error" : ""}`}
              placeholder="Enter detailed description of the product"
              rows="3"
              style={{ borderRadius: 12, fontSize: 16, padding: '16px 20px' }}
            />
            <div className="char-count">{formData.description.length} characters</div>
            {errors.description && <span className="error-text">{errors.description}</span>}
          </div>
        </div>

        <div className="button-group" style={{ justifyContent: 'flex-end', gap: 20 }}>
          <button type="button" onClick={handleReset} className="reset-button" disabled={isSubmitting} style={{ borderRadius: 30, padding: '12px 32px', fontWeight: 600, fontSize: 16 }}>
            Reset
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`submit-button ${isSubmitting ? "submit-button-disabled" : ""}`}
            style={{ background: '#353896', color: 'white', borderRadius: 30, padding: '12px 32px', fontWeight: 600, fontSize: 16 }}
          >
            {isSubmitting ? (
              <>
                <span className="spinner"></span>
                Adding...
              </>
            ) : (
              "Add Item"
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddItemP
