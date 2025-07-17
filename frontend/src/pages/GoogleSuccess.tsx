import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const GoogleSuccess = () => {
  const [searchParams] = useSearchParams();
  console.log("serch: ",searchParams.get("token"));
  
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      // Save token to localStorage
      localStorage.setItem("token", token);

      // Redirect to home
      console.log("redirecting......");
      
      navigate("/", { replace: true });
    } else {
        console.log("redirect failed redirect to login-----");
      navigate("/login");
    }
  }, [navigate, searchParams]);

  return <p className="text-center mt-10 text-xl">Logging you in...</p>;
};

export default GoogleSuccess;
