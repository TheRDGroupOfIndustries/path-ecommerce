import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { API_URL } from "@/lib/api.env";

const SendEnquire = ({ setShowPopup, type, id }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [responseMsg, setResponseMsg] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSend = async () => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.message ||
      !formData.subject ||
      !formData.phone
    ) {
      setResponseMsg("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...formData,
        marketplaceId: type === "marketplace" ? id : null,
        propertyId: type !== "marketplace" ? id : null,
      };

      const res = await axios.post(
        `${API_URL}/api/enquiry`,
        payload
      );
      toast.success("Enquiry sent successfully!");
      // console.log("Send: ",res);

      setResponseMsg("Enquiry sent successfully!");
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });

      setTimeout(() => {
        setShowPopup(false);
        setResponseMsg("");
      }, 1000);
    } catch (err) {
      console.error("Enquiry failed:", err);
      setResponseMsg("Failed to send enquiry. Try again later.");
      toast.error("Failed to send enquiry. Try again later.");
    }
    setLoading(false);
  };

  return (
    <div
      className="fixed inset-0 z-70 flex items-end justify-center bg-black/40"
      onClick={() => setShowPopup(false)}
    >
      <div
        className="primary-bg-dark text-white w-full max-w-md rounded-t-4xl p-6 h-[90vh] overflow-auto animate-slide-up flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-bold">Hey!</h2>
        </div>

        <p className="mb-4 text-lg font-light">
          Feel Free to ask anything about this{" "}
          {type === "marketplace" ? "service" : "property"}!
        </p>

        <div className="flex flex-col gap-4 mb-4">
          <Input
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="Full name"
            className="w-full p-4 py-7 bg-white/20 text-white rounded-lg border-none font-light placeholder:text-white/50"
          />
          <Input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your email"
            className="w-full p-4 py-7 bg-white/20 text-white rounded-lg border-none font-light placeholder:text-white/50"
          />
          <Input
            name="phone"
            type="text"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone number"
            className="w-full p-4 py-7 bg-white/20 text-white rounded-lg border-none font-light placeholder:text-white/50"
          />
          <Input
            name="subject"
            type="text"
            value={formData.subject}
            onChange={handleChange}
            placeholder="Subject"
            className="w-full p-4 py-7 bg-white/20 text-white rounded-lg border-none font-light placeholder:text-white/50"
          />
          <Textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Your message..."
            className="w-full p-4 py-4 h-32 bg-white/20 text-white rounded-lg resize-none border-none font-light placeholder:text-white/50"
          />
        </div>

        {responseMsg && (
          <p className="text-sm mb-2 text-center">{responseMsg}</p>
        )}

        <Button
          disabled={loading}
          onClick={handleSend}
          className="w-full bg-white text-black py-2 rounded-2xl border-none mt-auto hover:text-white"
        >
          {loading ? "Sending..." : "Send Enquiry"}
        </Button>
      </div>
    </div>
  );
};

export default SendEnquire;
