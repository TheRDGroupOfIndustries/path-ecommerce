

import { Search } from "lucide-react";
import React from "react";
import { useAuth } from "@/context/authContext";
import PROIFLE_IMAGE from "@/assets/user_img.png";
import { useNavigate } from "react-router-dom";


const ProfileHeader = ({type}: {
  type?: string
}) => {
  const { user } = useAuth(); 

  const navigation = useNavigate()
  return (
    <div className="md:hidden">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <img
            src={user?.imageUrl||PROIFLE_IMAGE}
            alt="User"
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="leading-tight">
            <p className="text-sm text-muted-foreground">Hey,</p>
            <p className="text-lg font-semibold text-black">
              {user?.name || "Guest"}
            </p>
          </div>
        </div>

        <button onClick={() => navigation(`/search/${type}`)} className="p-4 primary-bg text-white rounded-full flex items-center justify-center">
          <Search size={20} />
        </button>
      </div>

      <div className="relative w-2/4 md:w-3/12 mt-4">
        <div className="w-full h-0.5 bg-black relative">
          <div className="w-3 h-3 bg-black rounded-full absolute -bottom-1 -right-1"></div>
        </div>
      </div>
   </div>
  );
};

export default ProfileHeader;
