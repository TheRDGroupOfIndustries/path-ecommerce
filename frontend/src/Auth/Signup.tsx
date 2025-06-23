import React, { useState } from "react";
import SPC from "@/assets/SPC.jpg";
import { Eye, EyeOff } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Login Submitted");
    // You can add: login(formData.email, formData.password)
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <Card className="w-full max-w-sm p-6 border-none shadow-none">
        <CardContent className="p-0">
          <div className="flex justify-center mb-6">
            <img
              src={SPC}
              alt="SPC Logo"
              className="w-20 h-20 object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold text-center mb-1">
            We're glad to see you,
          </h1>
          <p className="text-sm text-center text-muted-foreground mb-6">
            Please provide your credentials
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <div className="relative">
              <Input
                placeholder="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                className="pr-10"
                required
              />
              <div
                className="absolute right-2 top-2.5 cursor-pointer text-muted-foreground"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
            </div>
            <Button type="submit" className="w-full bg-black text-white hover:bg-gray-900">
              Login
            </Button>
          </form>
          <div className="flex items-center my-4">
            <div className="flex-grow border-t" />
            <span className="mx-2 text-muted-foreground text-sm">or</span>
            <div className="flex-grow border-t" />
          </div>
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
          >
            <FcGoogle size={20} />
            Google
          </Button>
          <p className="text-center text-sm mt-4">
            Don't have an account?{" "}
            <a href="/signup" className="text-blue-600 underline">
              Sign up
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
