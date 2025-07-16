import { LucidePackageCheck } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

function Thanks() {
  const navigate = useNavigate();
  return (
    <div className="w-screen h-screen flex justify-center items-center flex-col bg-[#2AD79A]">
      <LucidePackageCheck size={120} color="white" />
      <h1 className="text-4xl text-black font-black font-sans">Order Placed</h1>
      <h1 className="text-6xl text-white font-black font-sans">Shop More!</h1>
      <button
        className="px-6 py-2 rounded-full my-5 text-center bg-white text-[#2AD79A] text-base"
        onClick={() => navigate("/")}
      >
        Continue Shopping
      </button>
    </div>
  );
}

export default Thanks;
