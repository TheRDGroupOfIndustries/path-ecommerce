import React, { useState, useEffect } from 'react';
import { fetchDataFromApi, promoteUserToAssociate,postData } from '../../utils/api';

const AddAssociate = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    users: "",
    level: "",
    percent: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await fetchDataFromApi("/users/get-all");
    if (res && Array.isArray(res.users)) {
      setUsers(res.users);
    } else {
      setUsers([]);
    }
  };

  const levels = Array.from({ length: 13 }, (_, i) => i); //till 12

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.users.trim()) newErrors.users = "Users is required";
    if (!formData.percent.trim()) newErrors.percent = "Percent is required";
    if (!formData.level) newErrors.level = "Level is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


const waitForRoleUpdate = async (userId, expectedRole, maxRetries = 5) => {
  for (let i = 0; i < maxRetries; i++) {
    const res = await fetchDataFromApi(`/users/get-by-id/${userId}`); 
    if (res?.user?.role === expectedRole) return true;
    await new Promise((res) => setTimeout(res, 300));
  }
  return false;
};

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateForm()) return;
  setIsSubmitting(true);

  try {
    // 1. Promote user to ASSOCIATE
    await promoteUserToAssociate(
      formData.users,
      parseInt(formData.level),
      parseInt(formData.percent)
    );

    // 2. Confirm role updated
    const isUpdated = await waitForRoleUpdate(formData.users, "ASSOCIATE");
    if (!isUpdated) {
      throw new Error("User role not updated to ASSOCIATE");
    }

    // 3. Create or update referral code
    const referralRes = await postData('/referral/create-or-update', {
      associateId: formData.users,
      percent: parseInt(formData.percent),
    });

    console.log("Referral response:", referralRes);

    // Reset form
    setSubmitSuccess(true);
    setFormData({ users: '', level: '', percent: '' });
    setTimeout(() => setSubmitSuccess(false), 3000);
  } catch (error) {
    console.error("Error submitting associate referral form:", error);
    const errorMsg = error?.response?.data?.error;
if (errorMsg?.includes("already exists for this associate")) {
  setErrors(prev => ({
    ...prev,
    percent: "Referral code already exists for this associate. Try another percent.",
  }));
} else if (errorMsg?.includes("already exists for another associate")) {
  setErrors(prev => ({
    ...prev,
    percent: "Referral code already exists for a different associate. Please try a different percent.",
  }));
} else {
  alert("Failed to process associate referral data.");
}


  } finally {
    setIsSubmitting(false);
  }
};


  const handleReset = () => {
    setFormData({ users: "", level: "", percent: "" });
    setErrors({});
    setSubmitSuccess(false);
  };

  return (
    <div className="add-item-container">
      <div className="add-item-header">
        <h1 className="add-item-title">Add Associate</h1>
        <p className="add-item-subtitle">Fill form to add associate</p>
      </div>

      {submitSuccess && (
        <div className="success-message">
          <span className="success-icon">✅</span>
          Associate added successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="add-item-form">
        <div className="form-grid">

          {/* Users */}
          <div className="input-group1">
            <label htmlFor="users" className="form-label">Users <span className="required">*</span></label>
            <select
              id="users"
              name="users"
              value={formData.users}
              onChange={handleInputChange}
              className={`form-select ${errors.users ? "input-error" : ""}`}
            >
              <option value="">Select a User</option>
              {users
              .filter(user => user.role === "USER" || user.role === "ASSOCIATE")
              .map(user => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.role})
                </option>
            ))}

            </select>
            {errors.users && <span className="error-text">{errors.users}</span>}
          </div>

          {/* Level */}
          <div className="input-group1">
            <label htmlFor="level" className="form-label">Level <span className="required">*</span></label>
            <select
              id="level"
              name="level"
              value={formData.level}
              onChange={handleInputChange}
              className={`form-select ${errors.level ? "input-error" : ""}`}
            >
              <option value="">Select Level</option>
              {levels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
            {errors.level && <span className="error-text">{errors.level}</span>}
          </div>

          {/* Percent */}
          <div className="input-group1">
            <label htmlFor="percent" className="form-label">Percent <span className="required">*</span></label>
            <input
              type="number"
              id="percent"
              name="percent"
              value={formData.percent}
              onChange={handleInputChange}
              className={`form-input ${errors.percent ? "input-error" : ""}`}
              placeholder="Percentage"
            />
            {errors.percent && <span className="error-text">{errors.percent}</span>}
          </div>
        </div>

        {/* Buttons */}
        <div className="button-group">
          <button type="button" onClick={handleReset} className="reset-button" disabled={isSubmitting}>Reset</button>
          <button type="submit" disabled={isSubmitting} className={`submit-button ${isSubmitting ? "submit-button-disabled" : ""}`}>
            {isSubmitting ? <> <span className="spinner"></span> Adding... </> : "Add Associate"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddAssociate;


