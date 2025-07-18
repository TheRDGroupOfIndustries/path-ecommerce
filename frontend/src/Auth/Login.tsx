// import React, { useState } from "react";
// // import SPC from "@/assets/SPC.jpg";
// import SPC from "@/assets/Logo_2.jpg";
// import { Eye, EyeOff } from "lucide-react";
// import { FaGoogle } from "react-icons/fa";
// import { Card, CardContent } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";

// const Login = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     alert("Login Submitted");
//     // You can add: login(formData.email, formData.password)
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-white px-4 ">
//       <Card className="w-full  border-none shadow-none p-4 ">
//         <CardContent className="p-0">
//           <div className="flex justify-center mb-6">
//             <img
//               src={SPC}
//               alt="SPC Logo"
//               className="w-20 h-20 object-contain "
//             />
//           </div>
//           <h1 className="text-4xl font-bold text-left mb-1">
//             We're glad to see you,
//           </h1>
//           <p className="text-sm text-left text-muted-foreground mb-6">
//             Please provide your credentials
//           </p>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <Input
//               placeholder="Email"
//               name="email"
//               type="email"
//               value={formData.email}
//               onChange={handleChange}
//               required
//               className="bg-gray-200 py-6"
//             />
//             <div className="space-y-1">
//               <div className="relative">
//                 <Input
//                   placeholder="Password"
//                   name="password"
//                   type={showPassword ? "text" : "password"}
//                   value={formData.password}
//                   onChange={handleChange}
//                   className="py-6 bg-gray-200"
//                   required
//                 />
//                 <div
//                   className="absolute right-3 top-3.5 cursor-pointer text-black"
//                   onClick={() => setShowPassword(!showPassword)}
//                 >
//                   {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                 </div>
//               </div>
//               <div className="text-right mt-1">
//                 <a
//                   href="/forgot-password"
//                   className="text-sm text-black underline"
//                 >
//                   Forgot Password?
//                 </a>
//               </div>
//             </div>

//             <Button
//               type="submit"
//               className="w-full text-white py-7 text-xl
//     [background:radial-gradient(circle_at_center,_#031a67_0%,_#000_100%)] "
//             >
//               Login
//             </Button>
//           </form>

//           <div className="flex flex-col items-center mt-8">
//             <Button
//               type="button"
//               className="bg-white text-black rounded-full border-2 p-5 flex items-center justify-center hover:bg-gray-900"
//             >
//               <FaGoogle size={36} />
//             </Button>
//             <span className="text-sm text-black mt-2 font-semibold">
//               Google
//             </span>
//           </div>

//           <div className="flex items-center my-4">
//             <div className="flex-grow border-t-2" />
//           </div>
//           <p className="text-center text-sm mt-4">
//             Don't have an account?{" "}
//             <a href="/signup" className="text-black underline">
//               Sign up
//             </a>
//           </p>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default Login;

import React, { useState } from "react";
import SPC from "@/assets/SPC.jpg";
import { Eye, EyeOff } from "lucide-react";
import { FaGoogle } from "react-icons/fa";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/authContext";
import { useNavigate } from "react-router-dom";
import { API_URL } from "@/lib/api.env";
const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    if (formData.email === "" && formData.password === "") {
      setError("Please provide all credentials")
      return
    }
    try {
      await login(formData.email, formData.password);
      navigate("/"); // or any protected route
    } catch (err: any) {
      setError("Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <Card className="w-full max-w-md border-none shadow-none p-4">
        <CardContent className="p-0">
          <div className="flex justify-center mb-6">
            <img
              src={SPC}
              alt="SPC Logo"
              className="w-20 h-20 object-contain"
            />
          </div>
          <h1 className="text-4xl font-bold text-left mb-1">
            We're glad to see you,
          </h1>
          <p className="text-sm text-left text-muted-foreground mb-6">
            Please provide your credentials
          </p>

          {error && (
            <p className="text-sm text-red-600 text-center mb-3">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="bg-gray-200 py-6"
            />

            <div className="relative">
              <Input
                placeholder="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                className="py-6 bg-gray-200"
                required
              />
              <div
                className="absolute right-3 top-3.5 cursor-pointer text-black"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
            </div>

            <div className="text-right mt-1">
              <a
                href="/forgot-password"
                className="text-sm text-black underline"
              >
                Forgot Password?
              </a>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full text-white py-7 text-xl
              primary-bg
              "
              // [background:radial-gradient(circle_at_center,_#031a67_0%,_#000_100%)]
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>


          <div className="flex items-center my-4">
            <div className="flex-grow border-t-2" />
          </div>
          <p className="text-center text-sm mt-4">
            Don't have an account?{" "}
            <a href="/signup" className="text-black underline">
              Sign up
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
