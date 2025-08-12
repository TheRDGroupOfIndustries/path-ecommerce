import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

//  Import all CSS globally here
import "./pages/AdminKyc/AdminKycList.css";
import "./pages/Announcment/Anouncment.css";
import "./pages/Associate/Associate.css";
import "./pages/Associate/ViewAssociate.css";
import "./pages/Dashboard/Dashboard.css";
import "./pages/Enquiry/Enquiry.css";
import "./pages/Levels/CommissionLevels.css";
import "./pages/Levels/LevelWiseUsers.css";
import "./pages/Login/Login.css";
import "./pages/MarketPlace/AddItemM.css";
import "./pages/Product/Product.css";
import "./pages/Signup/Signup.css";
import "./pages/Support/Support.css";
import "./pages/UserManagement/AddUser.css";
import "./pages/UserManagement/User.css";
import "./components/Header/Header.css";
import "./components/Sidebar/Sidebar.jsx";
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
