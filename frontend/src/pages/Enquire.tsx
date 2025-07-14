import { ChevronLeft, Heart, Star } from "lucide-react";
import React, { useEffect, useState } from "react";
import SendEnquire from "./SendEnquire";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "@/lib/api.temp";
import { MdStar, MdStarBorder } from "react-icons/md";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/authContext";

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

  const handleSubmitReview = async () => {
    if (!userRating || !userReview.trim()) {
      toast.error("Please give a rating and write a review.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:8000/api/review", {
        productId: id,
        rating: userRating,
        comment: userReview,
        userId: user?.id,
      });
      console.log("Res: ", res);

      toast.success("Review submitted successfully!");
      setUserRating(0);
      setUserReview("");
    } catch (error) {
      console.error("Failed to submit review:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const endpoint = `${API_URL}/api/${type}/get-by-id/${id}`;
        const res = await axios.get(endpoint);
        // console.log("end: ", res);
        const list =
          type == "marketplace" ? res.data.marketplace : res.data.properties;

        const sellerId = list.createdById;
        const userEndpoint = `${API_URL}/api/users/get-by-id/${sellerId}`;
        const userRes = await axios.get(userEndpoint);

        const userData = userRes.data.user;
        setProperty(list);
        setSeller(userData);
        setMainImageIndex(0);
      } catch (err) {
        console.error("Failed to fetch property", err);
      }
    };

    fetchProperty();
  }, [id, type]);

  const renderUserStars = (rating) =>
    [...Array(5)].map((_, i) =>
      i < Math.floor(rating) ? (
        <MdStar key={i} className="w-4 h-4 text-yellow-400" />
      ) : (
        <MdStarBorder key={i} className="w-4 h-4 text-yellow-400" />
      )
    );

  return (
    <div className="w-full mx-auto bg-white min-h-screen relative pb-24">
      <div className="flex items-center justify-between p-4 bg-white">
        <ChevronLeft
          className="w-6 h-6 text-gray-600 cursor-pointer"
          // onClick={() => {
          //   if (type === "marketplace") {
          //     navigate("/all-service");
          //   } else {
          //     navigate("/houses-plots");
          //   }
          // }}
          onClick={() => navigate(-1)}
        />

        <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-medium">
          {property?.category}
        </span>
      </div>

      {/* Main Image */}
      <div className="px-4 mb-4">
        <img
          src={
            property?.imageUrl && property?.imageUrl.length > 0
              ? property?.imageUrl[mainImageIndex]
              : "https://placehold.co/600x400"
          }
          alt="Main property"
          className="w-full h-64 object-cover rounded-lg"
        />
      </div>

      {/* Thumbnail Images */}
      <div className="flex gap-2 px-4 mb-6 overflow-x-auto">
        {property?.imageUrl &&
          property?.imageUrl.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`Thumbnail ${idx + 1}`}
              className={`w-16 h-16 object-cover rounded-lg cursor-pointer border-2 ${
                mainImageIndex === idx
                  ? "border-cyan-400"
                  : "border-transparent"
              }`}
              onClick={() => setMainImageIndex(idx)}
            />
          ))}
      </div>

      {/* Seller Info */}
      <div className="px-4 mb-4">
        <p className="text-cyan-400 text-sm mb-1 underline underline-offset-2">
          {seller?.name}
        </p>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          {property?.name}
        </h1>
        <div className="flex items-center gap-1 bg-gray-200 w-fit px-1 ">
          <span className="text-lg text-black">4.5</span>
          {/* Vertical divider */}
          <div className="h-4 w-px bg-black mx-2" />
          <Star className="w-4 h-4 fill-current text-cyan-400" />
        </div>
      </div>

      {/* Description */}
      <div className="px-4 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Description
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          {property?.description}
        </p>
      </div>

      <div className="px-4 mb-6">
        <h2 className="text-md font-semibold mb-2 text-gray-800">
          Add a Review
        </h2>
        {/* Star Rating */}
        <div className="flex gap-1 mb-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <MdStar
              key={star}
              onClick={() => setUserRating(star)}
              className={`w-6 h-6 cursor-pointer ${
                userRating >= star
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-400"
              }`}
            />
          ))}
        </div>
        {/* Review Textarea */}
        <textarea
          value={userReview}
          onChange={(e) => setUserReview(e.target.value)}
          placeholder="Write your review here..."
          rows={3}
          className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />{" "}
        <div className="flex justify-end">
          <Button
            onClick={handleSubmitReview}
            className="mt-3 primary-bg-dark hover:primary-bg text-white font-medium px-6 py-3 rounded-lg"
          >
            Submit Review
          </Button>
        </div>
      </div>

      {/* Reviews */}
      <div className="px-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Reviews</h2>

        {/* Review 1 */}
        <div className="flex gap-3 mb-4 flex-col">
          <div className="flex flex-row justify-start items-center gap-3">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
              alt="Adarsh Pandit"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <span className="flex items-center">{renderUserStars(4)}</span>
              <h3 className="font-medium text-gray-900 text-sm">
                Adarsh Pandit
              </h3>
            </div>
          </div>

          <div className="flex-1">
            <p className="text-gray-600 text-xs mt-1 leading-relaxed">
              Lorem ipsum dolor sit amet consectetur. Turpis sit ante ut velit
              et sagittis aliquot in. Luctus nisi quam facilisis pretium
              adipiscing nulla magna. Suspendisse fames quis gravida est.
              Habitant vitae dictum feugiat lorem velit lobortis suspendisse
              donec.
            </p>
          </div>
        </div>

        {/* Review 2 */}
        <div className="flex gap-3 mb-4 flex-col">
          <div className="flex flex-row justify-start items-center gap-3">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
              alt="Adarsh Pandit"
              className="w-10 h-10 rounded-full object-cover"
            />
           <div>
              <span className="flex items-center">{renderUserStars(4)}</span>
              <h3 className="font-medium text-gray-900 text-sm">
                Adarsh Pandit
              </h3>
            </div>
          </div>

          <div className="flex-1">
            <p className="text-gray-600 text-xs mt-1 leading-relaxed">
              Lorem ipsum dolor sit amet consectetur. Turpis sit ante ut velit
              et sagittis aliquot in. Luctus nisi quam facilisis pretium
              adipiscing nulla magna. Suspendisse fames quis gravida est.
              Habitant vitae dictum feugiat lorem velit lobortis suspendisse
              donec.
            </p>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-60 w-full">
        <div className="relative w-full bg-black text-white  py-5 px-4 shadow-lg flex items-center justify-between  primary-bg-dark">
          <span
            className="text-base w-5/6 text-center px-6 py-2 rounded-full bg-white/20"
            onClick={() => setShowPopup(true)}
          >
            Enquire Now
          </span>
          <button
            className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center justify-center"
            aria-label="Like"
          >
            <Heart className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>
      {showPopup && (
        <SendEnquire setShowPopup={setShowPopup} id={id} type={type} />
      )}
    </div>
  );
};

export default Enquire;
