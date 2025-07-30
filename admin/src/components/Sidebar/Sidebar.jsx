"use client"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  LayoutDashboard,
  Users,
  Store,
  MapPinIcon as MapPinHouse,
  PackageOpen,
  Waypoints,
  Podcast,
  Mails,
  SettingsIcon,
  ChevronDown,
  CircleUser,
  X,
  HandHelping,
  BadgePercent,
} from "lucide-react"

import "./Sidebar.css"

const Sidebar = ({ isOpen, toggleSidebar, darkMode }) => {
  const navigate = useNavigate()
  const [isSettingOpen, setIsSettingOpen] = useState(false)
  const [activeItem, setActiveItem] = useState("Dashboard")
  const [expandedItems, setExpandedItems] = useState({})
  const [activeSubmenuItem, setActiveSubmenuItem] = useState(null)

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
      submenu: [
        { title: "View Members", link: "/users" },
        { title: "Referral Users", link: "/ref-user" },
        { title: "Add User", link: "/add-user" },
      ],
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
        { title: "Add product", link: "/addproduct" },
        { title: "View product", link: "/viewproduct" },
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
      hasSubmenu: true,
      submenu: [
        { title: "Add associate", link: "/addAssociate" },
        { title: "View associate", link: "/viewAssociate" },
      ],
    },
    {
    name: "Commission",
    icon: BadgePercent ,
    hasSubmenu: true,
    submenu: [
      { title: "Commission Levels", link: "/level-commissions" },
      { title: "Level-wise Users", link: "/level-users" },
    ],
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
     {
      name: "Support",
      icon:  HandHelping,
      link: "/support",
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
        { title: "Add product", link: "/addproduct" },
        { title: "View product", link: "/viewproduct" },
      ],
    },
    {
      name: "Enqueries",
      icon: Mails,
      link: "/enquiry",
    },
      {
      name: "Support",
      icon:  HandHelping,
      link: "/support",
    },
  ]

  const menuItems = role === "ADMIN" ? adminMenuItems : sellerMenuItems

  const toggleExpanded = (itemName, submenu) => {
    setExpandedItems((prev) => {
      const isExpanding = !prev[itemName]
      if (isExpanding && submenu && submenu.length > 0) {
        setActiveSubmenuItem(submenu[0].link)
      }
      return {
        ...prev,
        [itemName]: !prev[itemName],
      }
    })
  }

  const handleItemClick = (item) => {
    setActiveItem(item.name)
    if (item.link) {
      navigate(item.link)
      setActiveSubmenuItem(null)
    }
    if (item.hasSubmenu) {
      toggleExpanded(item.name, item.submenu)
    }
  }

  const handleLogout = () => {
  localStorage.removeItem("user")
  localStorage.removeItem("token")
  navigate("/login")
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

        <nav className="sidebar-nav">
          <ul className="nav-list">
            {menuItems.map((item) => (
              <li key={item.name} className="nav-item">
                <div
                  className={`nav-link ${activeItem === item.name ? "active" : ""} ${item.special ? "special" : ""}`}
                  onClick={() => handleItemClick(item)}
                >
                  <div className="nav-link-content">
                    <item.icon className="nav-icon" size={18} />
                    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                      {activeItem === item.name && (
                        <span className="nav-underline-top"></span>
                      )}
                      <span className="nav-text">{item.name}</span>
                    </div>
                  </div>
                  {item.hasSubmenu && (
                    <ChevronDown className={`submenu-arrow ${expandedItems[item.name] ? "expanded" : ""}`} size={14} />
                  )}
                </div>
                {item.hasSubmenu && expandedItems[item.name] && (
                  <ul className="submenu">
                    {item.submenu.map((subItem, idx) => (
                      <li key={idx} className="submenu-item">
                        <div
                          className={`submenu-link ${activeSubmenuItem === subItem.link ? " active" : ""}`}
                          onClick={() => setActiveSubmenuItem(subItem.link) || navigate(subItem.link)}
                        >
                          {activeSubmenuItem === subItem.link && (
                            <span className="submenu-bullet">•</span>
                          )}
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
          <h3 className="sidebar-section-title">Settings</h3>
          <div className="nav-item">
            <div
              className={`nav-link settings-link ${isSettingOpen ? "active" : ""}`}
              onClick={() => setIsSettingOpen(!isSettingOpen)}
            >
              <div className="nav-link-content">
                <SettingsIcon className="nav-icon" size={18} />
                <span className="nav-text">Settings</span>
              </div>
              <ChevronDown className={`submenu-arrow ${isSettingOpen ? "expanded" : ""}`} size={14} />
            </div>
           {isSettingOpen && (
        <ul className="submenu settings-submenu">
          <li className="submenu-item">
            <div className="submenu-link" onClick={handleLogout}>
              <span className="submenu-bullet">•</span>
              Logout
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










