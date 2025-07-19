import React from "react";
import { Button } from "@/components/ui/button"; 
import { useNavigate } from "react-router-dom";

const EmptyCart = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 z-20">
      <img
        src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
        alt="Empty Cart"
        className="w-40 h-40 mb-6"
      />
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        Your Cart is Empty
      </h2>
      <p className="text-gray-500 mb-6">
        Looks like you haven’t added anything yet.
      </p>
      <Button
        onClick={() => navigate("/")}
        className="bg-indigo-600 text-white"
      >
        Go to Home
      </Button>
    </div>
  );
};

export default EmptyCart;
