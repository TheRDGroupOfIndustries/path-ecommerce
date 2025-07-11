import { useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/authContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ChangePassword() {
  const { user } = useAuth();
  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const res = await axios.put(
        `http://localhost:8000/api/users/update-user/${user.id}`,
        {
          password: form.password,
        }
      );
      console.log("res: ", res);

      toast.success("Password updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update password");
    }
  };

  return (
    <div className="container mx-auto p-4 mb-6">
      <div className="flex items-center h-14 mb-4 text-black gap-4">
        <ChevronLeft
          className="w-8 h-8 cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <h2 className="text-2xl text-start">Update Password</h2>
      </div>
      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password">New Password</Label>
          <Input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            className="bg-gray-200 py-6"
          />
        </div>
        <div className="space-y-2">
          <Label  htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            className="bg-gray-200 py-6"
          />
        </div>
        <Button type="submit" className="bg-black text-white py-4">
          Update Password
        </Button>
      </form>
    </div>
  );
}
