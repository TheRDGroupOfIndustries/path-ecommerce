import { ChevronLeft, Star } from "lucide-react";
import React, { useEffect, useState } from "react";
import SendEnquire from "./SendEnquire";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Loader from "@/components/Loader/Loader";
import { MdStar, MdStarBorder } from "react-icons/md";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/authContext";
import PROIFLE_IMAGE from "@/assets/user_img.png";
import { API_URL } from "@/lib/api.env";

const Enquire = () => {
  const { user } = useAuth();
  const [showPopup, setShowPopup] = useState(false);
  const [property, setProperty] = useState(null);
  const [seller, setSeller] = useState(null);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const { id, type } = useParams();
  const navigate = useNavigate();

  const [userRating, setUserRating] = useState(0);
  const [userReview, setUserReview] = useState("");
  const [reviews, setReviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitReview = async () => {
    if (!userRating || !userReview.trim()) {
      toast.error("Please give a rating and write a review.");
      return;
    }
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      const payload: any = {
        rating: userRating,
        comment: userReview,
        userId: user?.id,
      };

      if (type === "marketplace") {
        payload.marketplaceId = id;
      } else if (type === "property") {
        payload.propertyId = id;
      } else {
        payload.productId = id;
      }

      const res = await axios.post(`${API_URL}/api/review`, payload);
      toast.success("Review submitted successfully!");
      setUserRating(0);
      setUserReview("");
      await fetchReviews();
    } catch (error) {
      console.error("Failed to submit review:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchReviews = async () => {
    try {
      let endpoint = "";
      if (type === "marketplace") {
        endpoint = `${API_URL}/api/review/marketplace/${id}`;
      } else if (type === "property") {
        endpoint = `${API_URL}/api/review/property/${id}`;
      } else {
        return;
      }

      const res = await axios.get(endpoint);
      setReviews(res.data);
    } catch (err) {
      console.error("Failed to fetch reviews", err);
    }
  };

  const averageRating = reviews.length
    ? (
        reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      ).toFixed(1)
    : "0.0";

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const endpoint = `${API_URL}/api/${type}/get-by-id/${id}`;
        const res = await axios.get(endpoint);

        const list =
          type === "marketplace" ? res.data.marketplace : res.data.properties;

        const sellerId = list.createdById;
        const userEndpoint = `${API_URL}/api/users/get-by-id/${sellerId}`;
        const userRes = await axios.get(userEndpoint);

        setProperty(list);
        setSeller(userRes.data.user);
        setMainImageIndex(0);
      } catch (err) {
        console.error("Failed to fetch property", err);
      }
    };

    fetchProperty();
    fetchReviews();
  }, [id, type]);

  const renderUserStars = (rating) =>
    [...Array(5)].map((_, i) =>
      i < Math.floor(rating) ? (
        <MdStar key={i} className="w-4 h-4 text-yellow-400" />
      ) : (
        <MdStarBorder key={i} className="w-4 h-4 text-yellow-400" />
      )
    );

  if (!property || !seller) return <Loader />;

  return (
    <div className="w-full mx-auto bg-white container p-2 relative mb-16 md:mb-0">

      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white">
        <ChevronLeft
          className="w-8 h-8 text-gray-600 cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-medium">
          {property?.category}
        </span>
      </div>

      {/* Main content container - image and details side by side on desktop */}
      <div className="px-4 mb-6 flex flex-col md:flex-row gap-6">
        {/* Image section (2/3 width on desktop) */}
        <div className="w-full md:w-2/3">
          <img
            src={
              property?.imageUrl && property?.imageUrl.length > 0
                ? property?.imageUrl[mainImageIndex]
                : "https://placehold.co/600x400"
            }
            alt="Main property"
            className="w-full h-64 sm:h-72 md:h-80 lg:h-[28rem] object-cover rounded-lg border border-cyan-400"
          />
          {/* Thumbnails below image */}
          <div className="flex gap-2 mt-4 overflow-x-auto">
            {property?.imageUrl &&
              property?.imageUrl.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  className={`w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg cursor-pointer border-2 ${
                    mainImageIndex === idx
                      ? "border-cyan-400"
                      : "border-transparent"
                  }`}
                  onClick={() => setMainImageIndex(idx)}
                />
              ))}
          </div>
        </div>

        {/* Info section (1/3 width on desktop) */}
        <div className="w-full md:w-1/3 flex flex-col justify-start gap-4">
          {/* Seller Info */}
          <div className="space-y-3">
            <p className="text-cyan-400 text-sm mb-1 underline underline-offset-2">
              {seller?.name}
            </p>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 mb-2">
              {property?.name}
            </h1>
            <div className="flex items-center gap-1 bg-gray-200 w-fit px-1 rounded">
              <span className="text-lg text-black">{averageRating}</span>
              <div className="h-4 w-px bg-black mx-2" />
              <Star className="w-4 h-4 fill-current text-cyan-400" />
            </div>
            <div className=" mb-6">
              <h2 className="text-xl sm:text-2xl md:text-2xl font-semibold text-gray-900 mb-2">
                Description
              </h2>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                {property?.description}
              </p>
            </div>
          </div>

          {/* Enquire Now Button */}
          <div className="hidden md:block px-4 mb-4">
            <Button
              onClick={() => setShowPopup(true)}
              // className="w-full primary-bg-dark text-white py-3 rounded-full text-lg font-semibold hover: transition"
              className="w-full bg-blue-500 text-white py-5 rounded-full text-lg font-semibold hover:bg-white hover:text-black transition-colors duration-300 border-2 "
            >
              Enquire Now
            </Button>
          </div>

          {/* Mobile fixed bottom button */}
          <div className="fixed bottom-0 left-0 right-0 z-60 w-full md:hidden">
            <div className="relative w-full bg-black text-white  py-5 px-4 shadow-lg flex items-center justify-between  primary-bg-dark">
              <span
                className="cursor-pointer text-base w-full text-center px-6 py-2 rounded-full bg-white/20  hover:bg-white transition hover:text-black"
                onClick={() => setShowPopup(true)}
              >
                Enquire Now
              </span>
              {/* <button
            className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center justify-center"
            aria-label="Like"
          >
            <Heart className="w-6 h-6 text-white" />
          </button> */}
            </div>
          </div>
        </div>
      </div>

      {/* Description */}

      {/* Add a review section */}
      <div className="px-4 mb-6">
        <h2 className="text-xl sm:text-2xl md:text-2xl font-semibold text-gray-800 mb-3">
          Add a Review
        </h2>
        <div className="flex gap-2 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <MdStar
              key={star}
              onClick={() => setUserRating(star)}
              className={`w-8 h-8 cursor-pointer ${
                userRating >= star
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-400"
              }`}
            />
          ))}
        </div>
        <textarea
          value={userReview}
          onChange={(e) => setUserReview(e.target.value)}
          placeholder="Write your review here..."
          rows={3}
          className="text-sm sm:text-base md:text-lg w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
        />
        <div className="flex justify-end mt-3">
          <Button
            onClick={handleSubmitReview}
            className="primary-bg-dark hover:primary-bg text-white font-medium px-6 py-3 rounded-lg cursor-pointer"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </div>
      </div>

      {/* Reviews List */}
      <div className="px-4 mb-6">
        <h2 className="text-xl sm:text-2xl md:text-2xl font-semibold text-gray-900 mb-4">
          Reviews
        </h2>
        {reviews.length > 0 ? (
          reviews.map((review, idx) => (
            <div key={idx} className="flex gap-3 mb-6 flex-col">
              <div className="flex items-center gap-3">
                <img
                  src={review.user.imageUrl || PROIFLE_IMAGE}
                  alt={review.user.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <span className="flex items-center">
                    {renderUserStars(review.rating)}
                  </span>
                  <h3 className="font-medium text-gray-900 text-base">
                    {review.user.name}
                  </h3>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed break-words">
                {review.comment}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm text-center">No reviews yet.</p>
        )}
      </div>

      {showPopup && (
        
        <SendEnquire setShowPopup={setShowPopup} id={id} type={type} />
      )}
    </div>
  );
};

export default Enquire;
