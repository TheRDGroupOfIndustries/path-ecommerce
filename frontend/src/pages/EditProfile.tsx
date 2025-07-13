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
import { API_URL } from "@/lib/api.temp";

const EditProfile = () => {
  const { user, setUser } = useAuth();
  const [selectedImage, setSelectedImage] = useState(null);

  const [previewUrl, setPreviewUrl] = useState(user?.imageUrl || PROIFLE_IMAGE);
  const [isLoading, setIsLoading] = useState(false);

  // console.log(user.id);

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
      setPreviewUrl(URL.createObjectURL(file)); // show preview
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
      console.log("res: ", res);

      toast.success("Profile updated successfully");

      // 👇 Update context
      setUser({
        ...user,
        ...formData,
        imageUrl: selectedImage
          ? URL.createObjectURL(selectedImage)
          : user.imageUrl,
      });
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update profile"); // optional
    } finally {
      setIsLoading(false); // ✅ Stop loading
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
      {/* <div className="text-white flex flex-col items-center text-center pb-8 ">
        <div className="relative w-32 h-32">
          <img
            src={user.imageUrl || PROIFLE_IMAGE}
            alt="Profile"
            className="w-full h-full rounded-full object-cover"
          />
          <div className="absolute bottom-1 right-1 bg-black p-1 rounded-full border border-white">
            <CiCamera className="w-5 h-5 text-white" />
          </div>
        </div>
      </div> */}

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
      <div className="bg-white rounded-t-3xl pt-10 pb-60 px-4 text-black space-y-4">
        <form className="space-y-4" onSubmit={handleSubmit}>
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

          <Button
            type="submit"
            disabled={isLoading}
            className="w-fit mt-3 bg-black text-white py-4 rounded-lg flex items-center justify-center gap-2 px-6"
          >
            {isLoading ? "Updating..." : "Update Profile"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;

// const EditProfile = () => {
//   const { user, setUser } = useAuth();
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [previewUrl, setPreviewUrl] = useState(user?.imageUrl || PROIFLE_IMAGE);
//   const [formData, setFormData] = useState({
//     name: user?.name || "",
//     phone: user?.phone || "",
//     imageUrl: user?.imageUrl || "", // for testing
//   });

//   const handleGoBack = () => {
//     window.history.back();
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setSelectedImage(file);
//       setPreviewUrl(URL.createObjectURL(file));
//       setFormData((prev) => ({ ...prev, imageUrl: "" })); // Clear URL if file selected
//     }
//   };

//   // Use this image for preview and upload
//   const getImageForUpload = () => {
//     if (selectedImage) return selectedImage;
//     if (formData.imageUrl) return formData.imageUrl;
//     // fallback
//     return "";
//   };

//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();
//   //   try {
//   //     const payload = new FormData();
//   //     payload.append("name", formData.name);
//   //     payload.append("phone", formData.phone);

//   //     const imageForUpload = getImageForUpload();
//   //     if (typeof imageForUpload === "string") {
//   //       payload.append("imageUrl", imageForUpload); // pasted image URL
//   //     } else {
//   //       payload.append("image", imageForUpload); // actual image file
//   //     }

//   //     await axios.put(
//   //       `${API_URL}/api/users/update-user/${user.id}`,
//   //       payload,
//   //       {
//   //         headers: {
//   //           "Content-Type": "multipart/form-data",
//   //         },
//   //       }
//   //     );

//   //     toast.success("Profile updated successfully");

//   //     setUser({
//   //       ...user,
//   //       ...formData,
//   //       imageUrl:
//   //         formData.imageUrl || (selectedImage ? previewUrl : user.imageUrl),
//   //     });
//   //   } catch (error) {
//   //     console.error("Error updating user:", error);
//   //     toast.error("Failed to update profile");
//   //   }
//   // };

// const handleSubmit = async (e) => {
//   e.preventDefault();
//   try {
//     await axios.put(
//       `${API_URL}/api/users/update-user/${user.id}`,
//       formData
//     );

//     setUser({ ...user, ...formData }); // update frontend user context

//     toast.success("Profile updated successfully");
//   } catch (error) {
//     console.error("Error updating user:", error);
//     toast.error("Failed to update profile");
//   }
// };
//   return (
//     <div className="flex flex-col min-h-screen bg-black ">
//       {/* Header */}
//       <div className="flex items-center h-14 mb-4 text-white gap-4 pt-4 pl-4">
//         <ChevronLeft
//           className="w-6 h-6 cursor-pointer"
//           onClick={handleGoBack}
//         />
//         <h2 className="text-2xl text-start">Edit Profile</h2>
//       </div>

//       {/* Profile image preview */}
//       <div className="text-white flex flex-col items-center text-center pb-8">
//         {/* <div className="relative w-32 h-32">
//           <img
//             src={formData.imageUrl || previewUrl}
//             alt="Profile"
//             className="w-full h-full rounded-full object-cover"
//           />
//           <label
//             htmlFor="profileImage"
//             className="absolute bottom-1 right-1 bg-black p-1 rounded-full border border-white cursor-pointer"
//           >
//             <CiCamera className="w-5 h-5 text-white" />
//           </label>
//           <input
//             type="file"
//             id="profileImage"
//             accept="image/*"
//             onChange={handleImageChange}
//             className="hidden"
//           />
//         </div> */}
//         <div className="relative w-32 h-32 mx-auto">
//   <img
//     src={formData.imageUrl || PROIFLE_IMAGE}
//     alt="Profile"
//     className="w-full h-full rounded-full object-cover"
//   />
// </div>

// <div className="my-4">
//   <Label htmlFor="imageUrl">Profile Image URL</Label>
//   <Input
//     name="imageUrl"
//     placeholder="Paste image URL here"
//     value={formData.imageUrl}
//     onChange={(e) =>
//       setFormData((prev) => ({ ...prev, imageUrl: e.target.value }))
//     }
//     type="text"
//     className="bg-gray-200 py-6"
//   />
// </div>

//       </div>

//       {/* Image URL input for testing */}

//       {/* Form */}
//       <div className="bg-white rounded-t-3xl pt-10 pb-60 px-4 text-black space-y-4">
//         <form className="space-y-4" onSubmit={handleSubmit}>
//           <div>
//             <Label htmlFor="name">Name</Label>
//             <Input
//               name="name"
//               placeholder="Name"
//               value={formData.name}
//               onChange={handleChange}
//               type="text"
//               required
//               className="bg-gray-200 py-6"
//             />
//           </div>

//           <div>
//             <Label htmlFor="phone">Number</Label>
//             <Input
//               name="phone"
//               placeholder="Phone"
//               type="text"
//               required
//               value={formData.phone}
//               onChange={handleChange}
//               className="bg-gray-200 py-6"
//             />
//           </div>

//           <Button
//             type="submit"
//             className="w-fit mt-3 bg-black text-white py-4 rounded-lg"
//           >
//             Update Profile
//           </Button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default EditProfile;
