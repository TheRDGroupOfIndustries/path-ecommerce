import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import { MdStar, MdStarBorder } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Loader from "@/components/Loader/Loader";
import { API_URL } from "@/lib/api.env";

const ReviewsPage = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [entityInfo, setEntityInfo] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const navigate = useNavigate();
  const { type, id } = useParams();

  const tabs = ["All", "1", "2", "3", "4", "5"];

  useEffect(() => {
    if (!type || !id) return;

    const fetchReviews = async () => {
      try {
        const reviewRes = await axios.get(
          `${API_URL}/api/review/${type}/${id}`
        );
        const reviewsData = reviewRes.data;

        if (!reviewsData.length) {
          setReviews([]);
          setEntityInfo(null);
          setAverageRating(0);
          return;
        }

        const firstReview = reviewsData[0];
        let info = null;
        if (type === "product") info = firstReview.product;
        else if (type === "marketplace") info = firstReview.marketplace;
        else if (type === "property") info = firstReview.property;

        setEntityInfo(info);

        const totalRating = reviewsData.reduce((sum, r) => sum + r.rating, 0);
        const avgRating = totalRating / reviewsData.length;
        setAverageRating(avgRating);

        setReviews(reviewsData);
      } catch (err) {
        console.error("Failed to fetch reviews", err);
      }
    };

    fetchReviews();
  }, [type, id]);

  const filteredReviews =
    activeTab === "All"
      ? reviews
      : reviews.filter((r) => String(r.rating) === activeTab);

  const renderStars = (rating) =>
    [...Array(5)].map((_, i) =>
      i < Math.floor(rating) ? (
        <MdStar key={i} className="w-4 h-4 text-yellow-400" />
      ) : (
        <MdStarBorder key={i} className="w-4 h-4 text-black" />
      )
    );

  const renderUserStars = (rating) =>
    [...Array(5)].map((_, i) =>
      i < Math.floor(rating) ? (
        <MdStar key={i} className="w-4 h-4 text-yellow-400" />
      ) : (
        <MdStarBorder key={i} className="w-4 h-4 text-yellow-400" />
      )
    );

  if (!entityInfo) return <Loader />;

  return (
    <div className="container mx-auto sm:px-6  mb-16 p-4">
      {/* Header */}
      <div className="flex items-center h-14 mb-4 text-black">
        <ChevronLeft
          className="w-8 h-8 cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <h2 className="flex-1 text-xl font-semibold text-center">
          {entityInfo.name}
        </h2>
      </div>

      <div className="space-y-6">
        {/* Image */}
        <div className="w-full h-64 sm:h-72 md:h-80 lg:h-[28rem] object-cover rounded-xl">
          <img
            src={
              Array.isArray(entityInfo.imageUrl)
                ? entityInfo.imageUrl[0]
                : entityInfo.images?.[0] || entityInfo.imageUrl
            }
            alt={entityInfo.name}
            className="w-full h-full object-cover rounded-2xl"
          />
        </div>

        {/* Info */}
        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-medium text-black">
            {entityInfo.name}
          </h2>
          <div className="flex items-center space-x-2">
            <div className="flex">{renderStars(averageRating)}</div>
            <span className="text-sm sm:text-base text-blue-600">
              ({averageRating.toFixed(1)} / 5) {reviews.length} review
              {reviews.length > 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <h3 className="text-lg sm:text-xl md:text-xl font-medium text-black">
            Description
          </h3>
          <p className="text-sm leading-relaxed text-black font-light">
            {!showFullDescription && entityInfo.description?.length > 150 ? (
              <>
                {entityInfo.description.slice(0, 150)}...
                <button
                  className="text-blue-700 ml-1"
                  onClick={() => setShowFullDescription(true)}
                  type="button"
                >
                  more
                </button>
              </>
            ) : (
              <>
                {entityInfo.description}
                {entityInfo.description?.length > 80 && (
                  <button
                    className="text-blue-700 ml-1"
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
        <div className="space-y-4">
          <div className="text-lg sm:text-xl md:text-xl  flex items-center justify-between">
            <h3 className="font-medium text-black">
              Reviews ({filteredReviews.length})
            </h3>
          </div>

          {/* Tabs */}

          <div className="flex overflow-x-auto space-x-3 scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center px-4 py-2 text-sm rounded-xl whitespace-nowrap transition-colors ${
                  activeTab === tab
                    ? "bg-black text-white"
                    : "text-black border border-gray-300 hover:text-gray-700"
                }`}
              >
                {tab !== "All" && (
                  <MdStar className="w-4 h-4 text-yellow-400 mr-1" />
                )}
                {tab}
              </button>
            ))}
          </div>

          {/* Reviews */}
          <div className="space-y-0">
            {filteredReviews.length === 0 ? (
              <div className="text-gray-500 text-center text-sm  sm:text-xl md:text-xl py-4">
                No reviews found.
              </div>
            ) : (
              filteredReviews.map((review) => (
                <Card key={review.id} className="border-none shadow-none  ">
                  <CardContent className="space-y-1 p-0">
                    <div className="flex items-center">
                      {renderUserStars(review.rating)}
                    </div>
                    <h4 className="text-sm font-semibold text-black">
                      {review.user.name}
                    </h4>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {review.comment}
                    </p>
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

export default ReviewsPage;
