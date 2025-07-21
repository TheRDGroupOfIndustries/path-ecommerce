import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  ResponsiveContainer,
  YAxis,
  CartesianGrid,
} from "recharts";
import "./Dashboard.css";
import { fetchDataFromApi } from "../../utils/api";
import { Link } from "react-router-dom";

const chartData = [
  { day: "Mon", value: 220 },
  { day: "Tue", value: 240 },
  { day: "Wed", value: 180 },
  { day: "Thu", value: 120 },
  { day: "Fri", value: 120 },
  { day: "Sat", value: 120 },
  { day: "Sun", value: 120 },
];

const Dashboard = ({ darkMode }) => {
  const [currentEnquiry, setCurrentEnquiry] = useState(0);
  const [users, setUsers] = useState([]);
  const [itemM, setItemM] = useState([]);
  const [itemP, setItemP] = useState([]);
  const [enquiry, setEnquiry] = useState([]);
  const [product,setProduct] = useState([]);

  const allStatsData = [
    {
      key: "users",
      title: "Total users",
      value: users.length,
      change: "+3 increase in this month",
      positive: true,
      link: "/users",
    },
    {
      key: "itemM",
      title: "Total Properties",
      value: itemM.length,
      change: "+3 increase in this month",
      positive: true,
      link: "/viewitemP",
    },
    {
      key: "itemP",
      title: "Total Marketplace",
      value: itemP.length,
      change: "+3 increase in this month",
      positive: true,
      link: "/viewitemM",
    },

    {
      key: "product",
      title: "Total Products",
      value: product.length,
      change: "+3 increase in this month",
      positive: true,
      link: "/viewproduct",
    },

    {
      key: "enquiry",
      title: "Total Enquiries",
      value: enquiry.length,
      change: "-103% increase in this month",
      positive: false,
      link: "/enquiry",
    },
    
  ];

const user = JSON.parse(localStorage.getItem("user"));
const userRole = user?.role || "SELLER";

 const statsData = allStatsData.filter((stat) => {
  if (userRole === "ADMIN" && stat.key === "product") return false;
  if (userRole === "SELLER" && stat.key === "users") return false;
  return true;
});

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchUsers();
    fetchItems();
    fetchItemMs();
    fetchEnquiry();
    fetchingProduct();
  }, []);

  const fetchUsers = async () => {
    const res = await fetchDataFromApi("/users/get-all");
    if (res && Array.isArray(res.users)) {
      setUsers(res.users);
    } else {
      console.error("Unexpected API response:", res);
      setUsers([]);
    }
  };

  const fetchItems = async () => {
    const res = await fetchDataFromApi("/property/by-role");
    if (res && Array.isArray(res.data)) {
      setItemM(res.data);
    } else {
      console.error("Unexpected API response:", res);
      setItemM([]);
    }
  };

  const fetchItemMs = async () => {
    const res = await fetchDataFromApi("/marketplace/by-role");
    if (res && Array.isArray(res.data)) {
      setItemP(res.data);
    } else {
      console.error("Unexpected API response:", res);
      setItemP([]);
    }
  };

  const fetchEnquiry = async () => {
    const res = await fetchDataFromApi("/enquiry/by-role");
    if (res && Array.isArray(res)) {
      setEnquiry(res);
    } else {
      console.error("Unexpected API response:", res);
      setEnquiry([]);
    }
  };

  const fetchingProduct = () => {
      fetchDataFromApi("/product/by-role")
        .then((res) => {
          // console.log("Fetched products:", res);
          setProduct(res.products);
        })
        .catch((error) => console.error("Error fetching Products:", error));
    };

const nextEnquiry = () => {
  setCurrentEnquiry((prev) => Math.min(prev + 1, latestEnquiries.length - 1));
};

const prevEnquiry = () => {
  setCurrentEnquiry((prev) => Math.max(prev - 1, 0));
};


  const formatDate = (dateStr) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateStr).toLocaleDateString("en-US", options);
  };

  
  const latestEnquiries = [...enquiry]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);
    
  return (
    <div className={`dashboard-page ${darkMode ? "dark" : ""}`}>
      <div className="dashboard-container">
        <section className="basic-statistics">
          <h2>Basic Statistics</h2>
          <div className="stats-grid">
            {statsData.map((stat, index) => (
              <div key={index} className={`stat-card${darkMode ? " dark" : ""}`}>
                <div className="stat-header">
                  <span className="stat-title">{stat.title}</span>
                  <Link to={stat.link}>
                    <div className="stat-icon-wrapper">
                      <ArrowUpRight className="stat-icon" />
                    </div>
                  </Link>
                </div>
                <div className="stat-value">{stat.value}</div>
                <div
                  className={`stat-change ${stat.positive ? "positive" : "negative"}`}
                >
                  {stat.change}
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="analytic-heading">
          <h3>Analytics</h3>
        </div>

        <div className="analytics-section">
          <div className={`analytics-chart${darkMode ? " dark" : ""}`}>
            <div className="chart-container">
              <div className="chart-header">
                <span className="chart-title">Revenue This Week</span>
              </div>
              <div className="chart-area">
                <ResponsiveContainer width="100%" height={160}>
                  <AreaChart
                    data={chartData}
                    margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.6} />
                        <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="day"
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fill: darkMode ? "#b0b7d1" : "#b0b7d1",
                        fontSize: 14,
                      }}
                    />
                    <YAxis hide domain={[0, 260]} />
                    <CartesianGrid
                      strokeDasharray="6 6"
                      stroke="#d1d5db"
                      vertical={false}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#8B5CF6"
                      strokeWidth={3}
                      fill="url(#colorUv)"
                      dot={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="recent-enqueries-stack">
            <div className={`recent-enqueries-bg${darkMode ? " dark" : ""}`}></div>
            <div className={`recent-enqueries${darkMode ? " dark" : ""}`}>
              <div className="enqueries-header">
                <div className="indicator-dots">
                  {latestEnquiries.map((_, idx) => (
                    <div
                      key={idx}
                      className={`dot${idx === currentEnquiry ? " active" : ""}`}
                    ></div>
                  ))}
                </div>
                <h3>Recent Enquiries</h3>
              </div>
             {latestEnquiries.length > 0 ? (
            <div className="enqueries-content">
              <div className="enquiry-flex">
              <div className="enquery-date">
                {formatDate(latestEnquiries[currentEnquiry].createdAt)}
              </div>
             <div className="from-bold">
               from: {latestEnquiries[currentEnquiry].propertyId ? "Property" : "Marketplace"}
            </div>
            </div>

              <div className={`enquery-text${darkMode ? " dark" : ""}`}>
                {latestEnquiries[currentEnquiry].message}
              </div>
              <div className="enquery-author">
                ~{" "}
                <span className="author-bold">
                  {latestEnquiries[currentEnquiry].name}
                </span>
              </div>
            </div>
          ) : (
            <div className={`enqueries-content no-enquiry${darkMode ? " dark" : ""}`}>
              No enquiry yet.
            </div>
          )}
              <div className="enqueries-navigation">
                 <button
              className={`nav-btn ${currentEnquiry <= 0 || latestEnquiries.length <= 1 ? "disabled" : ""}`}
              onClick={() => {
                if (currentEnquiry > 0) prevEnquiry();
              }}
              disabled={currentEnquiry <= 0 || latestEnquiries.length <= 1}
            >
              <ChevronLeft size={18} />
            </button>

            <button
              className={`nav-btn ${currentEnquiry >= latestEnquiries.length - 1 || latestEnquiries.length <= 1 ? "disabled" : ""}`}
              onClick={() => {
                if (currentEnquiry < latestEnquiries.length - 1) nextEnquiry();
              }}
              disabled={currentEnquiry >= latestEnquiries.length - 1 || latestEnquiries.length <= 1}
            >
              <ChevronRight size={18} />
            </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
