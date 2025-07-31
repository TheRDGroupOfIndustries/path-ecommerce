import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import SPC from "@/assets/SPC.jpg";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/authContext";
import { FaGoogle } from "react-icons/fa";
import { API_URL } from "@/lib/api.env";
import axios from "axios";

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  referralCode?: string;
  image?:File;
}

const SignUp = () => {
  const { register } = useAuth();
  // console.log("register: ",register);

  const navigate = useNavigate();

  const [referralStatus, setReferralStatus] = useState<null | "valid" | "invalid">(null);
  const [referralMessage, setReferralMessage] = useState("");

  const [showReferralInput, setShowReferralInput] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    referralCode: "",
  });
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

 const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));
};

const validateReferralCode = async () => {
  if (!formData.referralCode.trim()) return;

  try {
    const res = await fetch(`${API_URL}/api/referral/validate/${formData.referralCode}`);
    const data = await res.json();

    if (data.valid) {
      setReferralStatus("valid");
      setReferralMessage("Referral code is valid ✅");
    } else {
      setReferralStatus("invalid");
      setReferralMessage("Invalid referral code ❌");
    }
  } catch (err) {
    setReferralStatus("invalid");
    setReferralMessage("Error validating referral code ❌");
  }
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

  // OTP VERIFICATION.
  const [otp, setOtp] = useState(0);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [otpValue, setOtpValue] = useState("");

  async function genOtp(e: React.FormEvent) {
    e.preventDefault();
    let minm = 10000;
    let maxm = 99999;
    let number = Math.floor(Math.random() * (maxm - minm + 1)) + minm;
    setOtp(number);
    setLoading(true);
    try {
      setError("");
      const sendOtp = await axios.post(`${API_URL}/api/verification/send-otp`, {
        email: formData.email,
        otp: Number(number),
      });
      if (sendOtp.status === 400) {
        setError("Unable to send OTP, Try again later...");
        setLoading(false);
        return;
      }
      if (sendOtp.status === 200) {
        setStep(1);
        setLoading(false);
        return;
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  function VerifyOTP(e: React.FormEvent) {
    e.preventDefault();
    const inp = Number(otpValue);
    if (inp === otp) {
      setStep(2);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    if (
  formData.referralCode?.trim() &&
      referralStatus === "invalid"
    ) {
      setError("Please enter a valid referral code.");
      return;
    }


    setIsLoading(true);

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        referralCode: formData.referralCode?.trim(),
      });

      navigate("/login");
    } catch (err: any) {
      setError(
          "Ops, Its not you, Its us, Please try again a bit later."
      );
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <Card className="w-full max-w-md  p-4 border-none shadow-none">
        <CardContent className="p-0">
          <div className="flex justify-center mb-6">
            <img
              src={SPC}
              alt="SPC Logo"
              className="w-20 h-20 object-contain"
            />
          </div>
          <h2 className="text-3xl font-bold text-left mb-1">Hey, welcome!</h2>
          <p className="text-sm text-left text-muted-foreground mb-6">
            Please provide your credentials
          </p>

          {error && (
            <p className="text-red-600 text-sm text-center mb-2">{error}</p>
          )}

          <form
            onSubmit={
              step === 0 ? genOtp : step === 1 ? VerifyOTP : handleSubmit
            }
            className="space-y-4"
          >
            <Input
              placeholder="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="py-6"
            />
            <Input
              placeholder="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="py-6"
            />


            {step === 0 ? (
              <></>
            ) : step === 1 ? (
              <div className="relative">
                <Input
                  placeholder="Enter OTP"
                  name="OTP"
                  value={otpValue}
                  onChange={(e) => setOtpValue(e.target.value)}
                  type="number"
                  className="pr-10 py-6"
                  required
                  minLength={5}
                />
              </div>
            ) : (
              <>
                <div className="relative">
                  <Input
                    placeholder="Password (min 6 characters)"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    type={showPassword ? "text" : "password"}
                    className="pr-10 py-6"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3.5 cursor-pointer text-black"
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
                    className="pr-10 py-6"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3.5 cursor-pointer text-black"
                    onClick={() => setShowCPassword(!showCPassword)}
                  >
                    {showCPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/*  Referral Toggle */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="referralToggle"
                checked={showReferralInput}
                onChange={() => setShowReferralInput(!showReferralInput)}
              />
              <label htmlFor="referralToggle" className="text-sm">
                I have a referral code
              </label>
            </div>

            {/* Referral Input (conditionally shown) */}
            {showReferralInput && (
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Input
                    type="text"
                    placeholder="Referral Code"
                    name="referralCode"
                    value={formData.referralCode}
                    onChange={handleChange}
                    className="py-6 flex-1"
                  />
                  <button
                    type="button"
                    onClick={validateReferralCode}
                    className="bg-blue-600 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-700 transition"
                  >
                    Check
                  </button>
                </div>

                {referralStatus && (
                  <p className={`text-sm ${referralStatus === "valid" ? "text-green-600" : "text-red-600"}`}>
                    {referralMessage}
                  </p>
                )}
              </div>
            )}


              </>
            )}

            <Button
              type="submit"
              className="w-full bg-black text-white hover:bg-gray-900 py-7 text-xl primary-bg cursor-pointer"
              disabled={loading}
            >
            {
              loading && step === 0 ? "Generating OTP..." :
              loading && step === 1 ? "Verifying OTP..." :
              loading && step === 2 ? "Signing up..." :
                step === 0
                ? "Send OTP"
                : step === 1
                ? "Verify"
                : "Sign up"}
              {/* {isLoading ? "Creating account..." : "Sign up"} */}
            </Button>
          </form>

{
  /*
          <div className="flex flex-col items-center mt-8">
            <Button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                window.location.href = `${API_URL}/api/users/auth/google`;
              }}
              className="bg-white text-black rounded-full border-2 p-5 flex items-center justify-center hover:bg-gray-900"
            >
              <FaGoogle size={36} />
            </Button>
            <span className="text-sm text-black mt-2 font-semibold">
              Google
            </span>
          </div>
  */
}
          <div className="flex items-center my-4">
            <div className="flex-grow border-t-2" />
          </div>
          <p className="text-center text-sm mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-black underline">
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUp;


