import {
  ChevronRight,
  Pencil,
  Mail,
  Lock,
  LogOut,
  ChevronLeft,
} from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="container mx-auto p-4 mb-6">
      <div className="flex items-center h-14 mb-4 text-black gap-4">
        <ChevronLeft
          className="w-6 h-6 cursor-pointer"
          onClick={handleGoBack}
        />
        <h2 className="text-2xl text-start">Settings</h2>
      </div>
      <div className=" flex flex-row items-center text-center gap-3 bg-gray-100 mb-10 px-3 py-4 rounded-lg">
        <img
          src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Profile"
          className="w-16 h-16 rounded-full object-cover"
        />
        <div className=" flex flex-col justify-start items-start text-black">
          <h2 className="text-lg  ">Adarsh Sharma</h2>
          <p className="text-sm">Role</p>
        </div>
      </div>

      <div className=" space-y-4 rounded-t-3xl bg-white">
        <div
          className="bg-gray-100 py-6 px-3 rounded-lg flex justify-between items-center cursor-pointer hover:bg-gray-200"
          onClick={() => navigate("/edit-profile")}
        >
          <div className="flex items-center space-x-5">
            <Pencil className="text-gray-600/70 font-bold" />
            <h3 className="text-lg text-black ">Edit Profile</h3>
          </div>
          <span className="text-gray-500">
            <ChevronRight />
          </span>
        </div>

        <div className="bg-gray-100 py-6 px-3 rounded-lg flex justify-between items-center cursor-pointer hover:bg-gray-200">
          <div className="flex items-center space-x-5">
            <Mail className="text-gray-600/70 font-bold" />
            <h3 className="text-lg text-black ">Change Email</h3>
          </div>
          <span className="text-gray-500">
            <ChevronRight />
          </span>
        </div>

        <div className="bg-gray-100 py-6 px-3 rounded-lg flex justify-between items-center cursor-pointer hover:bg-gray-200">
          <div className="flex items-center space-x-5">
            <Lock className="text-gray-600/70 font-bold" />
            <h3 className="text-lg  text-black ">Change Password</h3>
          </div>
          <span className="text-gray-500">
            <ChevronRight />
          </span>
        </div>

        <div className="bg-gray-100 py-6 px-3 rounded-lg flex justify-between items-center cursor-pointer hover:bg-gray-200">
          <div className="flex items-center space-x-5 text-red-800">
            <LogOut className="font-bold" />

            <h3 className="text-lg  ">Log Out</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
