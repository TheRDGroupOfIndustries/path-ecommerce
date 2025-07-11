import { useState } from "react";
import "./Signup.css";
import { FaUser, FaLock, FaPhoneAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaCircleUser } from "react-icons/fa6";
import { postData } from "../../utils/api";
import { useContext } from "react"
import { myContext } from "../../App"

const Signup = () => {
  const context = useContext(myContext)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "",
    imageFile: null, 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleSubmit = async (e) => {
  e.preventDefault();

  const data = new FormData();
  data.append("name", formData.name);
  data.append("email", formData.email);
  data.append("phone", formData.phone);
  data.append("password", formData.password);
  data.append("confirmPassword", formData.confirmPassword);
  data.append("role", formData.role);
  data.append("image", formData.imageFile);  

  try {
    const result = await postData("/users/create-user", data, true); // already parsed

    if (result?.token) {
      localStorage.setItem("token", result.token?.accessToken || "");  
      localStorage.setItem("user", JSON.stringify(result.user || {}));

      context.setAlertBox({
        open: true,
        msg: "SignUp successfully!",
        error: false,
      });

      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } else {
      throw new Error(result.error || "Signup failed");
    }

  } catch (error) {
    console.error("Signup failed:", error);
    context.setAlertBox({
      open: true,
      msg: "SignUp Failed!",
      error: true,
    });
  }
};

  return (
    <div className="login-container">
      <div className="login-card login-card-centered">
        <div className="login-image-section">
          <img
            src="https://miro.medium.com/v2/resize:fit:1400/1*H0blMkNrtDWvZdrohrivKQ.jpeg"
            alt="Login Illustration"
            className="login-illustration"
          />
          <a href="/login" className="create-account-link">Already have an account?</a>
        </div>
        <div className="login-form-section">
          <img src="/SPC.png" alt="SPC Logo" className="login-logo" />
          <h2 className="login-title">Sign Up</h2>
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <span className="input-icon"><FaUser /></span>
              <input
                type="text"
                name="name"
                placeholder=" Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-group">
              <span className="input-icon"><MdEmail /></span>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-group">
              <span className="input-icon"><FaPhoneAlt /></span>
              <input
                type="tel"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-group">
              <span className="input-icon"><FaCircleUser /></span>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="">Select Role</option>
                <option value="ADMIN">Admin</option>
                <option value="SELLER">Seller</option>
              </select>
            </div>
            <div className="input-group">
              <span className="input-icon"><FaLock /></span>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-group">
              <span className="input-icon"><FaLock /></span>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

              <div className="form-sectionn">
              <div className="input-group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      imageFile: e.target.files[0],
                    }))
                  }
                  required
                  className="form-input"
                />
              </div>

              {formData.imageFile && (
                <div className="preview-container">
                  <h4 className="preview-title">Image Preview</h4>
                  <div className="preview-item image-preview">
                    <button
                      type="button"
                      className="delete-preview-btn"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          imageFile: null,
                        }))
                      }
                      title="Remove image"
                    >
                      ×
                    </button>
                    <img
                      src={URL.createObjectURL(formData.imageFile)}
                      alt="Preview"
                    />
                  </div>
                </div>
              )}
            </div>


            <button type="submit" className="login-btn">Sign Up</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
