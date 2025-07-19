import React, { useEffect, useState } from "react";
import { ChevronLeft, LucideHandCoins } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Loader from "@/components/Loader/Loader";
import { API_URL } from "@/lib/api.env";
import { useAuth } from "@/context/authContext";
import toast from "react-hot-toast";
import ShadeBtn from "@/components/ui/ShadeBtn";
import CartItemCard from "@/components/CartItemCard/CartItemCard";
import { useLocation } from "react-router-dom";
import EmptyCart from "@/components/EmptyCart/EmptyCart";

function BuyNow() {
  const navigate = useNavigate();

  const param = useParams();
  const id = param.id;
  const ok = param?.code;
  const code = ok ? atob(ok) : "";
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState<string | null>(null);
  const [data, setData] = useState([]);
  const [name, setName] = useState("");

  const [price, setPrice] = useState(0);
  const location = useLocation();
  const fromCart = location.state?.fromCart;
  const cartItemsFromCart = location.state?.cartItems;

  async function GetAddress() {
    const req = await axios.get(`${API_URL}/api/users/me`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (req.status === 200) {
      setName(req.data.user.name);
      setAddress(req.data.user.address);
    }
   
  }

  async function GetItem() {
    try {
      setLoading(true);
      const req = await axios.get(`${API_URL}/api/product/get-by-id/${id}`);
      if (req.status === 201) {
        const p = req.data;

        // Apply discount
        const referralDiscount = code ? parseInt(code.split("-")[1]) || 0 : 0;
        const totalDiscount = (p.discount || 0) + referralDiscount;
        const calculatedPrice = (
          p.price -
          (p.price * totalDiscount) / 100
        ).toFixed(0);

        const mappedItem = {
          id: p.id,
          name: p.name,
          description: p.description,
          price: p.price,
          discount: p.discount,
          finalPrice: Number(calculatedPrice),
          rating: p.ratings,
          quantity: 1,
          image: p.images?.[0],
          sellerName: p.seller?.name || "Put Seller",
        };

        setPrice(Number(calculatedPrice));
        setData([mappedItem]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (fromCart && cartItemsFromCart?.length > 0) {
      // Cart-based checkout
      setData(cartItemsFromCart);
      const total = cartItemsFromCart.reduce(
        (sum, item) => sum + item.finalPrice * item.quantity,
        0
      );
      setPrice(total);
    } else if (id) {
      GetItem();
    }

    GetAddress();
  }, []);

  const [quantity, setQuanity] = useState(1);

  const placeOrder = async () => {
    if(!address){
      toast.error("Kindly include the address first.")
      return
    }
    if (fromCart) {
      // BUYING WHOLE CART
      try {
        const res = await axios.post(
          `${API_URL}/api/order/buynow/cart`,
          {
            paymentMode: "COD",
            referralCode: code || null,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        // console.log(res);
        if (res.status === 201) {
          navigate("/thanks");
        }
      } catch (error) {
        toast.error("Cart Order failed");
        console.error(error);
      }
    } else {
      // BUYING SINGLE PRODUCT
     
      try {
        const res = await axios.post(
          `${API_URL}/api/order/buynow`,
          {
            productId: id,
            paymentMode: "COD",
            referralCode: code || "",
            quantity: quantity,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (res.status === 201) {
          navigate("/thanks");
        }
      } catch (error) {
        toast.error("Order failed");
        console.error(error);
      }
    }
  };

  const updateQuantity = async (
    id: string,
    change: number,
    prevQuat?: number
  ) => {
    const newQuantity = prevQuat + change;
    setQuanity(newQuantity);
    try {
      if (fromCart) {
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
      }
      if (newQuantity <= 0) {
        setData((items) => items.filter((item) => item.id !== id));
      } else {
        setData((items) =>
          items.map((item) =>
            item.id === id ? { ...item, quantity: newQuantity } : item
          )
        );
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  useEffect(() => {
    if (fromCart && data.length > 0) {
      const total = data.reduce(
        (sum, item) => sum + item.finalPrice * item.quantity,
        0
      );
      setPrice(total);
    } else if (!fromCart && data.length > 0) {
      const unitPrice = data[0].finalPrice;
      setPrice(unitPrice * quantity);
    }
  }, [quantity, data]);

  useEffect(() => {
    if (!loading && data.length <= 0) {
      navigate(-1)
    }
  }, [data, loading])
  
  if (loading) {
    return <Loader />;
  }
  
  return (
    <div className="min-h-screen h-auto w-screen relative mb-16">
      <div className="flex items-center justify-center gap-0 h-14  text-black mb-2 px-6 border-2 border-neutral-200">
        <ChevronLeft
          className="w-8 h-8 cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <h2 className="flex-1 text-2xl font-sans text-center font-semibold">
          Proceed To Buy
        </h2>
      </div>
      {/* Selected address */}
      <div className="px-4 py-2 pb-6 border-b-2 border-gray-300">
        <h2 className="text-2xl font-black text-black mb-2 font-sans">
          Delivering to {name}
        </h2>

        {address ? (
          <>
            <p className="text-lg font-normal font-sans text-gray-700">
              {address}
            </p>
            <button
              onClick={() => navigate(`/change-address/${btoa(address)}`)}
              className="text-sm font-normal mt-1 font-sans text-sky-600"
            >
              Change Address?
            </button>
          </>
        ) : (
          <>
            <p className="text-lg font-normal font-sans text-gray-700">
              No Address Found
            </p>
            <button
              onClick={() => navigate(`/change-address/${btoa(address)}`)}
              className="text-sm font-normal mt-1 font-sans text-sky-600"
            >
              Add Address
            </button>
          </>
        )}
      </div>

      {/* Payment methods */}
      <div className="px-4 py-2 pb-4 border-b-2 border-gray-300">
        <p className="text-base font-medium mt-1 font-sans text-green-600">
          Total Items - <span className="font-bold">{data.length}</span>
        </p>
        <p className="text-lg font-bold font-sans text-gray-700">
          Total Amount - ₹ {price}
        </p>
      </div>

      <div className="px-4 py-4">
        <h2 className="text-2xl font-bold font-sans text-black mb-2">
          Payment Methods
        </h2>

        <div className=" mb-6 mt-2">
          <div className="w-full py-3 border-2 border-blue-900 rounded-xl flex justify-between items-center px-4">
            <div className="section_1 flex justify-start items-center gap-3">
              <div className="w-8 h-8 bg-blue-800/20 rounded-full relative">
                <div className="w-4 h-4 bg-blue-900 rounded-full absolute inset-1/4"></div>
              </div>
              <p className="text-lg text-black font-medium">Cash on Delivery</p>
            </div>
            <LucideHandCoins className="text-blue-900" size={28} />
          </div>
        </div>

        <h2 className="text-2xl font-bold font-sans text-black mb-2">Items</h2>

        {data.length > 0 ? (
          data.map((item, index) => (
            <CartItemCard
              key={index}
              item={item}
              updateQuantity={updateQuantity}
              price={item.finalPrice}
              discount={code}
            />
          ))
        ) : (
          <Loader />
        )}
      </div>

      <div className="fixed bottom-4 w-full px-4">
        <ShadeBtn title="Place Order" action={() => placeOrder()} />
      </div>
    </div>
  );
}

export default BuyNow;
