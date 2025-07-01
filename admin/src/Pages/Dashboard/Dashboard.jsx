import "./Dashboard.css"
import { useEffect,useState } from "react";
import { fetchDataFromApi } from "../../utils/api";

const Dashboard = ({ darkMode }) => {
   const [users, setUsers] = useState([]);
   const [itemM,setItemM] = useState([])
   const [itemP,setItemP] = useState([])
   const [products,setProducts] = useState([]);

  const statsData = [
  {
    title: "Total Users",
    key: "users",
    change: "+20%",
    trend: "up",
    icon: "👥",
    color: "bg-blue-500",
    period: "vs. last month",
  },
  {
    title: "Total Properties",
    key: "itemM",
    change: "+15%",
    trend: "up",
    icon: "🏠",
    color: "bg-purple-500",
    period: "vs. last month",
  },
  {
    title: "Total Marketplace Items",
    key: "itemP",
    change: "+8%",
    trend: "up",
    icon: "🛍️",
    color: "bg-green-500",
    period: "vs. last month",
  },
  {
    title: "Total Products",
    value: "₹ 0",
    change: "+25%",
    trend: "up",
    icon: "👗",
    color: "bg-orange-500",
    period: "vs. last month",
  },
  {
    title: "Total Investors",
    value: "1",
    change: "-1%",
    trend: "down",
    icon: "💼",
    color: "bg-indigo-500",
    period: "vs. last month",
  },
  {
    title: "Total Employees",
    value: "1",
    change: "-24%",
    trend: "down",
    icon: "👨‍💼",
    color: "bg-pink-500",
    period: "vs. last month",
  },
  {
    title: "Total Expense Records",
    value: "0",
    change: "-13%",
    trend: "down",
    icon: "📄",
    color: "bg-red-500",
    period: "vs. last month",
  },
  {
    title: "Total Help Tickets",
    value: "0",
    change: "-31%",
    trend: "down",
    icon: "❓",
    color: "bg-teal-500",
    period: "vs. last month",
  },
];


   useEffect(() => {
       window.scrollTo(0, 0);
       fetchUsers();
       fetchItems();
       fetchItemMs();
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
         const res = await fetchDataFromApi("/property/get-all");
         if (res && Array.isArray(res.properties)) {
         setItemM(res.properties);
        }else {
           console.error("Unexpected API response:", res);
           setItemM([]);
         }
       };

       const fetchItemMs = async () => {
           const res = await fetchDataFromApi("/marketplace/get-all");
           if (res && Array.isArray(res.marketplaces)) {
           setItemP(res.marketplaces);
          }else {
             console.error("Unexpected API response:", res);
             setItemP([]);
           }
         };

    const fetchingProduct = () => {
      fetchDataFromApi("/product/get-all")
        .then((res) => {
          setProducts(res);
        })
        .catch((error) => console.error("Error fetching Products:", error));
    };

  const topData = {
    investors: [{ name: "developer", amount: "₹ 60000" }],
    employees: [{ name: "Raman Singh", position: "Position", salary: "₹ 80000" }],
  }

  return (
    <div className="dashboard-content">
      <div className="welcome-section">
        <h2 className="dashboard-title">Dashboard</h2>
        <p className="dashboard-subtitle">Welcome to your admin dashboard overview.</p>
      </div>

      {/* Basic Statistics */}
      <div className="stats-section">
        <div className="section-header">
          <div className="section-icon">📊</div>
          <h3 className="section-title">Basic Statistics</h3>
        </div>
        <div className="stats-grid">
          {statsData.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-content">
              <div className="stat-info">
                <p className="stat-label">{stat.title}</p>
                <p className="stat-value">
                  {stat.key === "users"
                    ? users.length
                    : stat.key === "itemM"
                    ? itemM.length
                    : stat.key === "itemP"
                    ? itemP.length
                    : stat.value
                    ? products.length
                    : stat.value
                    }
                </p>
                <div className="stat-change">
                  <span className={`trend-icon ${stat.trend}`}>{stat.trend === "up" ? "📈" : "📉"}</span>
                  <span className={`change-value ${stat.trend}`}>{stat.change}</span>
                  <span className="change-period">{stat.period}</span>
                </div>
              </div>
              <div className={`stat-icon ${stat.color}`}>
                <span className="icon-emoji">{stat.icon}</span>
              </div>
            </div>
          </div>
        ))}

        </div>
      </div>

      {/* Top 10 Data Section */}
      <div className="top-data-section">
        <div className="section-header">
          <div className="section-icon">📈</div>
          <h3 className="section-title">Top 10 Data</h3>
        </div>
        <div className="top-data-grid">
          {/* Top Users */}
          <div className="data-card">
            <div className="card-header">
              <div className="card-icon bg-blue-100"><span>👥</span></div>
              <div className="card-title-section">
                <h4 className="card-title">Top 10 Users</h4>
                <p className="card-subtitle">List of the top 10 users by activity or relevance</p>
              </div>
            </div>
            <div className="card-content">
              <div className="table-header">
                <span>Name</span>
                <span>Email</span>
              </div>
              {users.slice(0, 3).map((user, index)  => (
                <div key={index} className="table-row">
                  <div className="user-info">
                    <div className={`user-avatar-small ${user.avatar}`}></div>
                    <span>{user.name}</span>
                  </div>
                  <span className="user-email">{user.email}</span>
                </div>
              ))}
              <button className="view-all-btn">View all →</button>
            </div>
          </div>

          {/* Top Products */}
          <div className="data-card">
            <div className="card-header">
              <div className="card-icon bg-orange-100"><span>📦</span></div>
              <div className="card-title-section">
                <h4 className="card-title">Top 10 Products</h4>
                <p className="card-subtitle">List of the top 10 products by sales or popularity</p>
              </div>
            </div>
            <div className="card-content">
              <div className="table-header">
                <span>Product Name</span>
                <span>Price</span>
              </div>
              {products.slice(0,3).map((product, index) => (
                <div key={index} className="table-row">
                  <span>{product.name}</span>
                  <span className="price">₹{product.price}</span>
                </div>
              ))}
              <button className="view-all-btn">View all →</button>
            </div>
          </div>

          {/* Top Investors */}
          <div className="data-card">
            <div className="card-header">
              <div className="card-icon bg-indigo-100"><span>💼</span></div>
              <div className="card-title-section">
                <h4 className="card-title">Top 10 Investors</h4>
                <p className="card-subtitle">List of the top 10 investors by investment amount or influence</p>
              </div>
            </div>
            <div className="card-content">
              <div className="table-header">
                <span>Investor Name</span>
                <span>Investment Amount</span>
              </div>
              {topData.investors.map((investor, index) => (
                <div key={index} className="table-row">
                  <span>{investor.name}</span>
                  <span className="price">{investor.amount}</span>
                </div>
              ))}
              <button className="view-all-btn">View all →</button>
            </div>
          </div>

          {/* Top Employees */}
          <div className="data-card">
            <div className="card-header">
              <div className="card-icon bg-pink-100"><span>👨‍💼</span></div>
              <div className="card-title-section">
                <h4 className="card-title">Top 10 Employees</h4>
                <p className="card-subtitle">List of the top 10 employees by position or performance</p>
              </div>
            </div>
            <div className="card-content">
              <div className="table-header">
                <span>Employee Name</span>
                <span>Position</span>
                <span>Amount</span>
              </div>
              {topData.employees.map((employee, index) => (
                <div key={index} className="table-row">
                  <span>{employee.name}</span>
                  <span className="position">{employee.position}</span>
                  <span className="price">{employee.salary}</span>
                </div>
              ))}
              <button className="view-all-btn">View all →</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
