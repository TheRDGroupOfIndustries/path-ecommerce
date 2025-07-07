import {
  ChevronLeft,
  ChevronRight,
  MessageSquareText,
  NotepadText,
  Settings,
  ShoppingBag,
  ShoppingCart,
} from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const navigate = useNavigate();
  const handleGoBack = () => {
    window.history.back();
  };
  return (
    <div className="flex flex-col bg-black ">
      {/* Profile Header */}
      <ChevronLeft
        className=" absolute top-5 left-5  text-white cursor-pointer"
        onClick={handleGoBack}
        size={32}
      />
      <div className=" bg-black text-white p-10 flex flex-col items-center text-center gap-3">
        <img
          src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover"
        />
        <div className="items-center text-center">
          <h2 className="text-lg font-semibold">Adarsh Sharma</h2>
          <p className="text-sm">Role</p>
        </div>
      </div>

      <div className="p-4 space-y-4 rounded-t-3xl bg-white py-16">
        <div
          className="bg-gray-100 p-3 rounded-lg flex justify-between items-center cursor-pointer hover:bg-gray-200"
          onClick={() => navigate("/product-list")}
        >
          <div className="flex items-center space-x-5">
            <ShoppingBag className="text-black font-bold" />
            <div>
              <h3 className="text-lg text-black ">My Product</h3>
              <p className="text-xs text-muted-foreground font-light">
                Add New
              </p>
            </div>
          </div>
          <span className="text-gray-500">
            <ChevronRight />
          </span>
        </div>

        <div
          className="bg-gray-100 p-3 rounded-lg flex justify-between items-center cursor-pointer hover:bg-gray-200"
          onClick={() => navigate("/my-orders")}
        >
          <div className="flex items-center space-x-5">
            <ShoppingCart className="text-black font-bold" />
            <div>
              <h3 className="text-lg text-black ">Orders</h3>
              <p className="text-xs text-muted-foreground font-light">
                already have 10 orders
              </p>
            </div>
          </div>
          <span className="text-gray-500">
            <ChevronRight />
          </span>
        </div>

        <div className="bg-gray-100 p-3 rounded-lg flex justify-between items-center cursor-pointer hover:bg-gray-200">
          <div className="flex items-center space-x-5">
            <NotepadText className="text-black font-bold" />
            <div>
              <h3 className="text-lg text-black ">Enquire</h3>
              <p className="text-xs text-muted-foreground font-light">
                Enquire special promocomodes
              </p>
            </div>
          </div>
          <span className="text-gray-500">
            <ChevronRight />
          </span>
        </div>

        <div className="bg-gray-100 p-3 rounded-lg flex justify-between items-center cursor-pointer hover:bg-gray-200">
          <div className="flex items-center space-x-5">
            <MessageSquareText className="text-black font-bold" />
            <div>
              <h3 className="text-lg text-black ">My Reviews</h3>
              <p className="text-xs text-muted-foreground font-light">
                Reviews for 4 items
              </p>
            </div>
          </div>
          <span className="text-gray-500">
            <ChevronRight />
          </span>
        </div>
        <div
          className="bg-gray-100 p-3 rounded-lg flex justify-between items-center cursor-pointer hover:bg-gray-200"
          onClick={() => navigate("/settings")}
        >
          <div className="flex items-center space-x-5">
            <Settings className="text-black font-bold" />
            <div>
              <h3 className="text-lg text-black ">Settings</h3>
              <p className="text-xs text-muted-foreground font-light">
                Notifications, password
              </p>
            </div>
          </div>
          <span className="text-gray-500">
            <ChevronRight />
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
