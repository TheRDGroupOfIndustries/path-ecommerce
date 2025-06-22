import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import SPC from "@/assets/SPC.jpg";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/authContext";

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const SignUp = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError("Name is required");
      return false;
    }

    if (!formData.email.trim()) {
      setError("Email is required");
      return false;
    }

    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      await register(formData);
      navigate("/login");
    } catch (err: any) {
      setError(
        err.response?.data?.message || 
        err.message || 
        "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <Card className="w-full max-w-sm p-6 border-none shadow-none">
        <CardContent className="p-0">
          <div className="flex justify-center mb-6">
            <img 
              src={SPC} 
              alt="SPC Logo" 
              className="w-16 h-16 object-contain" 
            />
          </div>
          <h2 className="text-2xl font-bold text-center mb-1">
            Hey, welcome!
          </h2>
          <p className="text-sm text-center text-muted-foreground mb-6">
            Please provide your credentials
          </p>

          {error && (
            <p className="text-red-600 text-sm text-center mb-2">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <Input
              placeholder="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <div className="relative">
              <Input
                placeholder="Password (min 6 characters)"
                name="password"
                value={formData.password}
                onChange={handleChange}
                type={showPassword ? "text" : "password"}
                className="pr-10"
                required
                minLength={6}
              />
              <button
                type="button"
                className="absolute right-2 top-2.5 cursor-pointer text-muted-foreground"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div className="relative">
              <Input
                placeholder="Confirm Password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                type={showCPassword ? "text" : "password"}
                className="pr-10"
                required
                minLength={6}
              />
              <button
                type="button"
                className="absolute right-2 top-2.5 cursor-pointer text-muted-foreground"
                onClick={() => setShowCPassword(!showCPassword)}
              >
                {showCPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <Button
              type="submit"
              className="w-full bg-black text-white hover:bg-gray-900"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Sign up"}
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
            type="button"
          >
            <FcGoogle size={20} />
            Continue with Google
          </Button>

          <p className="text-center text-sm mt-4">
            Already have an account?{" "}
            <Link 
              to="/login" 
              className="text-blue-600 hover:underline"
            >
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUp;