import { useAuth } from "@/context/authContext";
import { ChevronRight, Pencil, Mail, Lock, ChevronLeft } from "lucide-react";

import { useNavigate } from "react-router-dom";
import PROIFLE_IMAGE from "@/assets/user_img.png";
const Settings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="container mx-auto p-4 mb-6">
      <div className="flex items-center h-14 mb-4 text-black gap-4">
        <ChevronLeft
          className="w-8 h-8 cursor-pointer"
          onClick={handleGoBack}
        />
        <h2 className="text-2xl text-start">Settings</h2>
      </div>
      <div className=" flex flex-row items-center text-center gap-3 bg-gray-100 mb-10 px-3 py-4 rounded-lg">
        <img
          src={user?.imageUrl || PROIFLE_IMAGE}
          alt="Profile"
          className="w-16 h-16 rounded-full object-cover"
        />
        <div className=" flex flex-col justify-start items-start text-black">
          <h2 className="text-lg  ">{user?.name}</h2>
          <p className="text-sm">{user?.role}</p>
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

        <div
          className="bg-gray-100 py-6 px-3 rounded-lg flex justify-between items-center cursor-pointer hover:bg-gray-200"
          onClick={() => navigate("/change-email")}
        >
          <div className="flex items-center space-x-5">
            <Mail className="text-gray-600/70 font-bold" />
            <h3 className="text-lg text-black ">Change Email</h3>
          </div>
          <span className="text-gray-500">
            <ChevronRight />
          </span>
        </div>

        <div
          className="bg-gray-100 py-6 px-3 rounded-lg flex justify-between items-center cursor-pointer hover:bg-gray-200"
          onClick={() => navigate("/change-password")}
        >
          <div className="flex items-center space-x-5">
            <Lock className="text-gray-600/70 font-bold" />
            <h3 className="text-lg  text-black ">Change Password</h3>
          </div>
          <span className="text-gray-500">
            <ChevronRight />
          </span>
        </div>
      </div>
    </div>
  );
};

export default Settings;
