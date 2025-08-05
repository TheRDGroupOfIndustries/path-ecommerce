import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [valid, setValid] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setValid(false);
      setLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setValid(false);
      } else {
        setValid(true);
      }
    } catch (e) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setValid(false);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) return null; // or a spinner

  return valid ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
