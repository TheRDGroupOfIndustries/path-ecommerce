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
import { fetchDataFromApi } from "../../utils/api"

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

  const statsData = [
    {
      key: "users",
      title: "Total users",
      value: users.length,
      change: "+3 increase in this month",
      positive: true,
    },
    {
      key: "itemM",
      title: "Total Properties",
      value: itemM.length,
      change: "+3 increase in this month",
      positive: true,
    },
    {
      key: "itemP",
      title: "Total Marketplace",
      value: itemP.length,
      change: "+3 increase in this month",
      positive: true,
    },
    {
      key: "enquiry",
      title: "Total Enquiries",
      value: enquiry.length,
      change: "-103% increase in this month",
      positive: false,
    },
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchUsers();
    fetchItems();
    fetchItemMs();
    fetchEnquiry();
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
    const res = await fetchDataFromApi("/property/get-all");
    if (res && Array.isArray(res.properties)) {
      setItemM(res.properties);
    } else {
      console.error("Unexpected API response:", res);
      setItemM([]);
    }
  };

  const fetchItemMs = async () => {
    const res = await fetchDataFromApi("/marketplace/get-all");
    if (res && Array.isArray(res.marketplaces)) {
      setItemP(res.marketplaces);
    } else {
      console.error("Unexpected API response:", res);
      setItemP([]);
    }
  };

  const fetchEnquiry = async () => {
    const res = await fetchDataFromApi("/enquiry/get-all");
    if (res && Array.isArray(res)) {
      setEnquiry(res);
    } else {
      console.error("Unexpected API response:", res);
      setEnquiry([]);
    }
  };

  const enquiries = [
    {
      date: "7 July 2025",
      text: "Lorem ipsum dolor sit amet consectetur.odio amet odio. Vivamus senectus sollicitudin nunc id tortor molestae et tincidunt turpis. Augue porttitor lorem neque orci...",
      author: "Adarsh Pandit",
    },
    {
      date: "6 July 2025",
      text: "Another enquiry text here. This is a sample enquiry that would appear when navigating through the carousel. The content changes based on the selected enquiry item.",
      author: "John Doe",
    },
  ];

  const nextEnquiry = () => {
    setCurrentEnquiry((prev) => (prev + 1) % enquiries.length);
  };

  const prevEnquiry = () => {
    setCurrentEnquiry((prev) => (prev - 1 + enquiries.length) % enquiries.length);
  };

  return (
    <div className={`dashboard-page ${darkMode ? "dark" : ""}`}>
      <div className="dashboard-container">
        <section className="basic-statistics">
          <h2>Basic Statistics</h2>
          <div className="stats-grid">
            {statsData.map((stat, index) => (
              <div key={index} className={`stat-card${darkMode ? ' dark' : ''}`}>
                <div className="stat-header">
                  <span className="stat-title">{stat.title}</span>
                  <div className="stat-icon-wrapper">
                    <ArrowUpRight className="stat-icon" />
                  </div>
                </div>
                <div className="stat-value">{stat.value}</div>
                <div className={`stat-change ${stat.positive ? "positive" : "negative"}`}>
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
          <div className={`analytics-chart${darkMode ? ' dark' : ''}`}>
            <div className="chart-container">
              <div className="chart-header">
                <span className="chart-title">Revenue This Week</span>
              </div>
              <div className="chart-area">
                <ResponsiveContainer width="100%" height={160}>
                  <AreaChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
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
                      tick={{ fill: darkMode ? "#b0b7d1" : "#b0b7d1", fontSize: 14 }}
                    />
                    <YAxis hide domain={[0, 260]} />
                    <CartesianGrid strokeDasharray="6 6" stroke="#d1d5db" vertical={false} />
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

          <div className="recent-enqueries-stack" >
            <div className="recent-enqueries-bg"></div>
            {/* <div className="recent-enqueries-bg second"></div> */}
            <div className={`recent-enqueries${darkMode ? ' dark' : ''}`}>
              <div className="enqueries-header">
                <div className="indicator-dots">
                  {enquiries.map((_, idx) => (
                    <div
                      key={idx}
                      className={`dot${idx === currentEnquiry ? " active" : ""}`}
                    ></div>
                  ))}
                </div>
                <h3>Recent Enquiries</h3>
              </div>
              <div className="enqueries-content">
                <div className="enquery-date">{enquiries[currentEnquiry]?.date}</div>
                <div className={`enquery-text${darkMode ? ' dark' : ''}`}>{enquiries[currentEnquiry]?.text}</div>
                <div className="enquery-author">
                  ~ <span className="author-bold">{enquiries[currentEnquiry]?.author}</span>
                </div>
              </div>
              <div className="enqueries-navigation">
                <button className={`nav-btn${currentEnquiry === 0 ? "" : " light"}`} onClick={prevEnquiry}>
                  <ChevronLeft size={18} />
                </button>
                <button
                  className={`nav-btn${currentEnquiry === enquiries.length - 1 ? " active" : " dark"}`}
                  onClick={nextEnquiry}
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






