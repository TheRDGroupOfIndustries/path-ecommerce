import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Star } from "lucide-react";
import React from "react";


const CartItemCard = ({ item, updateQuantity }: {
  item: any,
  updateQuantity: any
}) => {

  return (
    <Card className="w-full shadow-none border-none" key={item.id}>
      <CardContent className=" flex gap-6 px-0">
        {/* Left: Product Image + Buttons Below */}
        <div className="flex flex-col items-center  flex-shrink-0">
          {/* Image */}
          <div className="relative w-40 h-40 mb-3">
            <img
              src={item.image}
              alt="Product"
              className="w-full h-full object-cover "
            />

            {/* Rating Badge top-left on image */}
            <div className="absolute bottom-2 right-2 flex items-center px-1 py-1 bg-white/90 shadow-sm">
              <span className="text-[10px]  text-black">{item.rating}</span>
              <div className="h-3 w-px bg-black mx-1" />
              <Star className="w-3 h-3 text-cyan-300 fill-current" />
            </div>
          </div>

          {/* Quantity Control BELOW image */}
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => updateQuantity(item.id, -1)}
              className="w-9 h-9 rounded-full border-2 border-red-300 text-red-500 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>

            <span className="text-lg font-medium text-gray-800 min-w-[2rem] text-center">
              {item.quantity}
            </span>

            <Button
              size="icon"
              onClick={() => updateQuantity(item.id, 1)}
              className="w-9 h-9 rounded-full bg-indigo-600 text-white hover:bg-indigo-700"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {item.name || "Title of product goes here"}
          </h2>

          <p className="text-gray-500 text-sm mb-2 leading-tight line-clamp-3">
            {item.description }
          </p>

          <Button
            variant="link"
            className="text-blue-500 text-sm font-medium p-0 h-auto mb-3"
          >
            {item.sellerName || "seller name"}
          </Button>

          {/* Price & discount */}
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gray-900">
              ₹{item.finalPrice }
            </span>
            <span className="text-gray-400 text-sm line-through">
              ₹{item.price }
            </span>
            <span className="text-sm text-orange-300 ">
              {item.discount}%OFF
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CartItemCard;
