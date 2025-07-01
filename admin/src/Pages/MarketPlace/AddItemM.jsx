import { useState } from "react"
import { postData } from "../../utils/api"
import "./AddItemM.css"

const AddItemM = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageUrl: [],
    category: "",
    createdById: "",
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const categories = ["All", "Cloth", "Makeup", "Shoes","Furniture","Electronic"];

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const [tempInputs, setTempInputs] = useState({
    image: "",
  })

  const addImage = () => {
    if (tempInputs.image.trim()) {
      setFormData((prev) => ({
        ...prev,
        imageUrl: [...prev.imageUrl, tempInputs.image.trim()],
      }))
      setTempInputs({ image: "" })
    }
  }

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      imageUrl: prev.imageUrl.filter((_, i) => i !== index),
    }))
  }

  const handleTempInputChange = (e) => {
    const { name, value } = e.target
    setTempInputs((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

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

    if (!formData.category) {
      newErrors.category = "Category is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

// submit

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    const user = JSON.parse(localStorage.getItem("user") || "{}")

    if (!user?.id) {
      alert("User ID not found. Please login again.")
      return
    }

    setIsSubmitting(true)

    try {
      const payload = {
        ...formData,
        createdById: user.id,
        imageUrl: formData.imageUrl, 
      }

      const response = await postData("/marketplace/create", payload)

      console.log("Item created:", response)
      setSubmitSuccess(true)

      setFormData({
        name: "",
        description: "",
        imageUrl: [],
        category: "",
        createdById: "",
      })

      setTimeout(() => setSubmitSuccess(false), 3000)
    } catch (error) {
      console.error("Error creating item:", error)
      alert("Failed to add item. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    setFormData({
      name: "",
      description: "",
      imageUrl: [],
      category: "",
      createdById: "",
    })
    setErrors({})
    setSubmitSuccess(false)
  }

  return (
    <div className="add-item-container">
      <div className="add-item-header">
        <h1 className="add-item-title">Add Items</h1>
        <p className="add-item-subtitle">Fill in the information below to add a new item</p>
      </div>

      {submitSuccess && (
        <div className="success-message">
          <span className="success-icon">✅</span>
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
              placeholder="Enter item name"
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          {/* Category Field */}
          <div className="input-group1">
            <label htmlFor="category" className="form-label">
              Category <span className="required">*</span>
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className={`form-select ${errors.category ? "input-error" : ""}`}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && <span className="error-text">{errors.category}</span>}
          </div>

          {/* Product Images */}
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

            {formData.imageUrl.length > 0 && (
              <div className="preview-container">
                <h4 className="preview-title">Image Preview</h4>
                <div className="preview-grid">
                  {formData.imageUrl.map((image, index) => (
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
              placeholder="Enter detailed description of the item"
              rows="4"
            />
            <div className="char-count">{formData.description.length} characters</div>
            {errors.description && <span className="error-text">{errors.description}</span>}
          </div>
        </div>

        <div className="button-group">
          <button type="button" onClick={handleReset} className="reset-button" disabled={isSubmitting}>
            Reset
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`submit-button ${isSubmitting ? "submit-button-disabled" : ""}`}
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

export default AddItemM
