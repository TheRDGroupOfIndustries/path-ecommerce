
import { Plus, Star } from "lucide-react";
import React from "react";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const ProductCard = ({
  id,
  ratings,
  title,
  description,
  price,
  discount,
  images,
}) => {
  const navigate = useNavigate();

  
  
  
  return (
   <Card className="w-full max-w-xs p-2 shadow-none border-none cursor-pointer h-72 flex flex-col" onClick={() => navigate(`/product-detail/${id}`)}>
  <CardContent className="p-0 flex flex-col flex-1">
    {/* Image */}
    <div className="relative w-full h-38 mb-2 overflow-hidden">
      <img
        src={images[0]}
        alt={title}
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-1 left-1 flex items-center  px-1 py-[1px] ">
        <span className="text-[10px]  text-black">
          {ratings}
        </span>
        <div className="h-3 w-px bg-black mx-1" />
        <Star className="w-3 h-3 text-yellow-400 fill-current" />
      </div>
    </div>

    <CardTitle className="text-base font-semibold leading-snug text-black">
      {title}
    </CardTitle>
    <CardDescription className="text-[10px] text-gray-400 mb-1 leading-tight">
      {description.length > 40
        ? description.slice(0, 40) + "..."
        : description}
    </CardDescription>

    {/* price and add to cart */}
    <div className="flex items-center justify-between mt-auto ">
      <p className="text-xs font-semibold text-black whitespace-nowrap">
        Rs. {(price - (price * discount / 100)).toFixed(0)}{" "}
        <span className="text-[9px] text-gray-400 line-through font-lightca">
          Rs. {price}
        </span>{" "}
        <span className="text-yellow-500 ml-1 text-[9px] font-light">
          ({discount} off%) 
        </span>
      </p>
      {/* <button
        className="bg-blue-900 text-white p-1 rounded-full flex items-center justify-center w-6 h-6"
        aria-label="Add to cart"
      >
        <Plus size={14} />
      </button> */}
    </div>
  </CardContent>
</Card>

  );
};

export default ProductCard;
