
import { useAuth } from "@/context/authContext";
import {
  ChevronLeft,
  ChevronRight,
  MessageSquareText,
  NotepadText,
  Settings,
  ShoppingBag,
  ShoppingCart,
  Users,
  Megaphone,
} from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import PROIFLE_IMAGE from "@/assets/user_img.png";

const ProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const handleGoBack = () => {
    window.history.back();
  };

  // Define tab configs for each role
  const roleTabs = {
    USER: [
      {
        label: "Orders",
        icon: <ShoppingCart className="text-black font-bold" />,
        desc: "already have 10 orders",
        path: "/my-orders",
      },
      {
        label: "Settings",
        icon: <Settings className="text-black font-bold" />,
        desc: "Notifications, password",
        path: "/settings",
      },
    ],
    SELLER:[
      {
        label: "My Product",
        icon: <ShoppingBag className="text-black font-bold" />,
        desc: "Add New",
        path: "/product-list",
      },
      {
        label: "Orders",
        icon: <ShoppingCart className="text-black font-bold" />,
        desc: "already have 10 orders",
        path: "/my-orders",
      },
      {
        label: "Enquire",
        icon: <NotepadText className="text-black font-bold" />,
        desc: "Enquire special promocomodes",
        path: "/all-enquires",
      },
      {
        label: "My Reviews",
        icon: <MessageSquareText className="text-black font-bold" />,
        desc: "Reviews for 4 items",
        path: "/my-reviews",
      },
      {
        label: "Settings",
        icon: <Settings className="text-black font-bold" />,
        desc: "Notifications, password",
        path: "/settings",
      },
    ],
    ADMIN: [
      {
        label: "My Product",
        icon: <ShoppingBag className="text-black font-bold" />,
        desc: "Add New",
        path: "/product-list",
      },
      {
        label: "Orders",
        icon: <ShoppingCart className="text-black font-bold" />,
        desc: "already have 10 orders",
        path: "/my-orders",
      },
      {
        label: "Enquire",
        icon: <NotepadText className="text-black font-bold" />,
        desc: "Enquire special promocomodes",
        path: "/all-enquires",
      },
      {
        label: "My Reviews",
        icon: <MessageSquareText className="text-black font-bold" />,
        desc: "Reviews for 4 items",
        path: "/my-reviews",
      },
      {
        label: "Settings",
        icon: <Settings className="text-black font-bold" />,
        desc: "Notifications, password",
        path: "/settings",
      },
    ],
    ASSOCIATE: [
      {
        label: "My Referrals",
        icon: <Users className="text-black font-bold" />,
        desc: "Track your referrals",
        path: "/my-referrals",
      },
      {
        label: "Announcements",
        icon: <Megaphone className="text-black font-bold" />,
        desc: "Latest updates",
        path: "/announcements",
      },
      {
        label: "Settings",
        icon: <Settings className="text-black font-bold" />,
        desc: "Notifications, password",
        path: "/settings",
      },
    ],
  };

 
  const tabs = roleTabs[user?.role] || [];

  return (
    <div className="flex flex-col bg-black h-1/2 mb-10">
      {/* Profile Header */}
      <ChevronLeft
        className=" absolute top-5 left-5  text-white cursor-pointer"
        onClick={handleGoBack}
        size={32}
      />
      <div className=" bg-black text-white p-10 flex flex-col items-center text-center gap-3">
        <img
          src={user?.imageUrl || PROIFLE_IMAGE}
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover"
        />
        <div className="items-center text-center">
          <h2 className="text-lg font-semibold">{user?.name}</h2>
          <p className="text-sm">{user?.role}</p>
        </div>
      </div>

      <div className="p-4 space-y-4 rounded-t-3xl bg-white py-16 h-1/2">
        {tabs.map((tab) => (
          <div
            key={tab.label}
            className="bg-gray-100 p-3 rounded-lg flex justify-between items-center cursor-pointer hover:bg-gray-200"
            onClick={() => navigate(tab.path)}
          >
            <div className="flex items-center space-x-5">
              {tab.icon}
              <div>
                <h3 className="text-lg text-black ">{tab.label}</h3>
                <p className="text-xs text-muted-foreground font-light">
                  {tab.desc}
                </p>
              </div>
            </div>
            <span className="text-gray-500">
              <ChevronRight />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfilePage;
