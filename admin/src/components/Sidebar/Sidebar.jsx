import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  LayoutDashboard,
  Users,
  Store,
  MapPinHouse,
  PackageOpen,
  Waypoints,
  Podcast,
  Mails,
  Bolt,
  ChevronDown,
  CircleUser,
  X,
} from "lucide-react"
import "./Sidebar.css"

const Sidebar = ({ isOpen, toggleSidebar, darkMode }) => {
  const navigate = useNavigate()
  const [isSettingOpen, setIsSettingOpen] = useState(false)
  const [activeItem, setActiveItem] = useState("Dashboard")
  const [expandedItems, setExpandedItems] = useState({})

  const user = JSON.parse(localStorage.getItem("user"))
  const role = user?.role || ""

  const adminMenuItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      special: true,
      link: "/dashboard",
    },
    {
      name: "Users",
      icon: Users,
      hasSubmenu: true,
      submenu: [{ title: "View User", link: "/users" }],
    },
    {
      name: "Marketplace",
      icon: Store,
      hasSubmenu: true,
      submenu: [
        { title: "Add Item", link: "/additemM" },
        { title: "View Item", link: "/viewitemM" },
      ],
    },
    {
      name: "Properties",
      icon: MapPinHouse,
      hasSubmenu: true,
      submenu: [
        { title: "Add Item", link: "/additemP" },
        { title: "View Item", link: "/viewitemP" },
      ],
    },
    {
      name: "Products",
      icon: PackageOpen,
      hasSubmenu: true,
      submenu: [
        { title: "Add Product", link: "/addproduct" },
        { title: "View Product", link: "/viewproduct" },
      ],
    },
    {
      name: "KYC",
      icon: Waypoints,
      link: "/view-kyc",
    },
    {
      name: "Associate",
      icon: CircleUser,
      link: "/addAssociate",
    },
    {
      name: "Announcements",
      icon: Podcast,
      link: "/admin-anouncment",
    },
    {
      name: "Enqueries",
      icon: Mails,
      link: "/enquiry",
    },
  ]

  const sellerMenuItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      special: true,
      link: "/dashboard",
    },
    {
      name: "Marketplace",
      icon: Store,
      hasSubmenu: true,
      submenu: [
        { title: "Add Item", link: "/additemM" },
        { title: "View Item", link: "/viewitemM" },
      ],
    },
    {
      name: "Properties",
      icon: MapPinHouse,
      hasSubmenu: true,
      submenu: [
        { title: "Add Item", link: "/additemP" },
        { title: "View Item", link: "/viewitemP" },
      ],
    },
    {
      name: "Products",
      icon: PackageOpen,
      hasSubmenu: true,
      submenu: [
        { title: "Add Product", link: "/addproduct" },
        { title: "View Product", link: "/viewproduct" },
      ],
    },
    {
      name: "Enqueries",
      icon: Mails,
      link: "/enquiry",
    },
  ]

  //  SELECT MENU BASED ON ROLE
  const menuItems = role === "ADMIN" ? adminMenuItems : sellerMenuItems

  const toggleExpanded = (itemName) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemName]: !prev[itemName],
    }))
  }

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}

      <aside className={`sidebar ${isOpen ? "open" : ""} ${darkMode ? "dark" : ""}`}>
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon">
              <img src="/SPC.png" alt="SPC Logo" />
            </div>
            <span className="logo-text">SPC</span>
          </div>
          <button className="close-btn" onClick={toggleSidebar}>
            <X size={20} />
          </button>
        </div>

        <div className="sidebar-divider"></div>

        <nav className="sidebar-nav">
          <ul className="nav-list">
            {menuItems.map((item) => (
              <li key={item.name} className="nav-item">
                <div
                  className={`nav-link ${activeItem === item.name ? "active" : ""} ${item.special ? "special" : ""}`}
                  onClick={() => {
                    setActiveItem(item.name)
                    if (item.link) navigate(item.link)
                    if (item.hasSubmenu) toggleExpanded(item.name)
                  }}
                >
                  <div className="nav-link-content">
                    <item.icon className="nav-icon" size={18} />
                    <span className="nav-text">
                      {item.name}
                      {item.special && activeItem === item.name && (
                        <span className="top-line"></span> // Add this if you want the upper line in the text span
                      )}
                    </span>
                  </div>
                  {item.hasSubmenu && (
                    <ChevronDown
                      className={`submenu-arrow ${expandedItems[item.name] ? "expanded" : ""}`}
                      size={14}
                    />
                  )}
                </div>

                {item.hasSubmenu && expandedItems[item.name] && (
                  <ul className="submenu">
                    {item.submenu.map((subItem, idx) => (
                      <li key={idx} className="submenu-item">
                        <div
                          className="submenu-link"
                          onClick={() => navigate(subItem.link)}
                        >
                          {subItem.title}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>
 <div className="sidebar-footer">
  <h3 className="sidebar-head">Setting</h3>

  <div className="nav-item">
    <div
      className={`nav-link ${isSettingOpen ? "active" : ""}`}
      onClick={() => setIsSettingOpen(!isSettingOpen)}
    >
      <div className="nav-link-content">
        <Bolt className="nav-icon" size={18} />
        <span className="nav-text">Setting</span>
      </div>

      <ChevronDown
        className={`submenu-arrow ${isSettingOpen ? "expanded" : ""}`}
        size={14}
      />
    </div>

    {isSettingOpen && (
      <ul className="submenu submenu-footer">
        <li className="submenu-item">
          <div className="submenu-link" onClick={() => navigate("/profile")}>
            Profile
          </div>
        </li>
        <li className="submenu-item">
          <div className="submenu-link" onClick={() => navigate("/login")}>
            Login
          </div>
        </li>
      </ul>
    )}
  </div>
</div>

      </aside>
    </>
  )
}

export default Sidebar
