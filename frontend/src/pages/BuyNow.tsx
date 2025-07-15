import React, { useEffect, useState } from "react";
import { ChevronLeft, LucideHandCoins } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "@/components/Loader/Loader";
import { API_URL } from "@/lib/api.env";
import { useAuth } from "@/context/authContext";
import toast from "react-hot-toast";
import ShadeBtn from "@/components/ui/ShadeBtn";
import CartItemCard from "@/components/CartItemCard/CartItemCard";



function BuyNow() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [PillsData, setPills] = useState<string[]>();
  const [usedCardData, setUsedCardData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState<string | null>(null)
  const [name, setName] = useState("")

  async function GetAddress() {
    const req = await axios.get(`${API_URL}/api/users/me`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
    if (req.status === 200) {
      setName(req.data.user.name)
      setAddress(req.data.user.address)
    }
  }

  useEffect(() => {
    GetAddress()
  }, [])

  if (loading) {
    return <Loader />;
  }
  return (
    <div className="min-h-screen h-auto w-screen relative">
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
        
        {
          address ? (

            <>
          <p className="text-lg font-normal font-sans text-gray-700">{address}</p>
          <button onClick={() => navigate(`/change-address/${btoa(address)}`)} className="text-sm font-normal mt-1 font-sans text-sky-600">Change Address?</button>
          </> 
        )
          :  (
            <>
                      <p className="text-lg font-normal font-sans text-gray-700">No Address Found</p>
          <button onClick={() => navigate(`/change-address/${btoa(address)}`)} className="text-sm font-normal mt-1 font-sans text-sky-600">Add Address</button>
          </>
          )
        }
      </div>

      {/* Payment methods */}
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
                <LucideHandCoins className="text-blue-900" size={28}/>
            </div>
        </div>

                <h2 className="text-2xl font-bold font-sans text-black mb-2">
          Items
        </h2>

        {/* <CartItemCard 
        item={}
        /> */}
      </div>

      <div className="fixed bottom-4 w-full px-4">
        <ShadeBtn title="Place Order" action={() => {}}/>
      </div>
    </div>
  );
}

export default BuyNow;
