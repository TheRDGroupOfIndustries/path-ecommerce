import { useState,useContext } from "react";
import { Eye, EyeOff } from "lucide-react";
import { postData } from "../../utils/api";
import { myContext } from "../../App";

const AddUser = () => {
  const context = useContext(myContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "USER",
    password: "",
    confirmPassword: "",
    phone: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    if (!formData.password.trim()) newErrors.password = "Password is required";
    if (!formData.confirmPassword.trim())
      newErrors.confirmPassword = "Confirm password is required";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    if (formData.phone && !/^\+?\d{7,15}$/.test(formData.phone)) {
      newErrors.phone = "Phone number is invalid";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleReset = () => {
    setFormData({
      name: "",
      email: "",
      role: "USER",
      password: "",
      confirmPassword: "",
      phone: "",
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
     const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("email", formData.email);
      payload.append("role", formData.role);
      payload.append("password", formData.password);
      payload.append("phone", formData.phone);
      payload.append("confirmPassword", formData.confirmPassword);


      await postData("/users/create-user", payload, true);

      setSubmitSuccess(true);
      context.setAlertBox({ open: true, msg: "User added Successfully!", error: false });

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
              disabled={isSubmitting}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          {/* Role */}
          <div className="input-group1">
            <label htmlFor="role" className="form-label">
              Role
            </label>
            <input
              id="role"
              type="text"
              name="role"
              value={formData.role}
              readOnly
              className="form-input"
            />
          </div>

          {/* Password */}
         <div className="input-group1">
        <label htmlFor="password" className="form-label">
          Password <span className="required">*</span>
        </label>
        <div className="password-wrapper" style={{ position: "relative" }}>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className={`form-input ${errors.password ? "input-error" : ""}`}
            disabled={isSubmitting}
          />
          <span
            onClick={() => setShowPassword((prev) => !prev)}
            style={{
              position: "absolute",
              top: "50%",
              right: "10px",
              transform: "translateY(-50%)",
              cursor: "pointer",
              color: "#888",
            }}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </span>
        </div>
        {errors.password && <span className="error-text">{errors.password}</span>}
      </div>


          {/* Confirm Password */}
          <div className="input-group1">
          <label htmlFor="confirmPassword" className="form-label">
            Confirm Password <span className="required">*</span>
          </label>
          <div className="password-wrapper" style={{ position: "relative" }}>
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={`form-input ${errors.confirmPassword ? "input-error" : ""}`}
              disabled={isSubmitting}
            />
            <span
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              style={{
                position: "absolute",
                top: "50%",
                right: "10px",
                transform: "translateY(-50%)",
                cursor: "pointer",
                color: "#888",
              }}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>
          {errors.confirmPassword && (
            <span className="error-text">{errors.confirmPassword}</span>
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
              disabled={isSubmitting}
            />
            {errors.phone && <span className="error-text">{errors.phone}</span>}
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
            className={`submit-button ${isSubmitting ? "submit-button-disabled" : ""}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? <span className="spinner" /> : "Add User"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddUser;
