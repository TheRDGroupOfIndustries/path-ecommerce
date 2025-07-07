import { Card, CardContent } from "@/components/ui/card";
import {
  Package,
  CheckCircle,
  Calendar,
  Truck,
  PackageCheck,
  ChevronLeft,
} from "lucide-react";
import { useState } from "react";
import { MdStar, MdStarBorder } from "react-icons/md";

export default function TrackOrders() {
  const [orderData] = useState({
    productId: "B1001",
    productName: "Coinverge Radiance",
    description:
      "A luxurious skincare combo with a lightweight radiance serum and nourishing moisturizer. serum and nourishing moisturizer.serum and nourishing moisturizer. serum and nourishing moisturizer.",
    price: 250,
    rating: 4.5,
    ratingCount: 5,
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
    trackingSteps: [
      {
        id: 1,
        icon: Package,
        title: "Order placed",
        description: "We have received your order on 18-July-2025",
        status: "completed",
        color: "bg-orange-400",
      },
      {
        id: 2,
        icon: PackageCheck,
        title: "Order confirmed",
        description: "We have confirmed your order on 18-July-2025",
        status: "completed",
        color: "bg-orange-400",
      },
      {
        id: 3,
        icon: CheckCircle,
        title: "Order processed",
        description: "We are preparing your order",
        status: "current",
        color: "bg-green-400",
      },
      {
        id: 4,
        icon: Calendar,
        title: "Ready to ship",
        description: "Your order is ready for shipping",
        status: "pending",
        color: "bg-gray-400",
      },
      {
        id: 5,
        icon: Truck,
        title: "Out for delivery",
        description: "Your order is out for delivery",
        status: "pending",
        color: "bg-gray-400",
      },
    ],
  });
  const [showFullDescription, setShowFullDescription] = useState(false);

  const renderStars = (rating) =>
    [...Array(5)].map((_, i) =>
      i < Math.floor(rating) ? (
        <MdStar key={i} className="w-4 h-4 text-yellow-400" />
      ) : (
        <MdStarBorder key={i} className="w-4 h-4 text-black" />
      )
    );

       const handleGoBack = () => {
    window.history.back();
  };
  return (
    <div className="container mx-auto p-4 mb-10">
      {/* Header */}
      <div className="flex items-center h-14 mb-4 text-black">
    
        <ChevronLeft
          className="w-8 h-8 cursor-pointer"
          onClick={handleGoBack}
        />
        <h2 className="flex-1 text-xl text-center">
            Track orders
        </h2>
      </div>

      <div className="space-y-4">
        {/* Product ID */}
        <div className="bg-gray-100 px-3 py-2 rounded">
          <p className="text-sm text-black">
            Product ID: {orderData.productId}
          </p>
        </div>

        {/* Product Details Card */}
        <Card className="bg-gray-100 border-none shadow-none p-0">
          <CardContent className="p-2">
            <div className="flex items-start space-x-2">
              {/* Product Info */}
              <div className="flex-1">
                <h2 className="text-lg font-normal text-black mb-2">
                  {orderData.productName}
                </h2>
                <p className="text-xs text-black mb-5 leading-tight font-extralight max-w-[95%]">
                  {!showFullDescription && orderData.description.length > 80 ? (
                    <>
                      {orderData.description.slice(0, 80)}...
                      <button
                        className="text-blue-700 ml-1 "
                        onClick={() => setShowFullDescription(true)}
                        type="button"
                      >
                        more
                      </button>
                    </>
                  ) : (
                    <>
                      {orderData.description}
                      {orderData.description.length > 80 && (
                        <button
                          className="text-blue-700 ml-1 "
                          onClick={() => setShowFullDescription(false)}
                          type="button"
                        >
                          less
                        </button>
                      )}
                    </>
                  )}
                </p>

                <div className="flex items-center justify-between mt-2 pr-2">
                  <p className="text-lg font-semibold text-black whitespace-nowrap">
                    Rs. {orderData.price}/-
                  </p>
                  <div className="flex items-center">
                    {renderStars(orderData.rating)}
                    <span className="text-xs text-gray-600 ml-1">
                      ({orderData.rating}/{orderData.ratingCount})
                    </span>
                  </div>
                </div>
              </div>

              {/* Product Image */}
              <div className="w-30 h-30 flex-shrink-0">
                <img
                  src={orderData.image}
                  alt={orderData.productName}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tracking Steps */}
        <Card className="bg-gray-100 border-none shadow-none">
          <CardContent className="p-4">
            <h3 className="text-base font-semibold text-black mb-4">
              Track orders
            </h3>

            <div className="space-y-4">
              {orderData.trackingSteps.map((step, index) => {
                const IconComponent = step.icon;
                const isLast = index === orderData.trackingSteps.length - 1;

                return (
                  <div key={step.id} className="flex items-start space-x-3">
                    {/* Icon and Line */}
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${step.color}`}
                      >
                        <IconComponent className="w-4 h-4 text-white" />
                      </div>
                      {!isLast && (
                        <div
                          className={`w-px h-8 mt-1 ${
                            step.status === "completed"
                              ? "bg-orange-300"
                              : step.status === "current"
                              ? "bg-green-300"
                              : "bg-gray-300"
                          }`}
                        />
                      )}
                    </div>

                    {/* Step content */}
                    <div className="flex-1 pb-2">
                      <h4
                        className={`text-sm font-medium ${
                          step.status === "pending"
                            ? "text-gray-400"
                            : "text-black"
                        }`}
                      >
                        {step.title}
                      </h4>
                      <p
                        className={`text-xs mt-1 ${
                          step.status === "pending"
                            ? "text-gray-400"
                            : "text-gray-600"
                        }`}
                      >
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
