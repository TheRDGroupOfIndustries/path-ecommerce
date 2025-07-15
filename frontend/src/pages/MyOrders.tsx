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
import Loader from "@/components/Loader/Loader";

const MyOrderItem = ({
  id,
  date,
  rating,
  progress,
  progressColor,
  image,
  productId,
  canChangeStatus,
  price,
}) => {
  const [status, setStatus] = useState("Pending");
  const statusOptions = [
    "Pending",
    "Dispatched",
    "Shipped",
    "Arrived",
    "Delivered",
  ];
  const handleStatusChange = async (e: any) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    const upd = await axios.put(`${API_URL}/api/order/update-status/${id}`, { status: newStatus }, {headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }});

    if (upd.status === 200) {
      window.location.reload()
    }
  };
  return (
    <Card className="rounded-lg mb-4 bg-gray-100 min-h-36 p-2 border-none shadow-none">
      <CardContent className="flex flex-row items-center justify-between px-2 py-1 flex-nowrap ">
        <div className="flex flex-col space-y-2">
          <p className="text-xs text-black/90 font-light">{date}</p>
          <h2 className="text-base text-black ">{productId}</h2>
          <p className="text-sm text-black/90 font-medium">
            Rs. {price.toFixed(0)}
          </p>
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
                  {progress}
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
            <p className={`text-xs font-medium ${progressColor}`}>
              {progress === "Pending"
                ? "Order Received"
                : progress === "Dispatched"
                ? "Order is being prepared"
                : progress === "Shipped"
                ? "Order has been shipped"
                : progress === "Arrived"
                ? "Order has reached your city"
                : progress === "Delivered"
                ? "Order Delivered Successfully"
                : "Processing..."}
            </p>
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

  const [orderData, setOrderData] = useState([]);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const getOrders = async () => {
    try {
      setLoading(true);
      const requests = await axios.get(`${API_URL}/api/users/get-orders`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (requests.status === 200) {
        console.log(requests.data.user[0].orders);
        setData(requests.data.user[0].orders);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

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
      {data.length > 0 ? (
        data.map((order) => (
          <MyOrderItem
            key={order.id}
            id={order.id}
            productId={order.product.name}
            date={order.createdAt.split("T")[0]}
            rating={order.product.ratings}
            price={order.totalAmount}
            image={order.product.images[0]}
            progress={order.status}
            progressColor={
              order.status === "Pending"
                ? "text-blue-600"
                : order.status === "Dispatched"
                ? "text-yellow-600"
                : order.status === "Shipped"
                ? "text-purple-600"
                : order.status === "Arrived"
                ? "text-orange-600"
                : order.status === "Delivered"
                ? "text-green-600"
                : "text-gray-500"
            }
            canChangeStatus={user?.role === "ADMIN" || user?.role === "SELLER"}
          />
        ))
      ) : (
        <Loader />
      )}
    </div>
  );
}
