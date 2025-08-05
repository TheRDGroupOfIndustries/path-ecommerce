import { useEffect, useState } from "react";
import ProfileHeader from "@/components/ProfileHeader/ProfileHeader";
import CardComponent from "@/components/CardComponent/CardComponent";
import axios from "axios";
import { API_URL } from "@/lib/api.env";
import Loader from "@/components/Loader/Loader";

const AllServicesPage = () => {
  const [activeTab, setActiveTab] = useState("All Services");
  const [services, setServices] = useState([]);
  const [tabs, setTabs] = useState(["All Services"]);
const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`${API_URL}/api/marketplace/get-all`);
        const marketplaces = response.data?.marketplaces || [];
        setServices(marketplaces);

        const categories = [
          ...new Set(marketplaces.map((item) => item.category.toUpperCase())),
        ];

        setTabs(["All Services", ...categories]);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
      finally{
        setLoading(false)
      }
    };

    fetchServices();
  }, []);

  const filteredServices =
    activeTab === "All Services"
      ? services
      : services.filter(
          (service) => service.category.toUpperCase() === activeTab
        );

  return (
    <div className="container mx-auto p-4 pb-28">
      <div className="flex flex-col gap-6 mb-10">
        <ProfileHeader type="services" />

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
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

        {/* Title */}
        <div className="relative w-fit">
          <h1 className="text-2xl font-bold text-black">{activeTab}</h1>
          <div className="w-full h-[1px] bg-black mt-1 relative">
            <div className="w-2 h-2 bg-black rounded-full absolute -bottom-1 -right-1"></div>
          </div>
        </div>
      </div>

      {/* Cards */}
      {/* <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
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
            btnText="View"
            type="marketplace"
            path={`/enquire/marketplace/${service.id}`}
          />
        ))}
      </div> */}

      {/* Cards or No Data */}
{
loading ? (
  <Loader/>
) : filteredServices.length > 0 ? (
  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
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
        btnText="View"
        type="marketplace"
        path={`/enquire/marketplace/${service.id}`}
      />
    ))}
  </div>
) : (
  <div className="h-64 grid place-items-center text-center text-muted-foreground">
    <p>No services available.</p>
  </div>
)}

    </div>
  );
};

export default AllServicesPage;
