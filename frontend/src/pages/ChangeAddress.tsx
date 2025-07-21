import ShadeBtn from "@/components/ui/ShadeBtn";
import { API_URL } from "@/lib/api.env";
import axios from "axios";
import { ChevronLeft } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { State, City } from "country-state-city";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import toast from "react-hot-toast";

function Input({
  forWhat,
  type = "text",
  value,
  onChangeAction,
}: {
  forWhat: string;
  value: string | number;
  onChangeAction?: any;
  type?: string;
}) {
  return (
    <input
      required
      maxLength={forWhat === "Postal Code" ? 6 : 1000}
      type={type}
      className="w-full py-5 px-4 rounded-xl outline-none border-none text-sm bg-gray-200 text-neutral-700"
      value={value}
      onChange={(e) => onChangeAction(e.target.value)}
      placeholder={`${forWhat}`}
    />
  );
}

function ChangeAddress() {
  const navigate = useNavigate();
  const params = useParams();
  const address = atob(params.address || "");
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    phone: "",
    area: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
  });

  // Country is fixed to India (IN)
  const countryCode = "IN";

  // Fetch states of the country
  const states = State.getStatesOfCountry(countryCode);

  // Fetch cities of selected state
  const cities = userData.state
    ? City.getCitiesOfState(countryCode, userData.state)
    : [];

  const handleClick = async () => {
   if (
  !userData.name.trim() ||
  !userData.area.trim() ||
  !userData.city ||
  !userData.state ||
  !userData.landmark.trim() ||
  !userData.phone.trim() ||
  !userData.pincode.trim()
) {
      toast.error("All fields are required")
      console.error("all fields are required");
      return;
    }

    const final_address = `${userData.name}, ${userData.area}, ${userData.landmark}, ${userData.city}, ${userData.state}, ${userData.pincode}, ${userData.phone}`;
    setLoading(true);

    try {
      const req = await axios.put(
        `${API_URL}/api/users/update-auth-user`,
        {
          address: final_address,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (req.status === 200) {
        setLoading(false);
        navigate(-1);
      }
    } catch (error) {
      console.error("Error updating address:", error);
      setLoading(false);
    }
  };

  const onChangeAction = (key: keyof typeof userData, value: string) => {
    setUserData((prev) => ({
      ...prev,
      [key]: value,
      // Clear city when state changes
      ...(key === "state" && { city: "" }),
    }));
  };

  const setAddressFromString = (input: string) => {
    const parts = input.split(",").map((part) => part.trim());

    setUserData({
      name: parts[0] || "",
      area: parts[1] || "",
      landmark: parts[2] || "",
      city: parts[3] || "",
      phone: parts[6] || "",
      state: parts[4] || "",
      pincode: parts[5] || "",
    });

    // setUserData((prev) => ({
    //   ...prev,
    //   name: parts[0] || "",
    //   area: parts[1] || "",
    //   landmark: parts[2] || "",
    //   phone: parts[6] || "",
    //   pincode: parts[5] || "",
    //   state: undefined,
    //   city: undefined,
    // }));
  };

  useEffect(() => {
    if (address !== "null" && address !== "") {
      setAddressFromString(address);
    }
  }, []);

  return (
    <div className="min-h-screen h-auto w-screen relative mb-10">
      <div className="flex items-center justify-center gap-0 h-14 text-black mb-2 px-6 border-2 border-neutral-200">
        <ChevronLeft
          className="w-8 h-8 cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <h2 className="flex-1 text-2xl font-sans text-center font-semibold">
          Change Address
        </h2>
      </div>

      <div className="px-4 py-2 pb-6">
        <h2 className="text-2xl font-bold text-black font-sans mb-6">
          Current Address
        </h2>
        <div className="flex flex-col justify-start gap-5">
          <Input
            onChangeAction={(value: string) => onChangeAction("name", value)}
            value={userData.name}
            forWhat="Full Name"
          />
          <Input
            onChangeAction={(value: string) => onChangeAction("phone", value)}
            type="number"
            value={userData.phone}
            forWhat="Mobile Number"
          />
          <Input
            onChangeAction={(value: string) => onChangeAction("area", value)}
            value={userData.area}
            forWhat="Street Area"
          />
          <Input
            onChangeAction={(value: string) =>
              onChangeAction("landmark", value)
            }
            value={userData.landmark}
            forWhat="Landmark"
          />

          {/* State select */}
          <Select
            required
            value={userData.state }
            onValueChange={(value) => onChangeAction("state", value)}
          >
            <SelectTrigger className="w-full py-7 px-4 rounded-xl bg-gray-200 text-neutral-700 text-sm border-none outline-none">
              <SelectValue placeholder="Select State" />
            </SelectTrigger>
            <SelectContent>
              {states.map((state) => (
                <SelectItem key={state.isoCode} value={state.isoCode}>
                  {state.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* City select */}
          <Select
            required
            value={userData.city }
            onValueChange={(value) => onChangeAction("city", value)}
            disabled={!userData.state} 
          >
            <SelectTrigger className="w-full py-7 px-4 rounded-xl bg-gray-200 text-neutral-700 text-sm border-none outline-none">
              <SelectValue
                placeholder={
                  userData.state ? "Select City" : "Select State First"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {cities.map((city) => (
                <SelectItem key={city.name} value={city.name}>
                  {city.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            onChangeAction={(value: string) => onChangeAction("pincode", value)}
            type="number"
            value={userData.pincode}
            forWhat="Postal Code"
          />
        </div>
      </div>

      <div className="fixed bottom-2 w-full px-4">
        <ShadeBtn
          title={loading ? "Changing Address..." : "Change Address"}
          action={() => handleClick()}
        
        />
      </div>
    </div>
  );
}

export default ChangeAddress;
