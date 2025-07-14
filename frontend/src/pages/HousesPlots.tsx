import { useEffect, useState } from "react";
import ProfileHeader from "@/components/ProfileHeader/ProfileHeader";
import CardComponent from "@/components/CardComponent/CardComponent";
import axios from "axios";
import { API_URL } from "@/lib/api.env";

const HousesPlots = () => {
  const [activeTab, setActiveTab] = useState("All Properties");
  const [properties, setProperties] = useState([]);
  const [tabs, setTabs] = useState(["All Properties"]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/property/get-all`);
        const data = res.data?.properties || [];
        // console.log("house: ",res.data);
        
        setProperties(data);

        const categories = [...new Set(data.map(p => p.category.toUpperCase()))];

        setTabs(["All Properties", ...categories]);
      } catch (error) {
        console.error("Failed to fetch properties", error);
      }
    };

    fetchProperties();
  }, []);

  const filteredProperties =
    activeTab === "All Properties"
      ? properties
      : properties.filter(p => p.category.toUpperCase() === activeTab);


  return (
    <div className="container mx-auto p-4 pb-28">
      <div className="flex flex-col gap-6 mb-10">
        <ProfileHeader type="Houses & Plots" />

        <div className="flex gap-2 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
                activeTab === tab
                  ? "primary-bg text-white"
                  : "text-muted-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-fit">
          <h1 className="text-2xl font-bold text-black">{activeTab}</h1>
          <div className=" w-full h-[1px] bg-black mt-1 relative">
            <div className="w-2 h-2 bg-black rounded-full absolute -bottom-1 -right-1"></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {filteredProperties.map((property) => (
          <CardComponent
            key={property.id}
            service={{
              id: property.id,
              title: property.name,
              image: property.imageUrl?.[0],
              category: property.category,
              description: property.description,
            }}
            btnText="View"
            type="property"
          />
        ))}
      </div>
    </div>
  );
};

export default HousesPlots;
