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
        label: "Support Response",
        icon: <Cable className="text-black font-bold" />,
        desc: "Your Replies for Queries",
        path: "/support-response",
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
        label: "My Cart",
        icon: <ListTodo className="text-black font-bold" />,
        desc: "All cart Items",
        path: "/my-cart",
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
    <div className="w-full  mx-auto flex flex-col md:mb-0 mb-16 ">
      {/* Profile Header */}
      <ChevronLeft
        className=" absolute top-5 left-5  text-white cursor-pointer"
        onClick={handleGoBack}
        size={32}
      />
      <div className="bg-neutral-900 text-white flex flex-col items-center p-8 sm:p-4 gap-2">
        <img
          src={user?.imageUrl || PROIFLE_IMAGE}
          alt="Profile"
          className="w-32 h-32   rounded-full object-cover"
        />
        <div className="items-center text-center">
          <h2 className="text-lg  sm:text-2xl font-semibold">{user?.name}</h2>
          <p className="text-sm sm:text-xl">{user?.role}</p>
        </div>
      </div>

   
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 sm:gap-4 p-4 space-y-4 rounded-t-3xl bg-white py-8 sm:py-4">
        {tabs.map((tab) =>
          tab.path.startsWith("https://") ? (
            <a
              key={tab.label}
              href={tab.path}
              className="bg-gray-100 p-3 sm:p-4 lg:p-6 rounded-lg flex justify-between items-center cursor-pointer hover:bg-gray-200 no-underline"
              style={{ height: "auto", minHeight: "4.5rem" }}
            >
              <div className="flex items-center space-x-5">
                {tab.icon}
                <div>
                  <h3 className="text-lg sm:text-xl lg:text-lg text-black">
                    {tab.label}
                  </h3>
                  <p className="text-xs sm:text-sm lg:text-base text-muted-foreground font-light">
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
              className="bg-gray-100 p-3 sm:p-4 lg:p-6 rounded-lg flex justify-between items-center cursor-pointer hover:bg-gray-200"
              onClick={() => navigate(tab.path)}
              style={{ height: "auto", minHeight: "4.5rem" }}
            >
              <div className="flex items-center space-x-5">
                {tab.icon}
                <div>
                  <h3 className="text-lg sm:text-xl lg:text-lg text-black">
                    {tab.label}
                  </h3>
                  <p className="text-xs sm:text-sm lg:text-base text-muted-foreground font-light">
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

        {/* Logout dialog trigger */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <div
              className="bg-gray-100 p-3 sm:p-4 lg:p-6 rounded-lg flex justify-between items-center cursor-pointer hover:bg-gray-200 lg:h-26 h-18"
              onClick={() => setOpen(true)}
            >
              <div className="flex items-center space-x-5 text-red-800">
                <LogOut />
                <h3 className="text-lg sm:text-xl lg:text-2xl">Log Out</h3>
              </div>
            </div>
          </DialogTrigger>

          <DialogContent className="sm:max-w-md" showCloseButton={false}>
            <DialogHeader>
              <DialogTitle>Are you sure you want to log out?</DialogTitle>
              <DialogDescription>
                This action will end your current session.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex flex-row justify-center space-x-7">
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
