import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ChevronLeft, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import CartItemCard from "@/components/CartItemCard/CartItemCard";
import { API_URL } from "@/lib/api.env";
import Loader from "@/components/Loader/Loader";
import ShadeBtn from "@/components/ui/ShadeBtn";
import EmptyCart from "@/components/EmptyCart/EmptyCart";

export default function MyCart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/cart`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const mapped = res.data.map((item) => ({
          id: item.id,
          name: item.product.name,
          description: item.product.description,
          discount: item.product.discount,
          rating: item.product.ratings,
          finalPrice: Math.floor(
            item.product.price * (1 - item.product.discount / 100)
          ),
          price: item.product.price,
          quantity: item.quantity,
          image: item.product.images?.[0],
          sellerName: item.product.seller.name,
        }));

        setCartItems(mapped);
      } catch (err) {
        console.error("Error fetching cart items:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const updateQuantity = async (id, change) => {
    const targetItem = cartItems.find((item) => item.id === id);
    if (!targetItem) return;

    const newQuantity = targetItem.quantity + change;

    try {
      await axios.put(
        `${API_URL}/api/cart/update-quantity`,
        {
          cartItemId: id,
          quantity: newQuantity,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (newQuantity <= 0) {
        setCartItems((items) => items.filter((item) => item.id !== id));
      } else {
        setCartItems((items) =>
          items.map((item) =>
            item.id === id ? { ...item, quantity: newQuantity } : item
          )
        );
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const handleBuyNow = () => {
    navigate("/buy-now", {
      state: {
        fromCart: true,
        cartItems: cartItems,
      },
    });
  };

  const subtotal = cartItems.reduce(
    (total, item) => total + item.finalPrice * item.quantity,
    0
  );
  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  if (loading) return <Loader />;

  if (cartItems.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="container mb-18 lg:p-4 mx-auto">
      {/* Header */}
      <div className="px-6 mb-2">
        <div className="flex items-center justify-center h-14 text-black">
          <ChevronLeft
            className="w-8 h-8 cursor-pointer"
            onClick={() => navigate(-1)}
          />
          <h2 className="flex-1 text-2xl font-sans text-center font-semibold">
            My Cart
          </h2>
        </div>
        <div className="w-full h-px bg-neutral-400 rounded"></div>
      </div>

      <div className="px-4 py-4">
        {/* Cart Summary */}
        <div className="mb-4 space-y-4">
          <div className="flex items-center justify-between text-black">
            <h2 className="text-lg font-semibold flex items-center">
              Subtotal - <IndianRupee className="w-4 h-4 ml-1 mr-1" />{" "}
              {subtotal}/-
            </h2>
          </div>
          <p className="text-sm text-black">Total Items - {totalItems}</p>

          {/* CTA Button */}
          <ShadeBtn action={handleBuyNow} title="Proceed To Buy" />
        </div>

        <div className="w-full h-px bg-neutral-400 rounded"></div>

        {/* Cart Items */}
        <div className="space-y-4 mt-4">
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
