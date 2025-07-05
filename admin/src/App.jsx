import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, createContext, useEffect } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import Header from "./components/Header/Header";
import Dashboard from "./pages/Dashboard/Dashboard";
import ViewUser from "./pages/UserManagement/ViewUser";
import Login from "./pages/Login/Login";
import KYC from "./pages/UserManagement/KYC";
import AddItemM from "./pages/MarketPlace/AddItemM";
import ViewItemM from "./pages/MarketPlace/ViewItemM";
import AddItemP from "./pages/Property/AddItemP";
import ViewItemP from "./pages/Property/ViewItemP";
import Signup from "./pages/Signup/Signup";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import AddProduct from "./pages/Product/AddProduct";
import ViewProduct from "./pages/Product/ViewProduct";
import AddAssociate from "./pages/Associate/AddAssociate";
import Enquiry from "./pages/Enquiry/Enquiry";

// Global Context
export const myContext = createContext();

function AppLayout({ darkMode, toggleDarkMode, sidebarOpen, toggleSidebar }) {
  return (
    <>
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        darkMode={darkMode}
      />
      <div className={`main-content${sidebarOpen ? " sidebar-open" : " sidebar-closed"}`}>
        <Header
          toggleSidebar={toggleSidebar}
          toggleDarkMode={toggleDarkMode}
          darkMode={darkMode}
        />
        <Routes>
          <Route path="/" element={<Dashboard darkMode={darkMode} />} />
          <Route path="/dashboard" element={<Dashboard darkMode={darkMode} />} />
          <Route path="/users" element={<ViewUser />} />
          <Route path="/kyc" element={<KYC />} />
          <Route path="/additemM" element={<AddItemM />} />
          <Route path="/viewitemM" element={<ViewItemM />} />
          <Route path="/additemP" element={<AddItemP />} />
          <Route path="/viewitemP" element={<ViewItemP />} />
          <Route path="/addproduct" element={<AddProduct />} />
          <Route path="/viewproduct" element={<ViewProduct />} />
          <Route path="/addAssociate" element={<AddAssociate/>} />
          <Route path="/enquiry" element={<Enquiry/>} />
        </Routes>
      </div>
    </>
  );
}

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem('darkMode');
    return stored ? JSON.parse(stored) : false;
  });
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth > 768);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  // Global Alert Box State
  const [alertBox, setAlertBox] = useState({
    msg: "",
    error: false,
    open: false,
  });

  const handleClose = (event, reason) => {
    if (reason === "clickaway") return;
    setAlertBox((prev) => ({ ...prev, open: false }));
  };

  const contextValue = {
    alertBox,
    setAlertBox,
  };

  return (
    <myContext.Provider value={contextValue}>
      <div className={`dashboard-container${darkMode ? " dark" : ""}`}>
        <Router>
          {/* Alert Box visible for ALL routes */}
          <Snackbar
            open={alertBox.open}
            autoHideDuration={6000}
            onClose={handleClose}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert
              onClose={handleClose}
              severity={alertBox.error ? "error" : "success"}
              variant="filled"
              sx={{ width: "100%" }}
            >
              {alertBox.msg}
            </Alert>
          </Snackbar>

          {/* Routes */}
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected Layout */}
            <Route
              path="*"
              element={
                <AppLayout
                  darkMode={darkMode}
                  toggleDarkMode={toggleDarkMode}
                  sidebarOpen={sidebarOpen}
                  toggleSidebar={toggleSidebar}
                />
              }
            />
          </Routes>
        </Router>
      </div>
    </myContext.Provider>
  );
}

export default App;





// import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
// import { useState,createContext} from "react"
// import Sidebar from "./components/Sidebar/Sidebar"
// import Header from "./components/Header/Header"
// import Dashboard from "./Pages/Dashboard/Dashboard"
// import ViewUser from "./Pages/UserManagement/ViewUser"
// import Login from "./Pages/Login/Login"
// import KYC from "./Pages/UserManagement/KYC"
// import AddItemM from "./pages/MarketPlace/AddItemM"
// import ViewItemM from "./pages/MarketPlace/ViewItemM"
// import AddItemP from "./pages/Property/AddItemP"
// import ViewItemP from "./pages/Property/ViewItemP"
// import Signup from "./Pages/Signup/Signup"
// import Snackbar from '@mui/material/Snackbar';
// import Alert from '@mui/material/Alert';
// import AddProduct from "./Pages/Product/AddProduct"
// import ViewProduct from "./Pages/Product/ViewProduct"

// export const myContext = createContext();

// function AppLayout({ darkMode, toggleDarkMode, sidebarOpen, toggleSidebar }) {

//    const [alertBox, setAlertBox] = useState({
//     msg: '',
//     error: false,
//     open: false,
//   });

//   const handleClose = (event, reason) => {
//     if (reason === 'clickaway') return;
//     setAlertBox({ ...alertBox, open: false });
//   };

//   const contextValue = {
//     alertBox,
//     setAlertBox,
//   };

//   return (
//     <>
//    <myContext.Provider value={contextValue}>
//        <Snackbar
//           open={alertBox.open}
//           autoHideDuration={6000}
//           onClose={handleClose}
//           anchorOrigin={{ vertical: "top", horizontal: "center" }}
//         >
//           <Alert
//             onClose={handleClose}
//             severity={alertBox.error ? "error" : "success"}
//             variant="filled"
//             sx={{ width: '100%' }}
//           >
//             {alertBox.msg}
//           </Alert>
//         </Snackbar>

//       <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} darkMode={darkMode} />
//       <div className={`main-content${sidebarOpen ? " sidebar-open" : " sidebar-closed"}`}>
//         <Header
//           toggleSidebar={toggleSidebar}
//           toggleDarkMode={toggleDarkMode}
//           darkMode={darkMode}
//         />
//         <Routes>
//           <Route path="/" element={<Dashboard darkMode={darkMode} />} />
//           <Route path="/dashboard" element={<Dashboard darkMode={darkMode} />} />
//           <Route path="/users" element={<ViewUser />} />
//           <Route path="/kyc" element={<KYC/>} />
//           <Route path="/additemM" element={<AddItemM/>} />
//           <Route path="/viewitemM" element={<ViewItemM/>}/>
//            <Route path="/additemP" element={<AddItemP/>} />
//           <Route path="/viewitemP" element={<ViewItemP/>}/>
//           <Route path="/addproduct" element={<AddProduct/>}/>
//           <Route path="/viewproduct" element={<ViewProduct/>}/>
//         </Routes>
//       </div>
//       </myContext.Provider>
//     </>
//   )
// }

// function App() {
//   const [darkMode, setDarkMode] = useState(false)
//   const [sidebarOpen, setSidebarOpen] = useState(true)

//   const toggleDarkMode = () => setDarkMode(!darkMode)
//   const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

//   return (
//     <div className={`dashboard-container${darkMode ? " dark" : ""}`}>
//       <Router>
//         <Routes>
//           {/* Public Route (No sidebar, no header) */}
//           <Route path="/login" element={<Login />} />
//           <Route path="/signup" element={<Signup/>} />

//           {/* Protected Layout */}
//           <Route
//             path="*"
//             element={
//               <AppLayout
//                 darkMode={darkMode}
//                 toggleDarkMode={toggleDarkMode}
//                 sidebarOpen={sidebarOpen}
//                 toggleSidebar={toggleSidebar}
//               />
//             }
//           />
//         </Routes>
//       </Router>
//     </div>
//   )
// }

// export default App
