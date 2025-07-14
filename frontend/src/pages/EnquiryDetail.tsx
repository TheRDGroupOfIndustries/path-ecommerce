import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export default function EnquiryDetail() {
  const location = useLocation();
  const navigate = useNavigate()
  const enquiryData = location.state?.enquiry;
  //   console.log("enquiryData: ",enquiryData);

  if (!enquiryData) {
    return <div className="p-4 text-red-500">No enquiry data found.</div>;
  }

  const handleGoBack = () => {
    navigate(-1)
  };

    const handleReplyViaGmail = () => {
      const subject = encodeURIComponent(`Re: ${enquiryData.subject}`);
      const body = encodeURIComponent(`Hello ${enquiryData.customerName},\n\nThank you for your enquiry.\n\n`);
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${enquiryData.email}&su=${subject}&body=${body}`;
      window.open(gmailUrl, '_blank');
    };

  return (
    <div className="container mx-auto p-4 mb-18">
      <div className="flex items-center h-14  text-black mb-2">
        <ChevronLeft
          className="w-8 h-8 cursor-pointer"
          onClick={handleGoBack}
        />
        <h2 className="flex-1 text-2xl text-center font-semibold">
          Enquiry of {enquiryData.customerName}
        </h2>
      </div>

      {/* Enquiry Details */}
      <div className=" py-6 space-y-4">
        {/* Customer Name */}
        <div className="bg-gray-100 rounded-lg px-4 py-3">
          <p className="text-lg  text-gray-700">{enquiryData?.customerName}</p>
        </div>

        {/* Email */}
        <div className="bg-gray-100 rounded-lg px-4 py-3">
          <p className="text-lg text-gray-700">{enquiryData?.email}</p>
        </div>

        {/* Subject */}
        <div className="bg-gray-100 rounded-lg px-4 py-3">
          <p className="text-lg  text-gray-700">{enquiryData?.subject}</p>
        </div>

        {/* Message */}
        <div className="bg-gray-100 rounded-lg px-4 py-3">
          <p className="text-sm text-gray-700 leading-relaxed">
            {enquiryData?.message}
          </p>
        </div>

        {/* Reply Button */}
        <div className="pt-4 flex justify-end  w-full">
          <Button
            onClick={handleReplyViaGmail}
            className=" bg-blue-900 text-white py-3 rounded-lg "
          >
            Reply via Gmail
          </Button>
        </div>
      </div>
    </div>
  );
}
