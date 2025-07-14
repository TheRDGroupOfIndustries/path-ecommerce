import Loader from "@/components/Loader/Loader";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/authContext";
import { API_URL } from "@/lib/api.temp";
import axios from "axios";
import { ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AllEnqueries() {
    const { user } = useAuth();
//   console.log("user: ", user.id);

  const [enquiries, setEnquiries] = useState();
  const navigate = useNavigate();
  //   const handleGoBack = () => {
  //     window.history.back();
  //   };
  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/api/seller/seller-enquiry/${user.id}`
        );
        // console.log("AllEnquiry : ", res);

        const { marketplaceEnquiries, propertyEnquiries } = res.data;

        const mapped = [
          ...marketplaceEnquiries.flatMap((marketplace) =>
            marketplace.enquires.map((e) => ({
              id: e.id,
              productName: marketplace.name,
              date: new Date(e.createdAt).toLocaleDateString("en-GB"),
              customerName: e.name,
              email: e.email,
              subject: e.subject,
              message: e.message,
              image:
                Array.isArray(marketplace.imageUrl) &&
                marketplace.imageUrl.length > 0
                  ? marketplace.imageUrl[0]
                  : "https://via.placeholder.com/150",
            }))
          ),
          ...propertyEnquiries.flatMap((property) =>
            property.enquires.map((e) => ({
              id: e.id,
              productName: property.name,
              date: new Date(e.createdAt).toLocaleDateString("en-GB"),
              customerName: e.name,
              email: e.email,
              subject: e.subject,
              message: e.message,
              image:
                Array.isArray(property.imageUrl) &&
                property.imageUrl.length > 0
                  ? property.imageUrl[0]
                  : "https://via.placeholder.com/150",
            }))
          ),
        ];

        setEnquiries(mapped);
      } catch (err) {
        console.error("Failed to fetch enquiries", err);
      }
    };

    if (user?.id) fetchEnquiries();
  }, [user?.id]);
   if (!enquiries) return <Loader/>

  return (
    <div className="container mx-auto p-4 mb-18">
      {/* Header */}
      <div className="flex items-center h-14  text-black mb-2">
        <ChevronLeft
          className="w-8 h-8 cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <h2 className="flex-1 text-2xl text-center font-semibold">
          All Enqueries
        </h2>
      </div>
      {/* Enqueries List */}
      <div className="space-y-4">
        {enquiries.map((enquiry) => (
          <Card
            key={enquiry.id}
            onClick={() =>
              navigate(`/enquiry-detail/${enquiry.id}`, { state: { enquiry } })
            }
            className="rounded-lg  bg-gray-100 min-h-24 p-2 border-none shadow-none"
          >
            <CardContent className="flex flex-row items-center justify-between px-1 flex-nowrap">
              <div className="flex items-center w-full">
                <div className="flex flex-col space-y-0 flex-1">
                  <h3 className="text-sm font-medium text-black">
                    {enquiry.productName.length > 25
                      ? enquiry.productName.slice(0, 25) + "..."
                      : enquiry.productName}
                  </h3>
                  <p className="text-xs text-blue-400 font-light">
                    {enquiry.date}
                  </p>
                  <p className="text-sm font-medium text-black">
                    {enquiry.customerName}
                  </p>
                  <p className="text-xs text-gray-400">{enquiry.email}</p>
                </div>
                <div className="relative w-24 h-20 flex-shrink-0">
                  <img
                    src={enquiry.image}
                    alt={enquiry.productName}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

//   <div className="space-y-4">
//     {enqueries.map((enquiry) => (
//       <Card
//         key={enquiry.id}
//         onClick={()=>navigate(`/enquiry-detail`)}
//         className="rounded-lg  bg-gray-100 min-h-24 p-2 border-none shadow-none"
//       >
//         <CardContent className="flex flex-row items-center justify-between px-1 flex-nowrap ">
//           <div className="flex items-center  w-full ">
//             {/* Text on the left */}
//             <div className="flex flex-col space-y-0 flex-1">
//               <h3 className="text-sm font-medium text-black">
//                 {enquiry.productName.length > 25
//     ? enquiry.productName.slice(0, 25) + "..."
//     : enquiry.productName}
//               </h3>
//               <p className="text-xs text-blue-400 font-light">
//                 {enquiry.date}
//               </p>
//               <p className="text-sm font-medium text-black">
//                 {enquiry.customerName}
//               </p>
//               <p className="text-xs text-gray-400">{enquiry.email}</p>
//             </div>

//             {/* Image on the right */}
//             <div className="relative w-24 h-20 flex-shrink-0">
//               <img
//                 src={enquiry.image}
//                 alt={enquiry.productName}
//                 className="w-full h-full object-cover rounded-lg"
//               />
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     ))}
//   </div>
