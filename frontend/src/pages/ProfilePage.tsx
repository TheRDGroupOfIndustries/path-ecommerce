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
  ListTodo,
  LogOut,
  ExternalLink,
  MessageCircleWarning,
  Cable,
} from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PROIFLE_IMAGE from "@/assets/user_img.png";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleGoBack = () => {
    window.history.back();
  };

  const [open, setOpen] = useState(false);
  const handleConfirmLogout = () => {
    logout();
    navigate("/login");
  };
  // Define tab configs for each role
  const roleTabs = {
    USER: [
      {
        label: "Orders",
        icon: <ShoppingCart className="text-black font-bold" />,
        desc: "Check Your Orders",
        path: "/my-orders",
      },
      {
        label: "My Cart",
        icon: <ListTodo className="text-black font-bold" />,
        desc: "All cart Items",
        path: "/my-cart",
      },
      {
        label: "My Enquiries",
        icon: <MessageCircleWarning className="text-black font-bold" />,
        desc: "All Enquiries",
        path: "/my-enquiries",
      },
      {
        label: "Help Desk",
        icon: <Cable className="text-black font-bold" />,
        desc: "We're Here to Help",
        path: "/help-desk",
      },

      {
        label: "Settings",
        icon: <Settings className="text-black font-bold" />,
        desc: "Notifications, password",
        path: "/settings",
      },
    ],
    SELLER: [
      {
        label: "My Product",
        icon: <ShoppingBag className="text-black font-bold" />,
        desc: "View your products",
        path: "/product-list",
      },
      {
        label: "Orders",
        icon: <ShoppingCart className="text-black font-bold" />,
        desc: "Check Your Orders",
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
        desc: "Reviews for all items",
        path: "/my-reviews",
      },
      {
        label: "Manage Products",
        icon: <ExternalLink className="text-black font-bold" />,
        desc: "View your dashboard",
        path: "https://path-ecommerce.vercel.app",
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
        desc: "List of your ordered products",
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
        desc: "Reviews for all items",
        path: "/my-reviews",
      },
      {
        label: "View Dashboard",
        icon: <ExternalLink className="text-black font-bold" />,
        desc: "View your dashboard",
        path: "https://path-ecommerce.vercel.app",
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
    <div className="w-full  mx-auto flex flex-col mb-16 ">
      {/* Profile Header */}
      <ChevronLeft
        className=" absolute top-5 left-5  text-white cursor-pointer"
        onClick={handleGoBack}
        size={32}
      />
      <div className="bg-neutral-900 text-white flex flex-col items-center p-8 sm:p-4">
        <img
          src={user?.imageUrl || PROIFLE_IMAGE}
          alt="Profile"
          className="w-32 h-32   rounded-full object-cover"
        />
        <div className="items-center text-center">
          <h2 className="text-lg font-semibold">{user?.name}</h2>
          <p className="text-sm">{user?.role}</p>
        </div>
      </div>

      <div className="p-4 space-y-4 rounded-t-3xl bg-white py-8 sm:py-4">
        {tabs.map((tab) =>
          tab.path.startsWith("https://") ? (
            <a
              key={tab.label}
              href={tab.path}
              className="bg-gray-100 p-3 rounded-lg flex justify-between items-center cursor-pointer hover:bg-gray-200 no-underline"
            >
              <div className="flex items-center space-x-5">
                {tab.icon}
                <div>
                  <h3 className="text-lg text-black">{tab.label}</h3>
                  <p className="text-xs text-muted-foreground font-light">
                    {tab.desc}
                  </p>
                </div>
              </div>
              <span className="text-gray-500">
                <ChevronRight />
              </span>
            </a>
          ) : (
            <div
              key={tab.label}
              className="bg-gray-100 p-3 rounded-lg flex justify-between items-center cursor-pointer hover:bg-gray-200"
              onClick={() => navigate(tab.path)}
            >
              <div className="flex items-center space-x-5">
                {tab.icon}
                <div>
                  <h3 className="text-lg text-black">{tab.label}</h3>
                  <p className="text-xs text-muted-foreground font-light">
                    {tab.desc}
                  </p>
                </div>
              </div>
              <span className="text-gray-500">
                <ChevronRight />
              </span>
            </div>
          )
        )}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <div
              className="bg-gray-100 py-6 px-3 rounded-lg flex justify-between items-center cursor-pointer hover:bg-gray-200"
              onClick={() => setOpen(true)}
            >
              <div className="flex items-center space-x-5 text-red-800">
                <LogOut />
                <h3 className="text-lg">Log Out</h3>
              </div>
            </div>
          </DialogTrigger>

          <DialogContent className="sm:max-w-md ">
            <DialogHeader>
              <DialogTitle>Are you sure you want to log out?</DialogTitle>
              <DialogDescription>
                This action will end your current session.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex flex-row justify-center space-x-7 ">
              <Button
                variant="default"
                onClick={() => setOpen(false)}
                className="px-8"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                className="px-8"
                onClick={handleConfirmLogout}
              >
                Log Out
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ProfilePage;
