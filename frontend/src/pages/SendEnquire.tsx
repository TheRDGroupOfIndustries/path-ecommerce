// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { toast } from "react-hot-toast";
// import { API_URL } from "@/lib/api.env";
// import { useAuth } from "@/context/authContext";

// const SendEnquire = ({ setShowPopup, type, id }) => {
//   const { user } = useAuth();
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     subject: "",
//     message: "",
//     referralCode: "",
//   });
//   const [referralValid, setReferralValid] = useState(null); // true | false | null
//   const [checkingReferral, setCheckingReferral] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [responseMsg, setResponseMsg] = useState("");

//   useEffect(() => {
//     if (user) {
//       setFormData((prev) => ({
//         ...prev,
//         name: user.name || "",
//         email: user.email || "",
//       }));
//     }
//   }, [user]);
//   const handleChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };
//   const handleSend = async () => {
//     const phoneRegex = /^[6-9]\d{9}$/;
//     if (!formData.message || !formData.subject || !formData.phone) {
//       setResponseMsg("Please fill in all required fields.");
//       toast.error("Please fill in all required fields.");

//       return;
//     }
//     if (!phoneRegex.test(formData.phone)) {
//       toast.error("Please enter a valid 10-digit phone number.");
//       return;
//     }

//     setLoading(true);

//     try {
//       const payload = {
//         ...formData,
//         marketplaceId: type === "marketplace" ? id : null,
//         propertyId: type !== "marketplace" ? id : null,
//         referralCode: formData.referralCode || null,
//       };

//       await axios.post(`${API_URL}/api/enquiry`, payload);
//       toast.success("Enquiry sent successfully!");
//       // console.log("Send: ",res);

//       setResponseMsg("Enquiry sent successfully!");
//       setFormData({
//         name: user?.name || "",
//         email: user?.email || "",
//         phone: "",
//         subject: "",
//         message: "",
//         referralCode: "",
//       });

//       setTimeout(() => {
//         setShowPopup(false);
//         setResponseMsg("");
//       }, 1000);
//     } catch (err) {
//       console.error("Enquiry failed:", err);

//       const errorMsg =
//         err?.response?.data?.error ||
//         "Failed to send enquiry. Try again later.";

//       toast.error(errorMsg);
//       setResponseMsg(errorMsg);
//     }
//     setLoading(false);
//   };
//   const handleCheckReferral = async () => {
//     if (!formData.referralCode) {
//       toast.error("Please enter a referral code to check.");
//       return;
//     }

//     try {
//       setCheckingReferral(true);
//       const res = await fetch(
//         `${API_URL}/api/referral/validate/${formData.referralCode}`
//       );
//       const data = await res.json();
//       console.log("data", data);

//       if (data.valid) {
//         setReferralValid(true);
//         toast.success("Referral code is valid!");
//       } else {
//         setReferralValid(false);
//         toast.error(data.error || "Invalid referral code.");
//       }
//     } catch (error) {
//       console.error("Referral check failed:", error);
//       setReferralValid(false);
//       toast.error("Something went wrong while checking referral code.");
//     } finally {
//       setCheckingReferral(false);
//     }
//   };

//   return (
//     <div
//       className="fixed inset-0 z-70 flex items-end justify-center bg-black/40 "
//       onClick={() => setShowPopup(false)}
//     >
//       <div
//         className=" primary-bg-dark text-white w-full sm:max-w-lg md:max-w-xl rounded-t-3xl p-4 sm:p-6 h-[90vh] overflow-auto animate-slide-up flex flex-col"
//         onClick={(e) => e.stopPropagation()}
//         style={{
//           scrollbarWidth: "none",
//           msOverflowStyle: "none",
//         }}
//       >
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-2xl sm:text-3xl font-bold">Hey!</h2>
//         </div>

//         <p className="mb-4 text-base sm:text-lg font-light">
//           Feel free to ask anything about this{" "}
//           <span className="font-medium">
//             {type === "marketplace" ? "service" : "property"}
//           </span>
//           !
//         </p>

//         <div className="flex flex-col gap-4 mb-4">
//           <Input
//             name="name"
//             type="text"
//             value={formData.name}
//             onChange={handleChange}
//             disabled
//             placeholder="Full name"
//             className="w-full p-4 py-6 sm:py-7 bg-white/20 text-white rounded-lg border-none font-light placeholder:text-white/50 text-sm sm:text-base"
//           />
//           <Input
//             name="email"
//             type="email"
//             value={formData.email}
//             disabled
//             onChange={handleChange}
//             placeholder="Your email"
//             className="w-full p-4 py-6 sm:py-7 bg-white/20 text-white rounded-lg border-none font-light placeholder:text-white/50 text-sm sm:text-base"
//           />
//           <Input
//             name="phone"
//             type="text"
//             value={formData.phone}
//             onChange={handleChange}
//             placeholder="Phone number"
//             className="w-full p-4 py-6 sm:py-7 bg-white/20 text-white rounded-lg border-none font-light placeholder:text-white/50 text-sm sm:text-base"
//           />
//           <Input
//             name="subject"
//             type="text"
//             value={formData.subject}
//             onChange={handleChange}
//             placeholder="Subject"
//             className="w-full p-4 py-6 sm:py-7 bg-white/20 text-white rounded-lg border-none font-light placeholder:text-white/50 text-sm sm:text-base"
//           />
//           <Textarea
//             name="message"
//             value={formData.message}
//             onChange={handleChange}
//             placeholder="Your message..."
//             rows={3}
//             className="w-full p-4 py-3 sm:py-4 bg-white/20 text-white rounded-lg resize-none border-none font-light placeholder:text-white/50 text-sm sm:text-base"
//           />
//           <div className="flex items-center gap-2">
//             <Input
//               name="referralCode"
//               type="text"
//               value={formData.referralCode}
//               onChange={handleChange}
//               placeholder="Referral code (optional)"
//               className="w-full p-4 py-6 bg-white/20 text-white rounded-lg border-none font-light placeholder:text-white/50 text-sm"
//             />
//             <Button
//               type="button"
//               onClick={handleCheckReferral}
//               className={`px-4 py-2 text-sm rounded-lg ${
//                 referralValid === true
//                   ? "bg-green-600 text-white"
//                   : referralValid === false
//                   ? "bg-red-500 text-white"
//                   : "bg-blue-600 text-white"
//               }`}
//               disabled={checkingReferral}
//             >
//               {checkingReferral ? "Checking..." : "Check"}
//             </Button>
//           </div>

//           {referralValid !== null && (
//             <p
//               className={`text-sm ${
//                 referralValid ? "text-green-400" : "text-red-400"
//               }`}
//             >
//               {referralValid
//                 ? "Referral code is valid!"
//                 : "Invalid referral code."}
//             </p>
//           )}
//         </div>

//         {responseMsg && (
//           <p className="text-sm sm:text-base mb-2 text-center">{responseMsg}</p>
//         )}

//         <Button
//           disabled={loading}
//           onClick={handleSend}
//           className="cursor-pointer w-full bg-white text-black py-3 rounded-2xl border-none mt-auto hover:text-white text-sm sm:text-base"
//         >
//           {loading ? "Sending..." : "Send Enquiry"}
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default SendEnquire;



import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { API_URL } from "@/lib/api.env";
import { useAuth } from "@/context/authContext";

const SendEnquire = ({ setShowPopup, type, id }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    referralCode: "",
  });
  const [referralValid, setReferralValid] = useState(null); // true | false | null
  const [checkingReferral, setCheckingReferral] = useState(false);
  const [loading, setLoading] = useState(false);
  const [responseMsg, setResponseMsg] = useState("");

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSend = async () => {
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!formData.message || !formData.subject || !formData.phone) {
      setResponseMsg("Please fill in all required fields.");
      toast.error("Please fill in all required fields.");
      return;
    }
    if (!phoneRegex.test(formData.phone)) {
      toast.error("Please enter a valid 10-digit phone number.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...formData,
        marketplaceId: type === "marketplace" ? id : null,
        propertyId: type !== "marketplace" ? id : null,
        referralCode: formData.referralCode || null,
      };

      await axios.post(`${API_URL}/api/enquiry`, payload);
      toast.success("Enquiry sent successfully!");

      setResponseMsg("Enquiry sent successfully!");
      setFormData({
        name: user?.name || "",
        email: user?.email || "",
        phone: "",
        subject: "",
        message: "",
        referralCode: "",
      });

      setTimeout(() => {
        setShowPopup(false);
        setResponseMsg("");
      }, 1000);
    } catch (err) {
      console.error("Enquiry failed:", err);

      const errorMsg =
        err?.response?.data?.error ||
        "Failed to send enquiry. Try again later.";

      toast.error(errorMsg);
      setResponseMsg(errorMsg);
    }
    setLoading(false);
  };

  const handleCheckReferral = async () => {
    if (!formData.referralCode) {
      toast.error("Please enter a referral code to check.");
      return;
    }

    try {
      setCheckingReferral(true);
      const res = await fetch(
        `${API_URL}/api/referral/validate/${formData.referralCode}`
      );
      const data = await res.json();

      if (data.valid) {
        setReferralValid(true);
        toast.success("Referral code is valid!");
      } else {
        setReferralValid(false);
        toast.error(data.error || "Invalid referral code.");
      }
    } catch (error) {
      console.error("Referral check failed:", error);
      setReferralValid(false);
      toast.error("Something went wrong while checking referral code.");
    } finally {
      setCheckingReferral(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-70 flex bg-black/40"
      onClick={() => setShowPopup(false)}
    >
      {/* Mobile: Bottom slide-up */}
      <div
        className="md:hidden  sm:max-w-lg md:max-w-xl mx-auto  fixed bottom-0 left-0 right-0 primary-bg-dark text-white w-full rounded-t-3xl p-4 sm:p-6 h-[90vh] overflow-auto animate-slide-up flex flex-col"
        onClick={(e) => e.stopPropagation()}
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          animation: "slideUpMobile 0.3s ease-out forwards"
        }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl sm:text-3xl font-bold">Hey!</h2>
        </div>

        <p className="mb-4 text-base sm:text-lg font-light">
          Feel free to ask anything about this{" "}
          <span className="font-medium">
            {type === "marketplace" ? "service" : "property"}
          </span>
          !
        </p>

        <div className="flex flex-col gap-4 mb-4">
          <Input
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            disabled
            placeholder="Full name"
            className="w-full p-4 py-6 sm:py-7 bg-white/20 text-white rounded-lg border-none font-light placeholder:text-white/50 text-sm sm:text-base"
          />
          <Input
            name="email"
            type="email"
            value={formData.email}
            disabled
            onChange={handleChange}
            placeholder="Your email"
            className="w-full p-4 py-6 sm:py-7 bg-white/20 text-white rounded-lg border-none font-light placeholder:text-white/50 text-sm sm:text-base"
          />
          <Input
            name="phone"
            type="text"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone number"
            className="w-full p-4 py-6 sm:py-7 bg-white/20 text-white rounded-lg border-none font-light placeholder:text-white/50 text-sm sm:text-base"
          />
          <Input
            name="subject"
            type="text"
            value={formData.subject}
            onChange={handleChange}
            placeholder="Subject"
            className="w-full p-4 py-6 sm:py-7 bg-white/20 text-white rounded-lg border-none font-light placeholder:text-white/50 text-sm sm:text-base"
          />
          <Textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Your message..."
            rows={3}
            className="w-full p-4 py-3 sm:py-4 bg-white/20 text-white rounded-lg resize-none border-none font-light placeholder:text-white/50 text-sm sm:text-base"
          />
          <div className="flex items-center gap-2">
            <Input
              name="referralCode"
              type="text"
              value={formData.referralCode}
              onChange={handleChange}
              placeholder="Referral code (optional)"
              className="w-full p-4 py-6 bg-white/20 text-white rounded-lg border-none font-light placeholder:text-white/50 text-sm"
            />
            <Button
              type="button"
              onClick={handleCheckReferral}
              className={`px-4 py-2 text-sm rounded-lg ${
                referralValid === true
                  ? "bg-green-600 text-white"
                  : referralValid === false
                  ? "bg-red-500 text-white"
                  : "bg-blue-600 text-white"
              }`}
              disabled={checkingReferral}
            >
              {checkingReferral ? "Checking..." : "Check"}
            </Button>
          </div>

          {referralValid !== null && (
            <p
              className={`text-sm ${
                referralValid ? "text-green-400" : "text-red-400"
              }`}
            >
              {referralValid
                ? "Referral code is valid!"
                : "Invalid referral code."}
            </p>
          )}
        </div>

        {responseMsg && (
          <p className="text-sm sm:text-base mb-2 text-center">{responseMsg}</p>
        )}

        <Button
          disabled={loading}
          onClick={handleSend}
          className="cursor-pointer w-full bg-white text-black py-3 rounded-2xl border-none mt-auto hover:text-white text-sm sm:text-base"
        >
          {loading ? "Sending..." : "Send Enquiry"}
        </Button>
      </div>

      {/* Desktop: Right slide-in */}
      <div
        className="hidden md:flex fixed right-0 top-0 h-full w-full max-w-lg primary-bg-dark text-white rounded-l-3xl p-6 overflow-auto flex-col"
        onClick={(e) => e.stopPropagation()}
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          animation: "slideInRight 0.3s ease-out forwards"
        }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-bold">Hey!</h2>
        </div>

        <p className="mb-4 text-lg font-light">
          Feel free to ask anything about this{" "}
          <span className="font-medium">
            {type === "marketplace" ? "service" : "property"}
          </span>
          !
        </p>

        <div className="flex flex-col gap-4 mb-4">
          <Input
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            disabled
            placeholder="Full name"
            className="w-full p-4 py-7 bg-white/20 text-white rounded-lg border-none font-light placeholder:text-white/50 text-base"
          />
          <Input
            name="email"
            type="email"
            value={formData.email}
            disabled
            onChange={handleChange}
            placeholder="Your email"
            className="w-full p-4 py-7 bg-white/20 text-white rounded-lg border-none font-light placeholder:text-white/50 text-base"
          />
          <Input
            name="phone"
            type="text"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone number"
            className="w-full p-4 py-7 bg-white/20 text-white rounded-lg border-none font-light placeholder:text-white/50 text-base"
          />
          <Input
            name="subject"
            type="text"
            value={formData.subject}
            onChange={handleChange}
            placeholder="Subject"
            className="w-full p-4 py-7 bg-white/20 text-white rounded-lg border-none font-light placeholder:text-white/50 text-base"
          />
          <Textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Your message..."
            rows={3}
            className="w-full p-4 py-4 bg-white/20 text-white rounded-lg resize-none border-none font-light placeholder:text-white/50 text-base"
          />
          <div className="flex items-center gap-2">
            <Input
              name="referralCode"
              type="text"
              value={formData.referralCode}
              onChange={handleChange}
              placeholder="Referral code (optional)"
              className="w-full p-4 py-6 bg-white/20 text-white rounded-lg border-none font-light placeholder:text-white/50 text-sm"
            />
            <Button
              type="button"
              onClick={handleCheckReferral}
              className={`px-4 py-2 text-sm rounded-lg ${
                referralValid === true
                  ? "bg-green-600 text-white"
                  : referralValid === false
                  ? "bg-red-500 text-white"
                  : "bg-blue-600 text-white"
              }`}
              disabled={checkingReferral}
            >
              {checkingReferral ? "Checking..." : "Check"}
            </Button>
          </div>

          {referralValid !== null && (
            <p
              className={`text-sm ${
                referralValid ? "text-green-400" : "text-red-400"
              }`}
            >
              {referralValid
                ? "Referral code is valid!"
                : "Invalid referral code."}
            </p>
          )}
        </div>

        {responseMsg && (
          <p className="text-base mb-2 text-center">{responseMsg}</p>
        )}

        <Button
          disabled={loading}
          onClick={handleSend}
          className="cursor-pointer w-full bg-white text-black py-3 rounded-2xl border-none mt-auto hover:text-white text-base"
        >
          {loading ? "Sending..." : "Send Enquiry"}
        </Button>
      </div>

      <style jsx>{`
        @keyframes slideUpMobile {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }

        @keyframes slideInRight {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default SendEnquire;