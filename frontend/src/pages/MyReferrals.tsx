import React, { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "@/components/Loader/Loader";
import { API_URL } from "@/lib/api.env";
import { useAuth } from "@/context/authContext";
import toast from "react-hot-toast";

const Pills = ({ value, onClick }: { value: string; onClick: () => void }) => {
  return (
    <div
      onClick={onClick}
      className="flex justify-center items-center px-5 py-0.5 rounded-full bg-[#008DD320] w-fit cursor-pointer hover:bg-[#008DD340] transition"
    >
      <p className="text-[#008DD3] text-base font-medium font-sans">{value}</p>
    </div>
  );
};

function Card({
  refferal_code,
  amount,
  product_title,
  user_name,
  user_email,
}: {
  refferal_code: string;
  amount: string;
  product_title: string;
  user_name: string;
  user_email: string;
}) {
  return (
    <div className="w-full min-h-48 h-auto rounded-2xl primary-bg relative overflow-hidden py-4 z-50">
      <div className="w-48 h-48 rounded-full absolute -right-10 -top-16 bg-[#6469F380] -z-50"></div>
      <div className="w-48 h-48 rounded-full absolute -bottom-16 -left-16 bg-black/30 -z-50"></div>

      <div className="px-4">
        <div className="w-full flex justify-end items-center px-2">
          <div className="flex justify-center items-center px-4  py-0.5 rounded-full bg-white/20 w-fit">
            <p className="text-white text-base font-medium font-sans">
              {refferal_code}
            </p>
          </div>
        </div>
        <h1 className="w-full text-4xl font-sans font-black text-[#0EF8B6]">
          Rs. {amount}+
        </h1>

        <div className="w-full h-1/3 flex justify-between items-center">
          <div className="w-1/2 h-24 flex justify-end items-start flex-col">
            <h1 className="text-base leading-5 font-medium font-sans text-white">
              {product_title}
            </h1>
            {/* HERE CHANGE THIS P TO Router Link... */}
            <p className="text-xs font-normal font-sans text-neutral-300 py-1 bg-white/40 px-4 rounded-full leading-3 mt-2">
              View
            </p>
          </div>

          <div className="w-1/2 h-24 flex justify-end items-end flex-col">
            <p className="text-xs font-normal font-sans text-white">Used By</p>
            <h1 className="text-xl font-bold font-sans text-white">
              {user_name}
            </h1>
            <p className="text-xs font-normal font-sans text-neutral-300">
              {user_email}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MyReferrals() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [PillsData, setPills] = useState<string[]>();
  const [usedCardData, setUsedCardData] = useState([]);
  const [loading, setLoading] = useState(true);

  async function CallApi() {
    try {
      setLoading(true);

      const res = await axios.get(`${API_URL}/api/referral/detail/${user.id}`);
      const data = res.data;

      // Show only codes which have at least 1 transaction
      const usedReferrals = data.referrals.filter(
        (ref: any) => ref.transactions.length > 0
      );

      // Pills from used codes only
      const allReferralCodes = data.referrals.map(
        (ref: any) => ref.referralCode
      );
      setPills(allReferralCodes);

      // Flatten all transactions from used referrals
      const formattedUsed = usedReferrals.flatMap((ref: any) =>
        ref.transactions.map((tx: any) => ({
          refferal_code: ref.referralCode,
          amount: tx.commission,
          product_title: tx.product?.name || "N/A",
          user: {
            user_name: tx.user?.name || "N/A",
            user_email: tx.user?.email || "N/A",
          },
          createdAt: tx.createdAt,
        }))
      );

      // Sort by most recent first
      formattedUsed.sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setUsedCardData(formattedUsed);
    } catch (error) {
      console.error("Error fetching referral data", error);
      toast.error("Failed to load referral data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    CallApi();
  }, []);

  if (loading) {
    return <Loader />;
  }
  return (
    <div className="min-h-screen w-screen">
      <div className="flex items-center justify-center gap-0 h-14  text-black mb-2 px-6 border-2 border-neutral-200">
        <ChevronLeft
          className="w-8 h-8 cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <h2 className="flex-1 text-2xl font-sans text-center font-semibold">
          My Referrals
        </h2>
      </div>
      {/* Available section */}
      <div className="px-4 py-2">
        <h2 className="text-2xl font-semibold text-black mb-2">
          Available Codes{" "}
          <span className="text-xs text-gray-400 italic font-light">
            (click to copy)
          </span>
        </h2>
        <div className="flex justify-start items-center gap-1.5 gap-y-2 flex-wrap">
          {PillsData.length > 0 &&
            PillsData.map((value: string, index) => (
              <Pills
                key={index}
                value={value}
                onClick={() => {
                  navigator.clipboard.writeText(value);
                  toast.success(`Copied "${value}" to clipboard!`);
                }}
              />
            ))}
        </div>
      </div>

      {/* Used Coupons List */}
      <div className="px-4 py-2">
        <h2 className="text-2xl font-bold font-sans text-black mb-2">
          Used Coupon History
        </h2>

        <div className="w-full flex flex-col justify-center items-center gap-4 mb-32">
          {usedCardData.length > 0 &&
            usedCardData.map((items, index) => (
              <Card
                key={index}
                amount={items.amount}
                product_title={items.product_title}
                refferal_code={items.refferal_code}
                user_email={items.user.user_email}
                user_name={items.user.user_name}
                // NOTE - ALL THE USED VALUES ARE * imaginary * Please change!
              />
            ))}
        </div>
      </div>
    </div>
  );
}

export default MyReferrals;
