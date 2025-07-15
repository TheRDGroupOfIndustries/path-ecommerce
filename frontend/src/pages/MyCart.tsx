import { Button } from "@/components/ui/button";
import { ChevronLeft, IndianRupee } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CartItemCard from "@/components/CartItemCard/CartItemCard";

export default function MyCart() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Green Bottle",
      description:
        "Eco-friendly reusable green bottle made from stainless steel. Keeps your drinks cool or hot for hours.",
      rating: 4.5,
      finalPrice: 800,
      price: 1200,
      quantity: 1,
      image:
        "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=300&fit=crop",
      sellerName: "John's Store",
    },
    {
      id: 2,
      name: "Eco Mug",
      description:
        "Reusable eco-friendly travel mug. Ideal for coffee and tea on the go.",
      rating: 4.2,
      finalPrice: 650,
      price: 1000,
      quantity: 1,
      image:
        "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=300&fit=crop",
      sellerName: "EcoShop",
    },
  ]);

  const navigate = useNavigate();

  const updateQuantity = (id, change) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const subtotal = cartItems.reduce(
    (total, item) => total + item.finalPrice * item.quantity,
    0
  );
  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <div className="min-h-screen mb-18">
      {/* Header */}
      <div className="px-6 mb-2">
        <div className="flex items-center justify-center h-14 text-black">
          <ChevronLeft
            className="w-8 h-8 cursor-pointer"
            onClick={() => navigate(-1)}
          />
          <h2 className="flex-1 text-2xl font-sans text-center font-semibold ">
            My Cart
          </h2>
        </div>
        <div className="w-full h-px bg-neutral-400 rounded"></div>
      </div>

      <div className="px-4 py-4">
        {/* Cart Summary */}
        <div className="mb-4 space-y-4">
          {/* Subtotal and Total Items in one line */}
          <div className="flex items-center justify-between text-black">
            <h2 className="text-lg font-semibold flex items-center">
              Subtotal - <IndianRupee className="w-4 h-4 ml-1 mr-1" />{" "}
              {subtotal}/-
            </h2>
          </div>
          <p className="text-sm text-black">Total Items - {totalItems}</p>

          {/* CTA Button */}
          <Button className="w-full bg-indigo-200 hover:bg-blue-300 text-indigo-900 py-5 rounded-lg text-xl">
            Proceed To Buy
          </Button>
        </div>

        <div className="w-full h-px bg-neutral-400 rounded"></div>

        {/* Cart Items */}
        <div>
          {cartItems.map((item) => (
            <CartItemCard
              key={item.id}
              item={item}
              updateQuantity={updateQuantity}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
