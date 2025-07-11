import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AllEnqueries() {
  const [enqueries] = useState([
    {
      id: 1,
      productName: "Product Name goes her ",
      date: "20/08/2025",
      customerName: "Aquib Ahmed",
      email: "aquib.ahmed411@gmail.com",
      image:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
    },
    {
      id: 2,
      productName: "Product Name goes her",
      date: "20/08/2025",
      customerName: "Adarsh sharma",
      email: "adarsh.sharma411@gmail.com",
      image:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
    },
    {
      id: 3,
      productName: "Product Name goes her",
      date: "20/08/2025",
      customerName: "Aquib Ahmed",
      email: "aquib.ahmed411@gmail.com",
      image:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
    },
    {
      id: 4,
      productName: "Product Name goes her",
      date: "20/08/2025",
      customerName: "Aquib Ahmed",
      email: "aquib.ahmed411@gmail.com",
      image:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
    },
    {
      id: 5,
      productName: "Product Name goes her...",
      date: "20/08/2025",
      customerName: "Aquib Ahmed",
      email: "aquib.ahmed411@gmail.com",
      image:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
    },
  ]);

  const navigate= useNavigate();
//   const handleGoBack = () => {
//     window.history.back();
//   };

  return (
    <div className="container mx-auto p-4 mb-18">
      {/* Header */}
      <div className="flex items-center h-14  text-black mb-2">
        <ChevronLeft
          className="w-8 h-8 cursor-pointer"
          onClick={()=>navigate(-1)}
        />
        <h2 className="flex-1 text-2xl text-center font-semibold">
          All Enqueries
        </h2>
      </div>
      {/* Enqueries List */}
      <div className="space-y-4">
        {enqueries.map((enquiry) => (
          <Card
            key={enquiry.id}
            onClick={()=>navigate(`/enquiry-detail`)}
            className="rounded-lg  bg-gray-100 min-h-24 p-2 border-none shadow-none"
          >
            <CardContent className="flex flex-row items-center justify-between px-1 flex-nowrap ">
              <div className="flex items-center  w-full ">
                {/* Text on the left */}
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

                {/* Image on the right */}
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
