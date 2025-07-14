import { Button } from "@/components/ui/button";
import { API_URL } from "@/lib/api.env";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function ForgetPass() {
  const [isLoading, setLoading] = useState(false);
  const [value, setValue] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(0);
  const [step, setStep] = useState(0);
  const [error, setError] = useState({
    state: false,
    message: "",
  });

  const navigate = useNavigate()

  async function genOtp() {
    let minm = 10000;
    let maxm = 99999;
    let number = Math.floor(Math.random() * (maxm - minm + 1)) + minm;
    setOtp(number);
    try {
      setLoading(true);
      setError((prev) => ({ ...prev, state: false, message: "" }));
      const req = await axios.get(`${API_URL}/api/users/get-by-value/${value}`);
      if (req.status === 400) {
        setError((prev) => ({
          ...prev,
          state: true,
          message: "user doesn't exist with this value.",
        }));
        setLoading(false);
        return;
      }

      if (req.status === 200) {
        setEmail(value)
        const sendOtp = await axios.post(
          `${API_URL}/api/verification/send-otp`,
          {
            value: value,
            otp: Number(number),
          }
        );
        if (sendOtp.status === 400) {
          setError((prev) => ({
            ...prev,
            state: true,
            message: "Cannot send otp, please try again later",
          }));
          return;
        }
        if (sendOtp.status === 200) {
          setStep(1);
          setValue("");
          setLoading(false);
          return;
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

    function VerifyOTP() {
    const inp = Number(value)
    if (inp === otp) {
        setStep(2)
        setValue("")
    }
  }
  async function setNewPassword() {
    const val = value.trim()
    if (val === "") {
        setError((prev) => ({
            ...prev,
            state: true,
            message: "Please Type something?",
          }));
        return
    }
    const req = await axios.put(`${API_URL}/api/users/update-password/${email}`, {
        password: value
    })

    if (req.status === 200) {
        alert("Password Changed!")
        navigate("/login")
    }
  }

  return (
    <div className="w-screen h-screen flex justify-center px-4 flex-col">
      <div>
        <h1 className="text-2xl font-bold text-black font-sans text-left">
          Recover Your Password
        </h1>
        <p className="text-sm text-gray-400">
          You can easily recover your password just with simple steps
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-4">
        <input
          required
          type={`${step === 1 ? "number" : "text"}`}
          className="w-full py-4 px-4 rounded-xl outline-none border-none text-sm bg-gray-200"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={`${step === 0 ? "Your Email Address" : step === 1 ? "Verify OTP" : "New Password"}`}
        />
        {error.state && <p className="text-red-800 text-sm">{error.message}</p>}
        <Button
          onClick={step === 0 ? () => genOtp() : step === 1 ? () => VerifyOTP() : () => setNewPassword()}
          type="submit"
          disabled={isLoading}
          className="w-full text-white py-7 text-lg rounded-xl
              primary-bg
              "
        >
          {isLoading ? "..." : step === 0 ? "Send OTP" : step === 1 ? "Verify" : "Set Password"}
        </Button>
      </div>
    </div>
  );
}

export default ForgetPass;
