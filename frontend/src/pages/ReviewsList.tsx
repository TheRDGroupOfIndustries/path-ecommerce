import Loader from "@/components/Loader/Loader";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/authContext";
import { API_URL } from "@/lib/api.env";
import axios from "axios";
import { ChevronLeft, LucideArrowRight, Star } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ name, images, avgRating, totalReviews, type, id }) => {
  const navigate = useNavigate();
  const image = Array.isArray(images) ? images[0] : images;
  return (
    <Card
      className="rounded-lg mb-4 bg-gray-100 min-h-28 border-none shadow-none cursor-pointer"
      onClick={() => navigate(`/reviews/${type}/${id}`)}
    >
      <CardContent className="flex items-center justify-between px-4">
        <div className="flex flex-col justify-between gap-1">
          <h3 className="text-base font-semibold text-black">{name}</h3>

          {/* Rating */}
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(avgRating)
                    ? "text-yellow-400 fill-current"
                    : "text-gray-300"
                }`}
              />
            ))}
            <span className="text-xs text-yellow-400">
              ({avgRating.toFixed(1)} / 5)
            </span>
          </div>
          <p className="text-lg mt-8">
            {totalReviews} Review
            {totalReviews > 1 ? "s" : ""}
          </p>
          <p className="text-base text-blue-600 mt-0 font-sans flex flex-row  items-center gap-1">
            View <LucideArrowRight size={16} />
          </p>
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
  const fetchSellerDashboard = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/seller/get-seller/${user?.id}`);
      const data = res.data;
      // console.log(data);
      

      const map = new Map();

      // ---------- 1. Product Reviews ----------
      data.productSeller?.forEach((product) => {
        if (product.review.length > 0) {
          const ratings = product.review.map((r) => r.rating);
          const avgRating = ratings.reduce((a, b) => a + b, 0) / ratings.length;

          map.set(`product-${product.id}`, {
            key: `product-${product.id}`,
            name: product.name,
            images: product.images,
            avgRating,
            totalReviews: ratings.length,
            type: "product",
            id: product.id,
          });
        }
      });

      // ---------- 2. Marketplace Reviews ----------
      data.marketplaces?.forEach((mp) => {
        if (mp.reviews.length > 0) {
          const ratings = mp.reviews.map((r) => r.rating);
          const avgRating = ratings.reduce((a, b) => a + b, 0) / ratings.length;

          map.set(`marketplace-${mp.id}`, {
            key: `marketplace-${mp.id}`,
            name: mp.name,
            images: mp.imageUrl,
            avgRating,
            totalReviews: ratings.length,
            type: "marketplace",
            id: mp.id,
          });
        }
      });

      // ---------- 3. Property Reviews ----------
      data.properties?.forEach((prop) => {
        if (prop.reviews.length > 0) {
          const ratings = prop.reviews.map((r) => r.rating);
          const avgRating = ratings.reduce((a, b) => a + b, 0) / ratings.length;

          map.set(`property-${prop.id}`, {
            key: `property-${prop.id}`,
            name: prop.name,
            images: prop.imageUrl,
            avgRating,
            totalReviews: ratings.length,
            type: "property",
            id: prop.id,
          });
        }
      });

      const finalArr = Array.from(map.values());
      setProductsWithReviews(finalArr);
    } catch (err) {
      console.error("Failed to fetch seller dashboard data", err);
    }
  };

  if (user?.id) {
    fetchSellerDashboard();
  }
}, [user?.id]);




  if (productsWithReviews === undefined) return <Loader />;
  if (productsWithReviews.length === 0)
    return (
      <div className="flex items-center justify-center h-screen text-center">
        <h2 className="text-3xl font-semibold text-gray-800">
          No reviews yet.
        </h2>
      </div>
    );

  return (
    <div className="container mx-auto p-4 mb-16">
      {/* Header */}
      <div className="flex items-center h-14 text-black mb-2">
        <ChevronLeft
          className="w-8 h-8 cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <h2 className="flex-1 text-2xl text-center font-semibold">
          My Product Reviews
        </h2>
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