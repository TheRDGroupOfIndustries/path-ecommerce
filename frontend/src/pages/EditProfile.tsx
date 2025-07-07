import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft } from "lucide-react";
import React from "react";
import { CiCamera } from "react-icons/ci";

const EditProfile = () => {
  const handleGoBack = () => {
    window.history.back();
  };
  return (
    <div className="flex flex-col min-h-screen bg-black ">
      {/* Header */}
      <div className="flex items-center h-14 mb-4 text-white gap-4 pt-4 pl-4">
        <ChevronLeft
          className="w-6 h-6 cursor-pointer"
          onClick={handleGoBack}
        />
        <h2 className="text-2xl text-start">Edit Profile</h2>
      </div>

      {/* Profile image */}
      <div className="text-white flex flex-col items-center text-center pb-8 ">
        <div className="relative w-32 h-32">
          <img
            src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0"
            alt="Profile"
            className="w-full h-full rounded-full object-cover"
          />
          <div className="absolute bottom-1 right-1 bg-black p-1 rounded-full border border-white">
            <CiCamera className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-t-3xl pt-10 pb-60 px-4 text-black space-y-4">
        <form className="space-y-4">
          <Label>Name</Label>
          <Input
            name="name"
            placeholder="Name"
            type="text"
            required
            className="bg-gray-200 py-6"
          />

          <Label>Number</Label>
          <Input
            name="number"
            placeholder="Number"
            type="number"
            required
            className="bg-gray-200 py-6"
          />
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
