import { useState, useContext } from "react";
import {Mails,KeyRound} from "lucide-react"
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { fetchDataFromApi, postData } from "../../utils/api";
import { jwtDecode } from "jwt-decode";
import { myContext } from "../../App";
import "./Login.css";

const Login = () => {
  const context = useContext(myContext);
  const [showPassword, setShowPassword] = useState(false);
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
      if (formData.email === "" && formData.password === "") {
      context.setAlertBox({
        open: true,
        msg: "All fields are required!",
        error: true,
      });
        return 
      }
      const response = await postData("/users/login", formData);
      const token = response.token?.accessToken || "";
      const user = response.user || {};

      // console.log("JWT Token:", token);
      // console.log("User Info:", user);

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      const decoded = jwtDecode(token);
      // console.log("Decoded Token Payload:", decoded);
      // console.log("User ID:", decoded.id);
      // console.log("User Email:", decoded.email);
      // console.log("User Role:", decoded.role);

      context.setAlertBox({
        open: true,
        msg: "Login successful!",
        error: false,
      });

      if (user.role === "SELLER") {
        try {
          const kyc = await fetchDataFromApi("/kyc/my-kyc");
          // console.log("KYC Response:", kyc);

          if (!kyc || !kyc.status) {
            window.location.href = "/kycc";
          } else if (kyc.status === "PENDING") {
            window.location.href = "/kyc-status";
          } else if (kyc.status === "APPROVED") {
            window.location.href = "/dashboard";
          } else {
            window.location.href = "/kyc-status?rejected=true";
          }
        } catch (kycError) {
          console.error("Error fetching KYC:", kycError);

          if (
            kycError?.response?.status === 404 &&
            kycError?.response?.data?.msg === "No KYC found."
          ) {
            window.location.href = "/kycc";
          } else {
            context.setAlertBox({
              open: true,
              msg: "Error fetching KYC",
              error: true,
            });
          }
        }
      } else {
        window.location.href = "/dashboard";
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
    <div className="login-bg">
      <div className="background-block"></div>
      <div className="login-card">
        <div className="left-section" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <div className="spc-logo-large">
            <img src="/SPC.png" alt="SPC Logo" />
          </div>
          <div className="login-bottom-link" style={{ marginTop: '2.5rem', textAlign: 'left', width: '100%' }}>
            <span>Don’t have account? <a href="/signup">Sign up</a></span>
          </div>
        </div>

        <div className="login-form-section" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <h2 className="login-title">Sign In</h2>
          <p className="login-subtitle">Please Provide credentials to login</p>
          <form className="login-form" style={{ width: '100%', maxWidth: 400, margin: '0 auto' }} onSubmit={handleSubmit}>
            <div className="input-group">
              <span className="input-icon"><Mails /></span>
              <input
                type="email"
                name="email"
                placeholder="i.e, adarshpanditdev@gmail.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-group">
              <span className="input-icon"><KeyRound /></span>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="********"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <span
                className="toggle-password-icon"
                onClick={() => setShowPassword((prev) => !prev)}
                title={showPassword ? "Hide Password" : "Show Password"}
              >
                {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
              </span>
            </div>
            <button type="submit" className="login-btn">Login →</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
