import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/authContext";
import { ChevronLeft, Search, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { API_URL } from "@/lib/api.env";

const MyOrderItem = ({
  date,
  rating,
  progress,
  progressColor,
  image,
  productId,
  canChangeStatus,
}) => {
  const [status, setStatus] = useState("Pending");
  const statusOptions = [
    "Pending",
    "Dispatched",
    "Shipped",
    "Arrived",
    "Delivered",
  ];
  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);

    // axios.post(`/api/order/update-status`, { productId, status: newStatus });
  };
  return (
    <Card className="rounded-lg mb-4 bg-gray-100 min-h-36 p-2 border-none shadow-none">
      <CardContent className="flex flex-row items-center justify-between px-2 py-1 flex-nowrap ">
        <div className="flex flex-col space-y-2">
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

          {canChangeStatus ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="text-xs font-medium text-black border px-4 py-1 rounded bg-white w-fit truncate"
                >
                  {status}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className=" rounded-lg p-2"
                sideOffset={8}
                align="start"
              >
                {statusOptions.map((option) => (
                  <DropdownMenuItem
                    key={option}
                    onClick={() => {
                      setStatus(option);
                      handleStatusChange({ target: { value: option } });
                    }}
                    className="text-sm py-2 px-3 rounded-md data-[highlighted]:bg-cyan-100 data-[highlighted]:text-cyan-900"
                  >
                    {option}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <p className={`text-xs font-medium ${progressColor}`}>{progress}</p>
          )}
        </div>

        <div className="relative w-30 h-30 flex-shrink-0">
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
  const { user } = useAuth(); // get the logged-in user
  const navigate = useNavigate();
  const orders = [
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
  ];

  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

  const getOrders = async () => {
    try {
      setLoading(true)
          const requests = await axios.get(`${API_URL}/api/users/get-orders`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })

    if (requests.status === 200) {
      setData(requests.data.users.orders)
    }
    } catch (error) {
      console.log(error);
    }
    finally {
      setLoading(false)
    }

  }

  useEffect(() => {
    getOrders()
  }, [])

  return (
    <div className="container mx-auto p-4 mb-16">
      <div className="flex justify-between  p-2 items-center mb-4 text-black">
        <ChevronLeft
          className="w-8 h-8  cursor-pointer"
          onClick={() => {
            navigate("/profile");
          }}
        />

        <h2 className="text-2xl  font-semibold ">My orders</h2>

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
          canChangeStatus={user?.role === "ADMIN" || user?.role === "SELLER"}

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
