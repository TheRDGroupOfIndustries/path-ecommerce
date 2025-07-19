import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/authContext";
import { ChevronLeft } from "lucide-react";
import React, { useState } from "react";
import { CiCamera } from "react-icons/ci";
import PROIFLE_IMAGE from "@/assets/user_img.png";
import axios from "axios";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { API_URL } from "@/lib/api.env";

const EditProfile = () => {
  const { user, setUser } = useAuth();
  const [selectedImage, setSelectedImage] = useState(null);

  const [previewUrl, setPreviewUrl] = useState(user?.imageUrl || PROIFLE_IMAGE);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
  });
  const handleGoBack = () => {
    window.history.back();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("phone", formData.phone);

      if (selectedImage) {
        payload.append("image", selectedImage);
      }
      const res = await axios.put(
        `${API_URL}/api/users/update-user/${user.id}`,
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Profile updated successfully");

      setUser({
        ...user,
        ...formData,
        imageUrl: selectedImage
          ? URL.createObjectURL(selectedImage)
          : user.imageUrl,
      });
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black ">
      {/* Header */}
      <div className="flex items-center h-14 mb-4 text-white gap-4 pt-4 pl-4">
        <ChevronLeft
          className="w-8 h-8 cursor-pointer"
          onClick={handleGoBack}
        />
        <h2 className="text-2xl text-start">Edit Profile</h2>
      </div>

      {/* Profile image */}
      <div className="text-white flex flex-col items-center text-center pb-8">
        <div className="relative w-32 h-32">
          <img
            src={previewUrl}
            alt="Profile"
            className="w-full h-full rounded-full object-cover"
          />
          <label
            htmlFor="profileImage"
            className="absolute bottom-1 right-1 bg-black p-1 rounded-full border border-white cursor-pointer"
          >
            <CiCamera className="w-5 h-5 text-white" />
          </label>
          <input
            type="file"
            id="profileImage"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-t-3xl px-4 text-black flex-1 flex flex-col">
        <form className="space-y-4 pt-10 flex-1" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              type="text"
              required
              className="bg-gray-200 py-6"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              name="phone"
              placeholder="Phone"
              type="text"
              required
              value={formData.phone}
              onChange={handleChange}
              className="bg-gray-200 py-6"
            />
          </div>

          <div className="mt-auto pt-6">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white py-4 rounded-lg flex items-center justify-center gap-2"
            >
              {isLoading ? "Updating..." : "Update Profile"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
