import { useEffect, useState } from "react";
import ProfileHeader from "@/components/ProfileHeader/ProfileHeader";
import CardComponent from "@/components/CardComponent/CardComponent";
import axios from "axios";

const AllServicesPage = () => {
  const [activeTab, setActiveTab] = useState("All Services");
  const [services, setServices] = useState([]);
  const [tabs, setTabs] = useState(["All Services"]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/marketplace/get-all");
        const marketplaces = response.data?.marketplaces || [];
        setServices(marketplaces);

        // Get unique categories from API response
        const categories = [
          ...new Set(marketplaces.map((item) => item.category.toUpperCase())),
        ];

        setTabs(["All Services", ...categories]);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();
  }, []);
  // console.log("services:",services);
  
  const filteredServices =
    activeTab === "All Services"
      ? services
      : services.filter((service) => service.category.toUpperCase() === activeTab);

  return (
    <div className="container mx-auto p-5 pb-28">
      <div className="flex flex-col gap-6 mb-10">
        <ProfileHeader />
        <div className="flex gap-2 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
                activeTab === tab ? "bg-black text-white" : "text-muted-foreground"
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
        {filteredServices.map((service) => (
          <CardComponent
            key={service.id}
            service={{
              id: service.id,
              title: service.name,
              category: service.category,
              image: service.imageUrl[0],
              description: service.description,
            }}
            btnText="Enquire Now"
            type="marketplace"
          />
        ))}
      </div>
    </div>
  );
};

export default AllServicesPage;
