import { useState } from "react";
// import { postData } from "../../utils/api"; // Adjust based on your utils/api location
// import "./AddUser.css"; // Uncomment and create CSS accordingly

const roles = ["USER", "ASSOCIATE", "ADMIN"]; // Adjust available roles if needed

const AddUser = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
    phone: "",
    address: "",
    image: null, // store File object
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      setFormData((prev) => ({ ...prev, image: files[0] || null }));
      if (errors.image) setErrors((prev) => ({ ...prev, image: "" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      newErrors.email = "Invalid email address";
    }
    if (!formData.role) newErrors.role = "Role is required";
    if (!formData.password.trim()) newErrors.password = "Password is required";
    if (formData.phone && !/^\+?\d{7,15}$/.test(formData.phone)) {
      // Basic phone validation
      newErrors.phone = "Phone number is invalid";
    }
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.image) newErrors.image = "Image is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleReset = () => {
    setFormData({
      name: "",
      email: "",
      role: "",
      password: "",
      phone: "",
      address: "",
      image: null,
    });
    setErrors({});
    setSubmitSuccess(false);
    setSubmitError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitError("");

    try {
      // Prepare FormData for image upload
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("email", formData.email);
      payload.append("role", formData.role);
      payload.append("password", formData.password);
      payload.append("phone", formData.phone);
      payload.append("address", formData.address);
      if (formData.image) payload.append("image", formData.image);

      // Use your API helper to POST with multipart/form-data
    //   await postData("/users/add", payload, {
    //     headers: { "Content-Type": "multipart/form-data" },
    //   });

      setSubmitSuccess(true);
      handleReset();
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (error) {
      console.error("Error adding user:", error);
      setSubmitError(
        error?.response?.data?.error ||
          "Failed to add user. Please try again later."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-item-container">
      <div className="add-item-header">
        <h1 className="add-item-title">+ Add User</h1>
        <p className="add-item-subtitle">Fill the form below to add a new user</p>
      </div>

      {submitSuccess && (
        <div className="success-message">
          <span className="success-icon">✅</span> User added successfully!
        </div>
      )}

      {submitError && <div className="error-message">{submitError}</div>}

      <form onSubmit={handleSubmit} className="add-item-form" noValidate>
        <div className="form-grid">

          {/* Name */}
          <div className="input-group1">
            <label htmlFor="name" className="form-label">
              Name <span className="required">*</span>
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`form-input ${errors.name ? "input-error" : ""}`}
              autoComplete="off"
              disabled={isSubmitting}
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          {/* Email */}
          <div className="input-group1">
            <label htmlFor="email" className="form-label">
              Email <span className="required">*</span>
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`form-input ${errors.email ? "input-error" : ""}`}
              autoComplete="off"
              disabled={isSubmitting}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          {/* Role */}
          <div className="input-group1">
            <label htmlFor="role" className="form-label">
              Role <span className="required">*</span>
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className={`form-select ${errors.role ? "input-error" : ""}`}
              disabled={isSubmitting}
            >
              <option value="">Select Role</option>
              {roles.map((role) => (
                <option value={role} key={role}>
                  {role}
                </option>
              ))}
            </select>
            {errors.role && <span className="error-text">{errors.role}</span>}
          </div>

          {/* Password */}
          <div className="input-group1">
            <label htmlFor="password" className="form-label">
              Password <span className="required">*</span>
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`form-input ${errors.password ? "input-error" : ""}`}
              autoComplete="new-password"
              disabled={isSubmitting}
            />
            {errors.password && (
              <span className="error-text">{errors.password}</span>
            )}
          </div>

          {/* Phone */}
          <div className="input-group1">
            <label htmlFor="phone" className="form-label">
              Phone
            </label>
            <input
              id="phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={`form-input ${errors.phone ? "input-error" : ""}`}
              autoComplete="tel"
              disabled={isSubmitting}
            />
            {errors.phone && <span className="error-text">{errors.phone}</span>}
          </div>

          {/* Address */}
          <div className="input-group1" style={{ gridColumn: "1 / span 3" }}>
            <label htmlFor="address" className="form-label">
              Address <span className="required">*</span>
            </label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className={`form-textarea ${errors.address ? "input-error" : ""}`}
              rows={3}
              disabled={isSubmitting}
              style={{ resize: "vertical" }}
            />
            {errors.address && (
              <span className="error-text">{errors.address}</span>
            )}
          </div>

          {/* Image */}
          <div className="input-group1">
            <label htmlFor="image" className="form-label">
              Image 
            </label>
            <input
              id="image"
              type="file"
              name="image"
              accept="image/*"
              onChange={handleInputChange}
              className={`form-input ${errors.image ? "input-error" : ""}`}
              disabled={isSubmitting}
            />
            {errors.image && <span className="error-text">{errors.image}</span>}
          </div>

        </div>

        <div className="button-group">
          <button
            type="button"
            onClick={handleReset}
            className="reset-button"
            disabled={isSubmitting}
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`submit-button ${isSubmitting ? "submit-button-disabled" : ""}`}
          >
            {isSubmitting ? (
              <>
                <span className="spinner"></span> Adding...
              </>
            ) : (
              "Add User"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddUser;
