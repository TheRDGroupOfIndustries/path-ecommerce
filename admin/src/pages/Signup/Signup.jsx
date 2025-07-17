import { useState, useContext } from "react";
import {  FaEye, FaEyeSlash } from "react-icons/fa6";
import { postData } from "../../utils/api";
import { myContext } from "../../App";
import "./Signup.css";
import {UsersRound,Mails,PhoneCall,BookUser,KeyRound} from "lucide-react"

const Signup = () => {
  const context = useContext(myContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "",
    imageFile: null,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
      const result = await postData("/users/create-user", data, true);

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
    <div className="signup-container">
      <div className="card-shadow"></div>
      <div className="signup-card">
        <div className="logo-section">
          <img src="/SPC.png" alt="SPC Logo" className="spc-logo-img" />
          <div className="signin-link">
            Already have an account? <a href="/login">Sign in</a>
          </div>
        </div>
        <div className="form-section3">
          <div className="form-header">
            <h3 className="signup-title">Sign Up</h3>
            <p className="signup-subtitle">
              Please Provide credentials to create your account
            </p>
          </div>
          <form className="signup-form" onSubmit={handleSubmit}>
            <div className="form-grid3">
              <div className="input-wrapper">
                <label className="input-label">Name</label>
                <div className="input-group">
                <UsersRound className="input-icon"/>    
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="input-wrapper">
                <label className="input-label">Email</label>
                <div className="input-group">
                <Mails className="input-icon"/>  
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="input-wrapper">
                <label className="input-label">Phone</label>
                <div className="input-group">
                 <PhoneCall className="input-icon"/>   
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="input-wrapper">
                <label className="input-label">Role</label>
                <div className="input-group">
                 <BookUser className="input-icon"/> 
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
              </div>

              <div className="input-wrapper">
                <label className="input-label">Password</label>
                <div className="input-group">
               <KeyRound className="input-icon"/>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="input-wrapper">
                <label className="input-label">Confirm Password</label>
                <div className="input-group">
                   <KeyRound className="input-icon"/>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="input-wrapper" style={{ gridColumn: "1 / span 2" }}>
                <label className="input-label">Upload Image</label>
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
                />
              </div>

              {formData.imageFile && (
                <div
                  className="preview-container"
                  style={{ gridColumn: "1 / span 2" }}
                >
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

              <button type="submit" className="signup-btn">
                Sign Up →
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;

