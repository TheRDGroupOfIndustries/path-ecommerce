import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  ChevronLeft,
  Search,
  Star,

} from "lucide-react";
import { useNavigate } from "react-router-dom";

const MyOrderItem = ({
  date,
  rating,
  progress,
  progressColor,
  image,
  productId,
}) => {
  return (
    <Card className="rounded-lg mb-4 bg-gray-100 h-32 p-2 border-none shadow-none">
      <CardContent className="flex flex-row items-center justify-between px-1 py-1 flex-nowrap ">
        <div className="flex flex-col space-y-2 flex-1">
          <h2 className="text-lg text-black "> Product ID: {productId}</h2>
          <p className="text-xs text-black/90 font-light">{date}</p>
          <div className="flex items-center space-x-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < Math.floor(rating)
                    ? "text-yellow-400 fill-current"
                    : "text-gray-300"
                }`}
              />
            ))}
            <span className="text-xs text-gray-600 ml-1">({rating}/5)</span>
          </div>
          <p className={`text-xs font-medium ${progressColor}`}>{progress}</p>
        </div>

        <div className="relative w-26 h-26 flex-shrink-0">
          <img
            src={image}
            alt={productId}
            className="w-full h-full object-cover rounded-lg "
          />
        </div>
      </CardContent>
    </Card>
  );
};
export default function MyOrders() {

    const orders= [
    {
      id: "B1001",
      date: "20-July-2025, 3:00 PM",
      rating: 4.5,
      progress: "Estimated delivery on 21 July",
      progressColor: "text-green-700",
      image:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
    },
    {
      id: "B1002",
      date: "19-July-2025, 2:00 PM",
      rating: 4.6,
      progress: "Delivered on 19 July",
      progressColor: "text-orange-700",
      image:
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop",
    },
    {
      id: "B1003",
      date: "18-July-2025, 2:00 PM",
      rating: 4.5,
      progress: "Delivered on 19 July",
      progressColor: "text-orange-700",
      image:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
    },
    {
      id: "B1004",
      date: "18-July-2025, 2:00 PM",
      rating: 4.5,
      progress: "Delivered on 19 July",
      progressColor: "text-orange-700",
      image:
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop",
    },
    {
      id: "B1005",
      date: "18-July-2025, 2:00 PM",
      rating: 4.5,
      progress: "Delivered on 19 July",
      progressColor: "text-orange-700",
      image:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
    },
  ]

  const navigate = useNavigate();

  return (
    
      <div className="container mx-auto p-4 mb-6">
        <div className="flex justify-between  p-2 items-center mb-4 text-black">
          
          <ChevronLeft
            className="w-6 h-6  cursor-pointer"
            onClick={() => {
              navigate("/profile");
            }}
          /> 
         
          <h2 className="text-2xl   ">My orders</h2>

            <div className="flex items-center space-x-2">
           <Search className="w-7 h-7 text-black" />
           </div>
        </div>
        {orders.map((order) => (
          <MyOrderItem
            key={order.id}
            date={order.date}
            rating={order.rating}
            image={order.image}
            progress={order.progress}
            progressColor={order.progressColor}
            productId={order.id}
          />
        ))}
      </div>
    
  );
}

//  <div className="min-h-screen mb-10">
//       {/* Header */}
//       <div >
//         <div className="flex items-center justify-between px-4 py-4">
//           <div className="flex items-center space-x-3">
//             {/* <button
//               onClick={()=>navigate(-1)}
//               className="p-1"
//             >
//               <ArrowLeft className="w-5 h-5 text-black" />
//             </button> */}
//             <h1 className="text-xl  text-black">My orders</h1>
//           </div>
//           <div className="flex items-center space-x-2">
//             <Search className="w-5 h-5 text-gray-600" />
//           </div>
//         </div>
//       </div>

//       {/* Orders List */}
//       <div className="px-4 py-4 space-y-3">
//         {orders.map((order, index) => (
//           <Card key={index} className="bg-gray-100 border-none shadow-none p-0">
//             <CardContent className="p-4">
//               <div className="flex items-center space-x-4">
//                 {/* Product Image */}

//                 {/* Order Details */}
//                 <div className="flex-1 min-w-0">
//                   <div className="flex items-center justify-between mb-1">
//                     <h3 className="text-sm font-medium text-black">
//                       Product ID: {order.id}
//                     </h3>
//                   </div>

//                   <p className="text-xs text-gray-500 mb-2">
//                     {order.date}
//                   </p>

//                   <div className="flex items-center space-x-1 mb-2">
//                     {[...Array(5)].map((_, i) => (
//                       <Star
//                         key={i}
//                         className={`w-3 h-3 ${
//                           i < Math.floor(order.rating)
//                             ? 'text-yellow-400 fill-current'
//                             : 'text-gray-300'
//                         }`}
//                       />
//                     ))}
//                     <span className="text-xs text-gray-600 ml-1">
//                       ({order.rating}/5)
//                     </span>
//                   </div>

//                   <p className={`text-xs font-medium ${order.progressColor}`}>
//                     {order.progress}
//                   </p>
//                 </div>

//                 <div className="relative w-32 h-32 ">
//                   <img
//                     src={order.image}
//                     alt={`Product ${order.id}`}
//                     className="w-full h-full object-cover rounded-lg"
//                   />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//     </div>
