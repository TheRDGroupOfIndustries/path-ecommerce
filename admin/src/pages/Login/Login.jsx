import { useState } from "react";
import "./Login.css";
import { FaLock } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { fetchDataFromApi, postData } from "../../utils/api";
import { jwtDecode } from "jwt-decode";
import { useContext } from "react"
import { myContext } from "../../App"

const Login = () => {
  const context = useContext(myContext)
  const [formData, setFormData] = useState({
    email: "",
    password: ""
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
  try {
    const response = await postData("/users/login", formData);
    const token = response.token?.accessToken || "";
    const user = response.user || {};

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    const decoded = jwtDecode(token);
    console.log("Decoded Token:", decoded);
    console.log("User Role from Token:", decoded.role);

    context.setAlertBox({
      open: true,
      msg: "Login successful!",
      error: false,
    });

    if (user.role === "SELLER") {
      try {
        const kyc = await fetchDataFromApi("/kyc/my-kyc");

        // If KYC exists, route based on its status
        if (!kyc || !kyc.status) {
          window.location.href = "/kycc";   //  Fill KYC
        } else if (kyc.status === "PENDING") {
          window.location.href = "/kyc-status"; //  Wait
        } else if (kyc.status === "APPROVED") {
          window.location.href = "/dashboard"; //  Go ahead /seller-dashboard
        } else {
          window.location.href = "/kyc-status?rejected=true"; //  Rejected
        }
      } catch (kycError) {
        if (
          kycError?.response?.status === 404 &&
          kycError?.response?.data?.msg === "No KYC found."
        ) {
          window.location.href = "/kycc"; //  Show KYC form
        } else {
          console.error("Error fetching KYC:", kycError);
          context.setAlertBox({
            open: true,
            msg: "Error fetching KYC",
            error: true,
          });
        }
      }
    } else {
      window.location.href = "/dashboard"; //  Non-sellers or ADMIN 
    }
  } catch (error) {
    console.error("Login failed:", error);
    context.setAlertBox({
      open: true,
      msg: "Login Failed!",
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
          <a href="/signup" className="create-account-link">Don't have an account? Sign Up</a>
        </div>
        <div className="login-form-section">
          <img src="/SPC.png" alt="SPC Logo" className="login-logo" />
          <h2 className="login-title">Sign In</h2>
          <form className="login-form" onSubmit={handleSubmit}>
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

            <button type="submit" className="login-btn">Sign In</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
