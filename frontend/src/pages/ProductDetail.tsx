import { ChevronLeft, Star } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { MdStar, MdStarBorder } from "react-icons/md";
import toast from "react-hot-toast";
import { useAuth } from "@/context/authContext";
import { API_URL } from "@/lib/api.env";
import Loader from "@/components/Loader/Loader";
import { Card, CardContent } from "@/components/ui/card";

const ProductDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [seller, setSeller] = useState(null);
  const [disable, setDisable] = useState(false);
  const [referralCode, setReferralCode] = useState("");
  const [referralStep, setReferralStep] = useState("check"); // check | apply | applied
  const [referralError, setReferralError] = useState("");
  const [referralDiscount, setReferralDiscount] = useState(0);
  const [isCart, setCart] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [userReview, setUserReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState([]);
  useEffect(() => {
    const fetchProduct = async () => {
      
      try {
        const res = await axios.get(`${API_URL}/api/product/get-by-id/${id}`);
        // console.log("Res: ",res);
        
        const found = res.data;
        const userData = res.data.seller;

        if (userData.cartItems.length > 0) {
          const prod = userData.cartItems.map((items) => items.productId);

          if (prod.includes(id)) {
            setCart(true);
          }
        }

        setProduct(found);
        setSeller(userData);
        setMainImageIndex(0);
      } catch (err) {
        console.error("Failed to fetch product", err);
      }
    };

    fetchProduct();
  }, [id, isCart]);

  useEffect(() => {
    if (!id) return;

    const fetchReviews = async () => {
      try {
        const reviewRes = await axios.get(
          `${API_URL}/api/review/product/${id}`
        );
        const reviewsData = reviewRes.data;
        // console.log("review: ", reviewsData);

        if (!reviewsData.length) {
          setReviews([]);
          return;
        }

        // const totalRating = reviewsData.reduce((sum, r) => sum + r.rating, 0);
        // const avgRating = totalRating / reviewsData.length;
        // setAverageRating(avgRating);

        setReviews(reviewsData);
      } catch (err) {
        console.error("Failed to fetch reviews", err);
      }
    };

    fetchReviews();
  }, [id]);
  const renderUserStars = (rating) =>
    [...Array(5)].map((_, i) =>
      i < Math.floor(rating) ? (
        <MdStar key={i} className="w-4 h-4 text-yellow-400" />
      ) : (
        <MdStarBorder key={i} className="w-4 h-4 text-yellow-400" />
      )
    );

  const checkPriceValidity = (additionalDiscount) => {
    if (!product) return false;

    const totalDiscount = product.discount + additionalDiscount;
    const finalPrice = product.price - (product.price * totalDiscount) / 100;

    return finalPrice >= 0;
  };

  // const handleReferralButtonClick = async () => {
  //   const code = referralCode.trim().toLowerCase();

  //   if (referralStep === "check") {
  //     const isValidFormat = /^[a-zA-Z]+-\d+$/.test(code);
  //     if (!isValidFormat) {
  //       setReferralError("Invalid format. Use like 'adarsh-40'");
  //       return;
  //     }

  //     try {
  //       setLoading(true);
  //       const res = await axios.post(
  //         `${API_URL}/api/referral/check`,
  //         {
  //           code,
  //           productId: id,
  //          userId: user?.id ?? "",
  //         },
  //         {
  //           headers: {
  //             Authorization: `Bearer ${localStorage.getItem("token")}`,
  //           },
  //         }
  //       );

  //       if (res.status != 200) {
  //         setReferralError("Referral code not found or expired.");
  //         return;
  //       }

  //       const discount = parseInt(code.split("-")[1]);
  //       if (!checkPriceValidity(discount)) {
  //         setReferralError("This coupon is not applicable for this product.");
  //         setReferralStep("check");
  //         setReferralCode("");
  //         setReferralDiscount(0);
  //         return;
  //       }
  //       // setReferralDiscount(discount);
  //       setReferralStep("apply");
  //       setReferralError("");
  //       setLoading(false);
  //     } catch (err) {
  //       // console.error("Referral validation failed:", err);
  //       // setReferralError("Something went wrong. Please try again.");
  //       if (err.response && err.response.status === 404) {
  //         setReferralError("Referral code not found or expired.");
  //       } else if (
  //         err.response &&
  //         err.response.data &&
  //         err.response.data.error
  //       ) {
  //         setReferralError(err.response.data.error);
  //       } else {
  //         setReferralError("Something went wrong. Please try again.");
  //       }
  //     } finally {
  //       setLoading(false);
  //     }
  //   } else if (referralStep === "apply") {
  //     try {
  //       setLoading(true);
  //       const res = await axios.post(
  //         `${API_URL}/api/referral/apply`,
  //         {
  //           code,
  //           productId: id,
  //          userId: user?.id ?? "",
  //         },
  //         {
  //           headers: {
  //             Authorization: `Bearer ${localStorage.getItem("token")}`,
  //           },
  //         }
  //       );
  //       if (res.status == 200) {
  //         const discount = parseInt(code.split("-")[1]);
  //         setReferralDiscount(discount);
  //         setReferralStep("applied");
  //         setLoading(false);
  //       } else {
  //         setReferralError("Something went wrong. Please try again.");
  //       }
  //     } catch (error) {
  //       const errorMessage =
  //         error.response?.data?.message ||
  //         error.response?.data?.error ||
  //         "Something went wrong";
  //       toast.error(errorMessage);
  //       setReferralError(errorMessage);
  //       setReferralStep("check");
  //       setReferralDiscount(0);
  //     }
  //   }
  // };

const handleReferralButtonClick = async () => {
  const code = referralCode.trim().toLowerCase();

  if (referralStep === "check") {
    const isValidFormat = /^[a-zA-Z]+-\d+$/.test(code);
    if (!isValidFormat) {
      setReferralError("Invalid format. Use like 'adarsh-40'");
      return;
    }

    try {
      setLoading(true);
      console.log("🔍 Sending referral CHECK request with:", {
        code,
        productId: id,
        userId: user?.id ?? "",
      });

      const res = await axios.post(
        `${API_URL}/api/referral/check`,
        {
          code,
          productId: id,
          userId: user?.id ?? "",
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("CHECK Response:", res.data);

      if (res.status !== 200) {
        setReferralError("Referral code not found or expired.");
        return;
      }

      const discount = parseInt(code.split("-")[1]);
      if (!checkPriceValidity(discount)) {
        setReferralError("This coupon is not applicable for this product.");
        setReferralStep("check");
        setReferralCode("");
        setReferralDiscount(0);
        return;
      }

      setReferralStep("apply");
      setReferralError("");
      setLoading(false);
    } catch (err) {
      console.error(" CHECK Referral validation failed:", err);

      if (err.response && err.response.status === 404) {
        setReferralError("Referral code not found or expired.");
      } else if (
        err.response &&
        err.response.data &&
        err.response.data.error
      ) {
        setReferralError(err.response.data.error);
      } else {
        setReferralError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  } else if (referralStep === "apply") {
  try {
    setLoading(true);
    // console.log(" Sending referral APPLY request with:", {
    //   code,
    //   productId: id,
    //   userId: user?.id ?? "",
    // });

    const res = await axios.post(
      `${API_URL}/api/referral/apply`,
      {
        code,
        productId: id,
        userId: user?.id ?? "",
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    // console.log("APPLY Response:", res.data);

    if (res.status === 200) {
      const discount = parseInt(code.split("-")[1]);
      setReferralDiscount(discount);
      setReferralStep("applied");
    } else if (res.status === 400) {
      setReferralError("Referral code already used by you.");
      toast.error("Same referral cannot use twice.");
      setReferralStep("check");
      setReferralDiscount(0);
    } else {
      setReferralError("Something went wrong. Please try again.");
    }
  } catch (error) {
    console.error("APPLY Referral failed:", error);

    const status = error.response?.status;
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Something went wrong";

    if (status === 400) {
      // Referral already used by user
      toast.error("Referral code already used by you.");
      setReferralError("Referral code already used by you.");
    } else {
      toast.error(errorMessage);
      setReferralError(errorMessage);
    }

    setReferralStep("check");
    setReferralDiscount(0);
  } finally {
    setLoading(false);
  }
}
};


  const handleSubmitReview = async () => {
    if (!userRating || !userReview.trim()) {
      toast.error("Please give a rating and write a review.");
      return;
    }

    try {
      await axios.post(`${API_URL}/api/review`, {
        productId: id,
        rating: userRating,
        comment: userReview,
        userId: user?.id,
      });

      toast.success("Review submitted successfully!");
      setUserRating(0);
      setUserReview("");
    } catch (error) {
      console.error("Failed to submit review:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast.error("Please login to add items to your cart.");
      return;
    }

    try {
      setDisable(true);
      const res = await axios.post(
        `${API_URL}/api/cart/add`,
        {
          productId: id,
          quantity: 1,
          referralCode
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      // console.log("Submit: ",res);
      
      if (res.status === 201) {
        setCart(true);
        setDisable(false);
      }
      toast.success("Item added to cart!");
    } catch (error) {
      console.error("Add to cart failed:", error);
      if (error.response?.status === 401) {
        toast.error("Unauthorized. Please login.");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  const calculateFinalPrice = () => {
    if (!product) return 0;

    const totalDiscount =
      product.discount + (referralStep === "applied" ? referralDiscount : 0);
    const finalPrice = product.price - (product.price * totalDiscount) / 100;

    return Math.max(0, finalPrice);
  };

  if (!product) return <Loader />;

  return (
    <div className="w-full mx-auto bg-white container p-2 relative mb-16">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white">
        <ChevronLeft
          className="w-8 h-8 text-gray-600 cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-medium">
          {product.category}
        </span>
      </div>

      {/* Container for image and product info side by side on desktop */}
      <div className="px-4 mb-4 flex flex-col md:flex-row gap-6">
        {/* Image section: full width on mobile, 4/5 width desktop */}
        <div className="w-full md:w-2/3">
          <img
            src={product.images?.[mainImageIndex]}
            alt="Main Product"
            className="w-full h-64 sm:h-72 md:h-80 lg:h-[28rem] object-cover rounded-lg border border-cyan-400"
          />
          {/* Thumbnails below image, full width */}
          <div className="flex gap-2 mt-4 overflow-x-auto">
            {product.images?.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Thumb ${idx + 1}`}
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

        {/* Info section: full width on mobile, 1/5 width on desktop */}
        <div className="w-full md:w-1/3 flex flex-col justify-start gap-2">
          <div className="flex flex-col gap-3">
            <p className="text-cyan-400 text-sm underline underline-offset-2">
              {seller?.name}
            </p>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900">
              {product.name}
            </h1>
            <div className="flex items-center gap-1 bg-gray-200 w-fit px-2 rounded">
              <span className="text-lg text-black">{product.ratings}</span>
              <div className="h-4 w-px bg-black mx-2" />
              <Star className="w-4 h-4 fill-current text-cyan-400" />
            </div>
            <p className="text-gray-600 text-sm mb-2">{product.description}</p>

            <div className="mt-2 text-lg sm:text-xl md:text-2xl font-semibold text-cyan-700">
              ₹ {calculateFinalPrice().toFixed(0)}
              <span className="text-sm text-gray-500 line-through ml-2">
                ₹ {product.price}
              </span>
              <span className="ml-2 text-sm text-red-600 font-medium">
                (
                {product.discount +
                  (referralStep === "applied" ? referralDiscount : 0)}
                % OFF)
              </span>
            </div>
          </div>

          {/* Buttons shown here on desktop */}
          <div className="hidden flex-col gap-3  md:flex">
            <Button
              onClick={() =>
                navigate(`/buy-now/${product.id}/${btoa(referralCode)}`)
              }
              // className="w-full bg-white cursor-pointer text-black px-4 py-3 rounded-full text-base font-medium hover:bg-white/80 shadow transition-all"
              className="w-full bg-blue-500 text-black px-4 py-5 rounded-full text-lg font-medium  border-2 transition-all hover:text-black hover:bg-white"
            >
              Buy Now
            </Button>
            <Button
              disabled={disable}
              onClick={isCart ? () => navigate("/my-cart") : handleAddToCart}
              className={`w-full cursor-pointer bg-black px-4 py-5 text-white hover:bg-white hover:text-black rounded-full text-lg font-medium  ${
                isCart ? "border-2" : "border-2"
              }`}
            >
              {isCart ? "View in cart" : "Add to Cart"}
            </Button>
          </div>
        </div>
      </div>

      {/* Referral Code Field */}
      <div className="px-4 mb-4">
        <label className="block text-md font-semibold mb-1 text-gray-800">
          Referral Code
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={referralCode}
            disabled={referralStep === "apply" || referralStep === "applied"}
            onChange={(e) => setReferralCode(e.target.value)}
            placeholder="Enter referral code (e.g. adarsh-40)"
            className={`flex-1 px-4 py-2 border text-sm rounded-lg ${
              referralStep === "applied"
                ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                : "border-gray-300"
            }`}
          />
          <Button
            onClick={handleReferralButtonClick}
            disabled={loading || referralStep === "applied"}
            className={`${
              referralStep === "applied"
                ? "bg-green-500 cursor-default"
                : referralStep === "apply"
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-black hover:bg-gray-900"
            } text-white font-semibold px-4 py-2 rounded-lg cursor-pointer`}
          >
            {referralStep === "applied"
              ? "Applied"
              : referralStep === "apply"
              ? "Apply"
              : "Check"}
          </Button>
        </div>
        {referralError && (
          <p className="text-red-600 text-sm mt-1">{referralError}</p>
        )}
        {referralStep === "apply" && (
          <p className="text-green-600 text-sm mt-1">
            Referral code is valid. Click <strong>Apply</strong> to get extra
            off.
          </p>
        )}
        {referralStep === "applied" && (
          <p className="text-blue-700 text-sm mt-1 font-medium">
            Referral applied! You've got an additional {referralDiscount}%
            discount.
          </p>
        )}
      </div>

      {/* Highlights */}
      {product.highlights?.length > 0 && (
        <div className="px-4 mb-4">
          <h2 className="text-md font-semibold mb-2 text-gray-800">
            Highlights
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {product.highlights.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Highlight ${idx + 1}`}
                className="w-full h-full object-cover rounded-md border border-black"
              />
            ))}
          </div>
        </div>
      )}

      {/* Features */}
      {product.features?.length > 0 && (
        <div className="px-4 mb-4">
          <h2 className="text-md font-semibold mb-2 text-gray-800">Features</h2>
          <div className="flex flex-wrap gap-2">
            {product.features.map((item, idx) => (
              <span
                key={idx}
                className="bg-blue-100 text-blue-800 px-4 py-1 rounded-full text-xs font-medium shadow"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Review Section */}
      <div className="px-4 mb-3">
        <h2 className="text-md font-semibold mb-2 text-gray-800">
          Add a Review
        </h2>

        {/* Star Rating */}
        <div className="flex gap-1 mb-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <MdStar
              key={star}
              onClick={() => setUserRating(star)}
              className={`w-5 h-5 sm:w-6 sm:h-6 cursor-pointer ${
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
        />

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSubmitReview}
            className="mt-3 primary-bg-dark hover:primary-bg text-white font-medium px-6 py-3 rounded-lg cursor-pointer"
          >
            Submit Review
          </Button>
        </div>
      </div>

      {/* Reviews */}
      <div className="-space-y-4">
        {reviews.length === 0 ? (
          <div className="text-gray-500 text-center text-sm  sm:text-xl md:text-xl py-4">
            No reviews found.
          </div>
        ) : (
          reviews.map((review) => (
            <Card key={review.id} className="border-none shadow-none ">
              <CardContent className="space-y-1 ">
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

      {/* Inside the Box */}
      {product.insideBox?.length > 0 && (
        <div className="px-4 mb-4">
          <h2 className="text-md font-semibold mb-2 text-gray-800">
            Inside the Box
          </h2>
          <div className="bg-white rounded-xl shadow p-4">
            {product.insideBox.map((item, idx) => (
              <div key={idx} className="flex items-center mb-2 last:mb-0">
                <span className="inline-flex items-center justify-center w-6 h-6 mr-3 bg-blue-600 text-white rounded-full text-xs font-bold">
                  {idx + 1}
                </span>
                <span className="text-sm text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Bar for Mobile: only visible on smaller screens */}
      <div className="fixed bottom-0 left-0 right-0 z-50 w-full md:hidden">
        <div className="flex gap-2 w-full relative bg-black text-white py-5 px-4 shadow-lg items-center justify-between primary-bg-dark">
          <Button
            onClick={() =>
              navigate(`/buy-now/${product.id}/${btoa(referralCode)}`)
            }
            className="w-1/2 bg-white cursor-pointer text-black px-4 py-3 rounded-full text-base font-medium hover:bg-white/80 shadow transition-all"
          >
            Buy Now
          </Button>
          <Button
            disabled={disable}
            onClick={isCart ? () => navigate("/my-cart") : handleAddToCart}
            className={`w-1/2 cursor-pointer bg-transparent px-4 py-3 hover:bg-white hover:text-black rounded-full text-base font-medium shadow ${
              isCart ? "border-0" : "border-2"
            }`}
          >
            {isCart ? "View in cart" : "Add to Cart"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;