import { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import Loader from "@/components/Loader/Loader";
import EmptyCart from "@/components/EmptyCart/EmptyCart";
import axios from "axios";
import { API_URL } from "@/lib/api.env";

const EnquiryCard = ({
  name,
  email,
  phone,
  subject,
  message,
  createdAt,
  image,
  itemName,
  linkedTo,
}) => {
  return (
    <Card className="rounded-lg mb-4 bg-gray-100 min-h-36 p-2 border-none shadow-none">
      <CardContent className="flex flex-row items-center justify-between px-2 py-1">
        <div className="flex flex-col space-y-1">
          <p className="text-xs text-black/60 font-sans">
            {createdAt.split("T")[0]}
          </p>
          <h2 className="text-lg font-bold text-black">{name}</h2>
          <p className="text-sm text-black break-words max-w-[90vw]">{email}</p>
          <p className="text-sm text-black font-mono break-words max-w-[90vw]">
            {phone}
          </p>
          <p className="text-sm text-black font-medium break-words max-w-[90vw]">
            {subject}
          </p>
          <p className="text-xs text-black/80 italic break-words max-w-[90vw]">
            {message}
          </p>

          <p className="text-xs text-black font-light">
            Enquiry for {linkedTo}: {itemName}
          </p>
        </div>
        {image && (
          <div className="w-24 h-24 ml-2">
            <img
              src={image}
              alt={itemName}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default function MyEnquiries() {
  const navigate = useNavigate();
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(false);

  const getUserEnquiries = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/enquiry/user-enquiry`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
    //   console.log("res: ",res);
      
      if (res.status === 200) {
        setEnquiries(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch enquiries:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserEnquiries();
  }, []);

  if (loading) return <Loader />;
  if (!loading && enquiries.length === 0)
    return (
      <div className="flex items-center justify-center h-screen text-center">
        <h2 className="text-3xl font-semibold text-gray-800">No enquiries</h2>
      </div>
    );

  return (
    <div className="container mx-auto p-4 mb-16">
      <div className="flex justify-between items-center mb-4 text-black">
        <ChevronLeft
          className="w-8 h-8 cursor-pointer"
          onClick={() => navigate("/profile")}
        />
        <h2 className="text-2xl font-semibold flex-1 text-center">
          My Enquiries
        </h2>
        <div className="w-8 h-8" />
      </div>

      {enquiries.map((enquiry) => (
        <EnquiryCard key={enquiry.id} {...enquiry} />
      ))}
    </div>
  );
}
