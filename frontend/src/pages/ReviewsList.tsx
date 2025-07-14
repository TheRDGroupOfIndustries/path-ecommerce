import Loader from "@/components/Loader/Loader";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/authContext";
import { API_URL } from "@/lib/api.env";
import axios from "axios";
import { ChevronLeft, Star } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ name, images, avgRating, totalReviews, type, id}) => {
  const navigate = useNavigate();
const image = Array.isArray(images) ? images[0] : images;
  return (
    <Card
      className="rounded-lg mb-4 bg-gray-100 min-h-36 border-none shadow-none cursor-pointer"
       onClick={() => navigate(`/reviews/${type}/${id}`)}
    >
      <CardContent className="flex items-center justify-between px-4">
        <div className="flex flex-col space-y-4">
          <h3 className="text-base font-semibold text-black">{name}</h3>

          {/* Rating */}
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(avgRating) ? "text-yellow-400 fill-current" : "text-gray-300"
                }`}
              />
            ))}
            <span className="text-xs text-blue-600">
             ({avgRating.toFixed(1)} / 5) • {totalReviews} review
{totalReviews > 1 ? "s" : ""}
            </span>
          </div>
          <p className="text-sm">{id}</p>
        </div>

        <img
          src={image}
          alt={name}
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
        const reviews = res.data;

        const map = new Map();

        reviews.forEach((review) => {
          let key, name, images;

          if (review.productId && review.product) {
            key = `product-${review.productId}`;
            name = review.product.name;
            images = review.product.images || [];
          } else if (review.marketplaceId && review.marketplace) {
            key = `marketplace-${review.marketplaceId}`;
            name = review.marketplace.name;
            images = review.marketplace.imageUrl || [];
          } else if (review.propertyId && review.property) {
            key = `property-${review.propertyId}`;
            name = review.property.name;
            images = review.property.imageUrl || [];
          } else {
           
            return;
          }

          if (!map.has(key)) {
            map.set(key, {
              key,
              name,
              images,
              ratings: [review.rating],
              type: key.split("-")[0], // "product" or "marketplace" or "property"
              id: key.split("-")[1],
            });
          } else {
            map.get(key).ratings.push(review.rating);
          }
        });

        const arr = Array.from(map.values()).map((item) => {
          const avgRating =
            item.ratings.reduce((sum, r) => sum + r, 0) / item.ratings.length;

          return {
            ...item,
            avgRating,
            totalReviews: item.ratings.length,
          };
        });

        setProductsWithReviews(arr);
      } catch (err) {
        console.error("Failed to fetch reviews", err);
      }
    };

    fetchReviews();
  }, []);

  if (!productsWithReviews) return <Loader />;

    return (
      <div className="container mx-auto p-4 mb-16">
        {/* Header */}
        <div className="flex items-center h-14 text-black mb-2">
          <ChevronLeft className="w-8 h-8 cursor-pointer" onClick={() => navigate(-1)} />
          <h2 className="flex-1 text-2xl text-center font-semibold">My Product Reviews</h2>
        </div>

        {/* Product Cards */}
        {productsWithReviews.map(
          ({ key, name, images, avgRating, totalReviews, type, id }) => (
            <ProductCard
              key={key}
              name={name}
              images={images}
              avgRating={avgRating}
              totalReviews={totalReviews}
              type={type}
              id={id}
            />
          )
        )}
      </div>
    );

};

export default ReviewsList;
