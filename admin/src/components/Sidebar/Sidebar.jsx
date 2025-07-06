import "./Sidebar.css";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  MdDashboard,
  MdAccountCircle
} from "react-icons/md";
import { FaUser,FaStore,FaBuilding,FaStar, FaEnvelope} from "react-icons/fa";
import { PiSignOutFill } from "react-icons/pi";
import { HiSpeakerphone } from "react-icons/hi";
import { IoSettings } from "react-icons/io5";
import { GiClothes } from "react-icons/gi";
import { FaCircleInfo } from "react-icons/fa6";

const Sidebar = ({ isOpen, toggleSidebar, darkMode }) => {
  const navigate = useNavigate();
  const [expandedMenus, setExpandedMenus] = useState({});

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role || "";

  const toggleMenu = (menuKey) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuKey]: !prev[menuKey],
    }));
  };

  const adminMenuItems = [
    { key: "dashboard", title: "Dashboard", icon: <MdDashboard />, link: "/dashboard" },
    {
      key: "users", title: "Users", icon: <FaUser />, hasSubmenu: true,
      submenu: [{ title: "View User", link: "/users" }],
    },
    {
      key: "marketplaces", title: "Marketplaces", icon: <FaStore />, hasSubmenu: true,
      submenu: [
        { title: "Add Item", link: "/additemM" },
        { title: "View Item", link: "/viewitemM" },
      ],
    },
    {
      key: "properties", title: "Properties", icon: <FaBuilding />, hasSubmenu: true,
      submenu: [
        { title: "Add Item", link: "/additemP" },
        { title: "View Item", link: "/viewitemP" },
      ],
    },
    {
      key: "associate", title: "Associate", icon: <FaStar />, hasSubmenu: true,
      submenu: [{ title: "Add Associate", link: "/addAssociate" },{ title: "View Associate", link: "/viewAssociate" }],
    },
    {
      key: "product", title: "Product", icon: <GiClothes />, hasSubmenu: true,
      submenu: [
        { title: "Add Product", link: "/addproduct" },
        { title: "View Product", link: "/viewproduct" },
      ],
    },
    { key: "KYC", title: "KYC", icon: <FaCircleInfo />, link: "/view-kyc" },
    { key: "announcement", title: "Announcement", icon: <HiSpeakerphone />, link: "/admin-anouncment" },
    { key: "enquiries", title: "Enquiries", icon: <FaEnvelope />, link: "/enquiry" },
  ];

  const sellerMenuItems = [
    { key: "dashboard", title: "Dashboard", icon: <MdDashboard />, link: "/dashboard" },
    {
      key: "marketplaces", title: "Marketplaces", icon: <FaStore />, hasSubmenu: true,
      submenu: [
        { title: "Add Item", link: "/additemM" },
        { title: "View Item", link: "/viewitemM" },
      ],
    },
    {
      key: "properties", title: "Properties", icon: <FaBuilding />, hasSubmenu: true,
      submenu: [
        { title: "Add Item", link: "/additemP" },
        { title: "View Item", link: "/viewitemP" },
      ],
    },
    {
      key: "product", title: "Product", icon: <GiClothes />, hasSubmenu: true,
      submenu: [
        { title: "Add Product", link: "/addproduct" },
        { title: "View Product", link: "/viewproduct" },
      ],
    },
    { key: "announcement", title: "Announcement", icon: <HiSpeakerphone />, link: "/seller-anouncment" },
    { key: "enquiries", title: "Enquiries", icon: <FaEnvelope />, link: "/enquiry" },
  ];

  const accountItems = [
    {
      key: "account", title: "Account", icon: <MdAccountCircle />, hasSubmenu: true,
      submenu: [
        { title: "Profile", link: "#" },
        { title: "Security", link: "#" },
      ],
    },
    {
      key: "settings", title: "Settings", icon: <IoSettings />, hasSubmenu: true,
      submenu: [
        { title: "General", link: "#" },
        { title: "Preferences", link: "#" },
      ],
    },
  ];

  const helpItems = [
    {
      key: "help", title: "Help Desk", icon: <span>❓</span>, hasSubmenu: true,
      submenu: [
        { title: "Documentation", link: "#" },
        { title: "Support", link: "#" },
      ],
    },
  ];

  const renderMenuItem = (item) => (
    <li key={item.key} className="menu-item">
      {item.hasSubmenu ? (
        <>
          <button
            className={`menu-button ${expandedMenus[item.key] ? "expanded" : ""}`}
            onClick={() => toggleMenu(item.key)}
          >
            <span className="menu-icon">{item.icon}</span>
            <span className="menu-text">{item.title}</span>
            <span className="menu-arrow">{expandedMenus[item.key] ? "▼" : "▶"}</span>
          </button>
          {expandedMenus[item.key] && (
            <ul className="submenu">
              {item.submenu.map((subItem, index) => (
                <li key={index} className="submenu-item">
                  <NavLink to={subItem.link} className="submenu-link">
                    {subItem.title}
                  </NavLink>
                </li>
              ))}
            </ul>
          )}
        </>
      ) : (
        <NavLink to={item.link} className="menu-link">
          <span className="menu-icon">{item.icon}</span>
          <span className="menu-text">{item.title}</span>
        </NavLink>
      )}
    </li>
  );

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleOverlayClick = () => {
    if (window.innerWidth <= 768) {
      toggleSidebar();
    }
  };

  return (
    <>
      {isOpen && <div className="sidebar-overlay show" onClick={handleOverlayClick}></div>}

      <div className={`sidebar ${isOpen ? "open" : "closed"} ${darkMode ? "dark" : ""}`}>
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon"><img src="SPC.png" alt="SPC Logo" /></div>
            <span className="logo-text">SPC</span>
          </div>
          <button className="sidebar-close-btn" onClick={toggleSidebar} aria-label="Close Sidebar">
            &times;
          </button>
        </div>

        <div className="sidebar-content">
          <nav className="sidebar-nav">
            <ul className="menu-list">
              {(role === "ADMIN" ? adminMenuItems : sellerMenuItems).map(renderMenuItem)}
            </ul>
          </nav>

          <div className="menu-section">
            <div className="section-title">Account & Settings</div>
            <ul className="menu-list">{accountItems.map(renderMenuItem)}</ul>
          </div>

          <div className="menu-section">
            <div className="section-title">Help & Feedback</div>
            <ul className="menu-list">{helpItems.map(renderMenuItem)}</ul>
          </div>
        </div>

        <div className="sidebar-footer">
          <button className="signout-btn" onClick={handleSignOut}>
            <span className="menu-icon"><PiSignOutFill /></span>
            <span className="menu-text">Signout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
