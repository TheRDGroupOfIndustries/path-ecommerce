// import { Card, CardContent } from "@/components/ui/card";
// import { useAuth } from "@/context/authContext";
// import { ChevronLeft, Star } from "lucide-react";
// import React from "react";
// import { useNavigate } from "react-router-dom";

// const MyReviewItem  = ({ date, rating, image, productId }) => {
//   const navigate = useNavigate();
//   return (
//     <Card
//       className="rounded-lg mb-4 bg-gray-100 min-h-36 p-2 border-none shadow-none"
//       onClick={() => navigate("/product-reviews")}
//     >
//       <CardContent className="flex flex-row items-center justify-between px-2 py-1 flex-nowrap ">
//         <div className="flex flex-col space-y-5">
//           <h2 className="text-lg text-black "> Product ID: {productId}</h2>
//           <p className="text-xs text-black/90 font-light">{date}</p>
//           <div className="flex items-center space-x-1 mb-2">
//             {[...Array(5)].map((_, i) => (
//               <Star
//                 key={i}
//                 className={`w-3 h-3 ${
//                   i < Math.floor(rating)
//                     ? "text-yellow-400 fill-current"
//                     : "text-gray-300"
//                 }`}
//               />
//             ))}
//             <span className="text-xs text-gray-600 ml-1">({rating}/5)</span>
//           </div>
//         </div>

//         <div className="relative w-30 h-30 flex-shrink-0">
//           <img
//             src={image}
//             alt={productId}
//             className="w-full h-full object-cover rounded-lg "
//           />
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// const ReviewsList = () => {
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   const orders = [
//     {
//       id: "B1001",
//       date: "20-July-2025, 3:00 PM",
//       rating: 4.5,
//       progress: "Estimated delivery on 21 July",
//       progressColor: "text-green-700",
//       image:
//         "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
//     },
//     {
//       id: "B1002",
//       date: "19-July-2025, 2:00 PM",
//       rating: 4.6,
//       progress: "Delivered on 19 July",
//       progressColor: "text-orange-700",
//       image:
//         "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop",
//     },
//     {
//       id: "B1003",
//       date: "18-July-2025, 2:00 PM",
//       rating: 4.5,
//       progress: "Delivered on 19 July",
//       progressColor: "text-orange-700",
//       image:
//         "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
//     },
//     {
//       id: "B1004",
//       date: "18-July-2025, 2:00 PM",
//       rating: 4.5,
//       progress: "Delivered on 19 July",
//       progressColor: "text-orange-700",
//       image:
//         "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop",
//     },
//     {
//       id: "B1005",
//       date: "18-July-2025, 2:00 PM",
//       rating: 4.5,
//       progress: "Delivered on 19 July",
//       progressColor: "text-orange-700",
//       image:
//         "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
//     },
//   ];
//   return (
//     <div className="container mx-auto p-4 mb-16">
//       <div className="flex items-center h-14  text-black mb-2">
//         <ChevronLeft
//           className="w-8 h-8 cursor-pointer"
//           onClick={() => navigate(-1)}
//         />
//         <h2 className="flex-1 text-2xl text-center font-semibold">Reviews</h2>
//       </div>
//       {orders.map((order) => (
//         <MyReviewItem 
//           key={order.id}
//           date={order.date}
//           rating={order.rating}
//           image={order.image}
//           productId={order.id}
//         />
//       ))}
//     </div>
//   );
// };

// export default ReviewsList;



import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/authContext";
import { ChevronLeft, Star } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

// Single review item
const MyReviewItem = ({ date, rating, image, productId }) => {
  const navigate = useNavigate();
  return (
    <Card
      className="rounded-lg mb-4 bg-gray-100 min-h-36 p-2 border-none shadow-none cursor-pointer"
      onClick={() => navigate(`/product-reviews`)} // dynamic routing
    >
      <CardContent className="flex flex-row items-center justify-between px-2 py-1 flex-nowrap">
        <div className="flex flex-col space-y-5">
          <h2 className="text-lg text-black font-semibold">Product: {productId}</h2>
          <p className="text-xs text-black/90 font-light">{date}</p>

          {/* Only show rating if available */}
          {rating && (
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
          )}
        </div>

        <div className="relative w-30 h-30 flex-shrink-0">
          <img
            src={image}
            alt={productId}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      </CardContent>
    </Card>
  );
};

// List of all reviews
const ReviewsList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const reviews = [
    {
      id: "B1001",
      date: "20-July-2025, 3:00 PM",
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
    },
    {
      id: "B1002",
      date: "19-July-2025, 2:00 PM",
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop",
    },
    {
      id: "B1003",
      date: "18-July-2025, 2:00 PM",
      rating: null, // No rating yet
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
    },
  ];

  return (
    <div className="container mx-auto p-4 mb-16">
      {/* Header */}
      <div className="flex items-center h-14 text-black mb-2">
        <ChevronLeft
          className="w-8 h-8 cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <h2 className="flex-1 text-2xl text-center font-semibold">My Product Reviews</h2>
      </div>

      {/* Review List */}
      {reviews.map((review) => (
        <MyReviewItem
          key={review.id}
          date={review.date}
          rating={review.rating}
          image={review.image}
          productId={review.id}
        />
      ))}
    </div>
  );
};

export default ReviewsList;
