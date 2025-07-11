import { ChevronLeft, Star } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { MdStar } from "react-icons/md";
import toast from "react-hot-toast";
const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [user, setUser] = useState(null);

  const [referralCode, setReferralCode] = useState("");
  const [referralStep, setReferralStep] = useState("check"); // check | apply | applied
  const [referralError, setReferralError] = useState("");
  const [referralDiscount, setReferralDiscount] = useState(0);

  const [userRating, setUserRating] = useState(0);
  const [userReview, setUserReview] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/product/get-by-id/${id}`
        );
        const found = res.data;
        const sellerId = found.sellerId;

        const userEndpoint = `http://localhost:8000/api/users/get-by-id/${sellerId}`;
        const userRes = await axios.get(userEndpoint);

        const userData = userRes.data.user;

        setProduct(found);
        setUser(userData);
        setMainImageIndex(0);
      } catch (err) {
        console.error("Failed to fetch product", err);
      }
    };

    fetchProduct();
  }, [id]);

  const handleReferralButtonClick = async () => {
    const code = referralCode.trim().toLowerCase();

    if (referralStep === "check") {
      const isValidFormat = /^[a-zA-Z]+-\d+$/.test(code);
      if (!isValidFormat) {
        setReferralError("Invalid format. Use like 'adarsh-40'");
        return;
      }

      try {
        const res = await axios.post(
          "http://localhost:8000/api/referral/check",
          {
            code,
          }
        );

        if (res.status != 200) {
          setReferralError("Referral code not found or expired.");
          return;
        }
        const discount = parseInt(code.split("-")[1]);
        setReferralDiscount(discount);
        setReferralStep("apply");
        setReferralError("");
      } catch (err) {
        // console.error("Referral validation failed:", err);
        // setReferralError("Something went wrong. Please try again.");
        if (err.response && err.response.status === 404) {
        setReferralError("Referral code not found or expired.");
      } else if (err.response && err.response.data && err.response.data.error) {
        setReferralError(err.response.data.error);
      } else {
        setReferralError("Something went wrong. Please try again.");
      }
      }
    } else if (referralStep === "apply") {
      try {
        const res = await axios.post(
          "http://localhost:8000/api/referral/apply",
          {
            code,
            productId: id,
          }
        );
        if (res.status == 200) {
          const discount = parseInt(code.split("-")[1]);
          setReferralDiscount(discount);
        } else {
          setReferralError("Something went wrong. Please try again.");
        }
      } catch (err) {
        console.error("Referral validation failed:", err);
        setReferralError("Something went wrong. Please try again.");
      }

      setReferralStep("applied");
    }
  };

  const handleSubmitReview = async () => {
    if (!userRating || !userReview.trim()) {
      toast.error("Please give a rating and write a review.");
      return;
    }

    try {
      // await axios.post("http://localhost:8000/api/reviews/create", {
      //   productId: id,
      //   rating: userRating,
      //   comment: userReview,
      // });

      toast.success("Review submitted successfully!");
      setUserRating(0);
      setUserReview("");
    } catch (error) {
      console.error("Failed to submit review:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  if (!product) return <p className="p-4 text-center">Loading...</p>;

  return (
    <div className="w-full mx-auto bg-white min-h-screen relative pb-16">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white">
        <ChevronLeft
          className="w-6 h-6 text-gray-600 cursor-pointer"
          onClick={() => navigate("/")}
        />
        <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-medium">
          {product.category}
        </span>
      </div>

      {/* Main Image */}
      <div className="px-4 mb-4">
        <img
          src={product.images?.[mainImageIndex]}
          alt="Main Product"
          className="w-full h-64 object-cover rounded-lg"
        />
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 px-4 mb-6 overflow-x-auto">
        {product.images?.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`Thumb ${idx + 1}`}
            className={`w-16 h-16 object-cover rounded-lg cursor-pointer border-2 ${
              mainImageIndex === idx ? "border-cyan-400" : "border-transparent"
            }`}
            onClick={() => setMainImageIndex(idx)}
          />
        ))}
      </div>

      {/* Product Info */}
      <div className="px-4 mb-4 flex flex-col gap-2">
        <p className="text-cyan-400 text-sm  underline underline-offset-2">
          {user?.name}
        </p>
        <h1 className="text-3xl font-semibold text-gray-900 ">
          {product.name}
        </h1>
        <div className="flex items-center gap-1 bg-gray-200 w-fit px-2 ">
          <span className="text-lg text-black">{product.ratings}</span>
          <div className="h-4 w-px bg-black mx-2" />
          <Star className="w-4 h-4 fill-current text-cyan-400" />
        </div>
        <p className="text-gray-600 text-sm mb-2">{product.description}</p>

        {/* <div className="mt-2 text-lg font-semibold text-cyan-700">
          ₹{" "}
          {(
            product.price -
            (product.price * (product.discount + referralDiscount)) / 100
          ).toFixed(0)}
          <span className="text-sm text-gray-500 line-through ml-2">
            ₹ {product.price}
          </span>
          <span className="ml-2 text-red-600 font-medium">
            ({product.discount + referralDiscount}% OFF)
          </span>
        </div> */}

        <div className="mt-2 text-2xl font-semibold text-cyan-700">
          ₹{" "}
          {(
            product.price -
            (product.price *
              (product.discount +
                (referralStep === "applied" ? referralDiscount : 0))) /
              100
          ).toFixed(0)}
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

      {/* Referral Code Field */}
      <div className="px-4 mb-4">
        <label className="block text-xl font-semibold mb-1 text-gray-800">
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
            className={`${
              referralStep === "applied"
                ? "bg-green-500 cursor-default"
                : referralStep === "apply"
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-black hover:bg-gray-900"
            } text-white font-semibold px-4 py-2 rounded-lg`}
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
             Referral code is valid. Click <strong>Apply</strong> to get{" "}
            {referralDiscount}% extra off.
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
          <div className="grid  gap-3">
            {product.highlights.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Highlight ${idx + 1}`}
                className="w-full h-full object-cover rounded-md"
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
        />

        {/* Submit Button */}
        <div className="flex justify-end">
    <Button
      onClick={handleSubmitReview}
      className="mt-3 bg-black hover:bg-gray-900 text-white font-medium px-6 py-3 rounded-lg"
    >
      Submit Review
    </Button>
    </div>
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

      {/* Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 w-full">
        <div className="relative  w-full bg-black text-white py-5 px-8 shadow-lg flex items-center justify-between [background:radial-gradient(circle_at_center,_#031a67_0%,_#000_100%)]">
          <Button className="bg-white text-black px-8 py-4 rounded-full text-lg  font-medium  shadow  transition-all">
            Buy Now
          </Button>

          <Button className="bg-transparent px-8 py-4 rounded-full text-lg  font-medium shadow  border-2">
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
