import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import { MdStar, MdStarBorder } from "react-icons/md";

const ProductReviews = () => {
  const [activeTab, setActiveTab] = useState("All");

  const [productData] = useState({
    id: "B1001",
    name: "Coinverge Radiance",
    rating: 4.5,
    totalRatings: 5,
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
    description:
      "Indulge your skin in the gentle luxury of the Coinverge Radiance Duo, featuring a lightweight face serum and ultra-hydrating cream. This dynamic duo works harmoniously to deliver a subtle yet brilliant glow, enhancing your tone and texture of lighter.",

    reviewsList: [
      {
        id: 1,
        user: "Riya Sharma",
        rating: 5,
        comment:
          "Absolutely love this duo! My skin feels softer and more radiant within just a few uses. The serum absorbs quickly and the cream feels super luxurious.",
      },
      {
        id: 2,
        user: "Ankita Mehta",
        rating: 4,
        comment:
          "Really impressed with the texture and scent. It's light, not greasy, and gives my skin a healthy glow. Just wish it was a bit more affordable!",
      },
      {
        id: 3,
        user: "Rahul Gour",
        rating: 3,
        comment:
          "Really impressed with the texture and scent. It's light, not greasy, and gives my skin a healthy glow. Just wish it was a bit more affordable!",
      },
      {
        id: 4,
        user: "Ritika Sharma",
        rating: 2,
        comment:
          "Really impressed with the texture and scent. It's light, not greasy, and gives my skin a healthy glow. Just wish it was a bit more affordable!",
      },
    ],
  });

  const tabs = ["All", "1", "2", "3", "4", "5"];

  const filteredReviews =
    activeTab === "All"
      ? productData.reviewsList
      : productData.reviewsList.filter(
          (review) => String(review.rating) === activeTab
        );

        const [showFullDescription, setShowFullDescription] = useState(false);

  const handleGoBack = () => {
    window.history.back();
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) =>
      i < Math.floor(rating) ? (
        <MdStar key={i} className="w-4 h-4 text-yellow-400" />
      ) : (
        <MdStarBorder key={i} className="w-4 h-4 text-black" />
      )
    );
  };

  const renderUserStars = (rating) => {
    return [...Array(5)].map((_, i) =>
      i < Math.floor(rating) ? (
        <MdStar key={i} className="w-4 h-4 text-yellow-400" />
      ) : (
        <MdStarBorder key={i} className="w-4 h-4 text-yellow-400" />
      )
    );
  };

  if (!productData) return <p className="p-4 text-center">Loading...</p>;
  return (
    <div className="container mx-auto p-4 mb-6">
      {/* Header */}

      <div className="flex items-center h-14 mb-4 text-black">
    
        <ChevronLeft
          className="w-8 h-8 cursor-pointer"
          onClick={handleGoBack}
        />
        <h2 className="flex-1 text-xl text-center">
          Products ID: {productData.id}
        </h2>
      </div>

      <div className=" py-4 space-y-4">
        {/* Product Image */}
        <div className="w-full h-64 rounded-lg overflow-hidden">
          <img
            src={productData.image}
            alt={productData.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Product Info */}
        <div className="space-y-3">
          <h2 className="text-xl font-medium text-black">{productData.name}</h2>

          <div className="flex items-center space-x-1">
            <div className="flex items-center ">
              {renderStars(productData.rating)}
            </div>
            <span className="text-sm text-gray-600">
              ({productData.rating}/{productData.totalRatings})
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2 pb-4">
          <h3 className="text-lg font-medium text-black">Description</h3>
          <p className="text-sm text-black mb-5 leading-tight font-extralight max-w-[95%]">
                  {!showFullDescription && productData.description.length > 150 ? (
                    <>
                      {productData.description.slice(0, 150)}...
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
                      {productData.description}
                      {productData.description.length > 80 && (
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
        </div>

        {/* Reviews Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-black">
              Review ({filteredReviews.length})
            </h3>
           
          </div>

          {/* Review Tabs */}
          <div className="flex items-center space-x-4  ">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex px-3 py-1 text-sm  rounded-lg transition-colors ${
                  activeTab === tab
                    ? "  bg-black text-white"
                    : "text-black border-gray-200 border-2 hover:text-gray-700"
                }`}
              >
                {tab !== "All" && (
                  <MdStar className="w-4 h-4 text-yellow-400" />
                )}
                {tab}
              </button>
            ))}
          </div>

          
          {/* Reviews List */}
          <div className="-space-y-4">
            {filteredReviews.length === 0 ? (
              <div className="text-gray-400 text-center py-4">
                No reviews found.
              </div>
            ) : (
              filteredReviews.map((review) => (
                <Card key={review.id} className=" border-none shadow-none">
                  <CardContent className="px-2">
                    <div className="space-y-1">
                      <div className="flex items-center ">
                        {renderUserStars(review.rating)}
                      </div>
                      <h4 className="text-sm font-medium text-black">
                        {review.user}
                      </h4>
                      <p className="text-sm text-gray-800 leading-relaxed">
                        "{review.comment}"
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductReviews;
