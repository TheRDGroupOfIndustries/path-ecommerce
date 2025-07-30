import { Search, Sun, Moon, Menu } from "lucide-react";
import "./Header.css";

const Header = ({ toggleSidebar, toggleDarkMode, darkMode }) => {
  // Get and parse user from localStorage
  const user = JSON.parse(localStorage.getItem("user")) || {};
  
  const imageUrl = user.imageUrl;
  const email = user.email || "";
  const initial = email.charAt(0).toUpperCase();

  return (
    <header className={`header ${darkMode ? "dark" : ""}`}>
      <div className="header-content">
        <button className="menu-toggle" onClick={toggleSidebar}>
          <Menu size={20} />
        </button>

{/* 
        <div className="search-section">
          <div className="search-container">
            <input type="text" placeholder="Search..." className="search-input" />
            <button className="search-button">
              <Search size={18} />
            </button>
          </div>
        </div> */}


        <div className="header-actions">
          <button className="dark-mode-toggle" onClick={toggleDarkMode}>
            {darkMode ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          <div className="profile-avatar">
            {imageUrl ? (
              <img src={imageUrl} alt="Profile" className="avatar-image" />
            ) : (
              <div className="avatar-initial">{initial || "U"}</div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;













//import { Search, Sun, Moon, Menu } from "lucide-react";
// import "./Header.css";

// const Header = ({ toggleSidebar, toggleDarkMode, darkMode }) => {
//   // Get and parse user from localStorage
//   const user = JSON.parse(localStorage.getItem("user")) || {};
  
//   const imageUrl = user.imageUrl;
//   const email = user.email || "";
//   const initial = email.charAt(0).toUpperCase();

//   return (
//     <header className={`header ${darkMode ? "dark" : ""}`}>
//       <div className="header-content">
//         <button className="menu-toggle" onClick={toggleSidebar}>
//           <Menu size={20} />
//         </button>

//         <div className="header-actions" style={{ marginLeft: "auto" }}>
//           <button className="dark-mode-toggle" onClick={toggleDarkMode}>
//             {darkMode ? <Moon size={18} /> : <Sun size={18} />}
//           </button>

//           <div className="profile-avatar">
//             {imageUrl ? (
//               <img src={imageUrl} alt="Profile" className="avatar-image" />
//             ) : (
//               <div className="avatar-initial">{initial || "U"}</div>
//             )}
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;