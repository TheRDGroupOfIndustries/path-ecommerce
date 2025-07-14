import Loader from "@/components/Loader/Loader";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/authContext";
import { API_URL } from "@/lib/api.env";
import axios from "axios";
import { ChevronLeft, Star } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ productName, productImage, rating, totalReviews, productId }) => {
  const navigate = useNavigate();

  return (
    <Card
      className="rounded-lg mb-4 bg-gray-100 min-h-36 border-none shadow-none cursor-pointer"
      onClick={() => navigate(`/product-reviews/${productId}`)}
    >
      <CardContent className="flex items-center justify-between px-4">
        <div className="flex flex-col space-y-4">
          <h3 className="text-base font-semibold text-black">{productName}</h3>

          {/* Rating */}
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                }`}
              />
            ))}
            <span className="text-xs text-blue-600">
              ({rating.toFixed(1)} / 5)  {totalReviews} rating{totalReviews > 1 ? "s" : ""}
            </span>
          </div>
          <p className="text-sm">{productId}</p>
        </div>

        <img
          src={productImage}
          alt={productName}
          className="w-28 h-28 object-cover rounded-lg"
        />
      </CardContent>
    </Card>
  );
};

const ReviewsList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [productsWithReviews, setProductsWithReviews] = useState();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/review/get`);
        console.log("res: ",res);
        
        const productMap = new Map();

        res.data.forEach((review) => {
          const { productId, rating, product } = review;

          if (!productMap.has(productId)) {
            productMap.set(productId, {
              productId,
              productName: product.name,
              productImage: product.images?.[0],
              ratings: [rating],
            });
          } else {
            productMap.get(productId).ratings.push(rating);
          }
        });

        // Convert to array and calculate average ratings
        const result = Array.from(productMap.values()).map((item) => {
          const avgRating =
            item.ratings.reduce((sum, r) => sum + r, 0) / item.ratings.length;
          return {
            ...item,
            avgRating,
            totalReviews: item.ratings.length,
          };
        });

        setProductsWithReviews(result);
      } catch (err) {
        console.error("Failed to fetch reviews", err);
      }
    };

    fetchReviews();
  }, []);
  if (!productsWithReviews) return <Loader/>

  return (
    <div className="container mx-auto p-4 mb-16">
      {/* Header */}
      <div className="flex items-center h-14 text-black mb-2">
        <ChevronLeft className="w-8 h-8 cursor-pointer" onClick={() => navigate(-1)} />
        <h2 className="flex-1 text-2xl text-center font-semibold">My Product Reviews</h2>
      </div>

      {/* Product Cards */}
      {productsWithReviews.map((product) => (
        <ProductCard
          key={product.productId}
          productName={product.productName}
          productImage={product.productImage}
          rating={product.avgRating}
          totalReviews={product.totalReviews}
          productId={product.productId}
        />
      ))}
    </div>
  );
};

export default ReviewsList;
