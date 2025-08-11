import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, createContext, useEffect, lazy, Suspense } from "react";

// Components
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Sidebar from "./components/Sidebar/Sidebar";
import Header from "./components/Header/Header";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
const Dashboard = lazy(() => import("./pages/Dashboard/Dashboard"));
const ViewUser = lazy(() => import("./pages/UserManagement/ViewUser"));
const Login = lazy(() => import("./pages/Login/Login"));
const KYC = lazy(() => import("./pages/UserManagement/KYC"));
const AddItemM = lazy(() => import("./pages/MarketPlace/AddItemM"));
const ViewItemM = lazy(() => import("./pages/MarketPlace/ViewItemM"));
const AddItemP = lazy(() => import("./pages/Property/AddItemP"));
const ViewItemP = lazy(() => import("./pages/Property/ViewItemP"));
const Signup = lazy(() => import("./pages/Signup/Signup"));
const AddProduct = lazy(() => import("./pages/Product/AddProduct"));
const ViewProduct = lazy(() => import("./pages/Product/ViewProduct"));
const AddAssociate = lazy(() => import("./pages/Associate/AddAssociate"));
const Enquiry = lazy(() => import("./pages/Enquiry/Enquiry"));
const AdminKYCList = lazy(() => import("./pages/AdminKyc/AdminKycList"));
const KycStatusPage = lazy(() => import("./pages/UserManagement/KycStatusPage"));
const AdminAnnouncment = lazy(() => import("./pages/Announcment/AdminAnnouncment"));
const SellerAnnouncment = lazy(() => import("./pages/Announcment/SellerAnnouncment"));
const ViewAssociate = lazy(() => import("./pages/Associate/ViewAssociate"));
const Support = lazy(() => import("./pages/Support/Support"));
const SupportDetails = lazy(() => import("./pages/Support/SupportDetail"));
const RefUser = lazy(() => import("./pages/UserManagement/RefUser"));
const CommissionLevels = lazy(() => import("./pages/Levels/CommissionLevels"));
const LevelWiseUsers = lazy(() => import("./pages/Levels/LevelWiseUsers"));
const AddUser = lazy(() => import("./pages/UserManagement/AddUser"));

// Global Context
export const myContext = createContext();

// Protected App Layout
function AppLayout({ darkMode, toggleDarkMode, sidebarOpen, toggleSidebar }) {
  return (
    <>
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} darkMode={darkMode} />
      <div className={`main-content${sidebarOpen ? " sidebar-open" : " sidebar-closed"}`}>
        <Header toggleSidebar={toggleSidebar} toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
        <Suspense fallback={<div style={{ padding: 20 }}>Loading...</div>}>
          <Routes>
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard darkMode={darkMode} />
                </ProtectedRoute>
              }
            />
            <Route path="/users" element={<ViewUser />} />
            <Route path="/kyc" element={<KYC />} />
            <Route path="/additemM" element={<AddItemM />} />
            <Route path="/viewitemM" element={<ViewItemM />} />
            <Route path="/additemP" element={<AddItemP />} />
            <Route path="/viewitemP" element={<ViewItemP />} />
            <Route path="/addproduct" element={<AddProduct />} />
            <Route path="/viewproduct" element={<ViewProduct />} />
            <Route path="/addAssociate" element={<AddAssociate />} />
            <Route path="/enquiry" element={<Enquiry />} />
            <Route path="/view-kyc" element={<AdminKYCList />} />
            <Route path="/admin-anouncment" element={<AdminAnnouncment />} />
            <Route path="/seller-anouncment" element={<SellerAnnouncment />} />
            <Route path="/viewAssociate" element={<ViewAssociate />} />
            <Route path="/support" element={<Support />} />
            <Route path="/supportDetails" element={<SupportDetails />} />
            <Route path="/ref-user" element={<RefUser />} />
            <Route path="/level-commissions" element={<CommissionLevels />} />
            <Route path="/level-users" element={<LevelWiseUsers />} />
            <Route path="/add-user" element={<AddUser />} />
          </Routes>
        </Suspense>
      </div>
    </>
  );
}


// App Component
function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem("darkMode");
    return stored ? JSON.parse(stored) : false;
  });

  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth > 1200);

  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth > 1200);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const [alertBox, setAlertBox] = useState({
    msg: "",
    error: false,
    open: false,
  });

  const handleClose = (event, reason) => {
    if (reason === "clickaway") return;
    setAlertBox((prev) => ({ ...prev, open: false }));
  };

  const contextValue = { alertBox, setAlertBox };

  return (
    <myContext.Provider value={contextValue}>
      <div
        className={`dashboard-app-bg${darkMode ? " dark" : ""}`}
        style={{ background: darkMode ? "#181c2f" : "#f6f7ff", minHeight: "100vh" }}
      >
        <Router>
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

          <Suspense fallback={<div style={{ padding: 20 }}>Loading...</div>}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Login />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/kycc" element={<ProtectedRoute><KYC /></ProtectedRoute>} />
              <Route path="/kyc-status" element={<ProtectedRoute><KycStatusPage /></ProtectedRoute>} />

              {/* Protected Layout */}
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <AppLayout
                      darkMode={darkMode}
                      toggleDarkMode={toggleDarkMode}
                      sidebarOpen={sidebarOpen}
                      toggleSidebar={toggleSidebar}
                    />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Suspense>
        </Router>
      </div>
    </myContext.Provider>
  );
}

export default App;



// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { useState, createContext, useEffect } from "react";

// // Components
// import Sidebar from "./components/Sidebar/Sidebar";
// import Header from "./components/Header/Header";
// import ProtectedRoute from "./components/ProtectedRoute";

// // Pages
// import Dashboard from "./pages/Dashboard/Dashboard";
// import ViewUser from "./pages/UserManagement/ViewUser";
// import Login from "./pages/Login/Login";
// import KYC from "./pages/UserManagement/KYC";
// import AddItemM from "./pages/MarketPlace/AddItemM";
// import ViewItemM from "./pages/MarketPlace/ViewItemM";
// import AddItemP from "./pages/Property/AddItemP";
// import ViewItemP from "./pages/Property/ViewItemP";
// import Signup from "./pages/Signup/Signup";
// import Snackbar from "@mui/material/Snackbar";
// import Alert from "@mui/material/Alert";
// import AddProduct from "./pages/Product/AddProduct";
// import ViewProduct from "./pages/Product/ViewProduct";
// import AddAssociate from "./pages/Associate/AddAssociate";
// import Enquiry from "./pages/Enquiry/Enquiry";
// import AdminKYCList from "./pages/AdminKyc/AdminKycList";
// import KycStatusPage from "./pages/UserManagement/KycStatusPage";
// import AdminAnnouncment from "./pages/Announcment/AdminAnnouncment";
// import SellerAnnouncment from "./pages/Announcment/SellerAnnouncment";
// import ViewAssociate from "./pages/Associate/ViewAssociate";
// import Support from "./pages/Support/Support";
// import SupportDetails from "./pages/Support/SupportDetail";
// import RefUser from "./pages/UserManagement/RefUser";
// import CommissionLevels from "./pages/Levels/CommissionLevels";
// import LevelWiseUsers from "./pages/Levels/LevelWiseUsers";
// import AddUser from "./pages/UserManagement/AddUser";

// // Global Context
// export const myContext = createContext();

// // Protected App Layout
// function AppLayout({ darkMode, toggleDarkMode, sidebarOpen, toggleSidebar }) {
//   return (
//     <>
//       <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} darkMode={darkMode} />
//       <div className={`main-content${sidebarOpen ? " sidebar-open" : " sidebar-closed"}`}>
//         <Header toggleSidebar={toggleSidebar} toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
//         <Routes>
//           <Route
//           path="/dashboard"
//           element={
//             <ProtectedRoute>
//               <Dashboard darkMode={darkMode} />
//             </ProtectedRoute>
//           }
//         />
//           <Route path="/users" element={<ViewUser />} />
//           <Route path="/kyc" element={<KYC />} />
//           <Route path="/additemM" element={<AddItemM />} />
//           <Route path="/viewitemM" element={<ViewItemM />} />
//           <Route path="/additemP" element={<AddItemP />} />
//           <Route path="/viewitemP" element={<ViewItemP />} />
//           <Route path="/addproduct" element={<AddProduct />} />
//           <Route path="/viewproduct" element={<ViewProduct />} />
//           <Route path="/addAssociate" element={<AddAssociate />} />
//           <Route path="/enquiry" element={<Enquiry />} />
//           <Route path="/view-kyc" element={<AdminKYCList />} />
//           <Route path="/admin-anouncment" element={<AdminAnnouncment />} />
//           <Route path="/seller-anouncment" element={<SellerAnnouncment />} />
//           <Route path="/viewAssociate" element={<ViewAssociate />} />
//           <Route path="/support" element={<Support />} />
//           <Route path="/supportDetails" element={<SupportDetails />} />
//           <Route path="/ref-user" element={<RefUser />} />
//           <Route path="/level-commissions" element={<CommissionLevels />} />
//           <Route path="/level-users" element={<LevelWiseUsers />} />
//           <Route path="/add-user" element={<AddUser />} />
//         </Routes>
//       </div>
//     </>
//   );
// }


// // App Component
// function App() {
//   const [darkMode, setDarkMode] = useState(() => {
//     const stored = localStorage.getItem("darkMode");
//     return stored ? JSON.parse(stored) : false;
//   });

//   const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth > 1200);

//   useEffect(() => {
//     const handleResize = () => {
//       setSidebarOpen(window.innerWidth > 1200);
//     };
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   useEffect(() => {
//     localStorage.setItem("darkMode", JSON.stringify(darkMode));
//   }, [darkMode]);

//   const toggleDarkMode = () => setDarkMode((prev) => !prev);
//   const toggleSidebar = () => setSidebarOpen((prev) => !prev);

//   const [alertBox, setAlertBox] = useState({
//     msg: "",
//     error: false,
//     open: false,
//   });

//   const handleClose = (event, reason) => {
//     if (reason === "clickaway") return;
//     setAlertBox((prev) => ({ ...prev, open: false }));
//   };

//   const contextValue = { alertBox, setAlertBox };

//   return (
//     <myContext.Provider value={contextValue}>
//       <div
//         className={`dashboard-app-bg${darkMode ? " dark" : ""}`}
//         style={{ background: darkMode ? "#181c2f" : "#f6f7ff", minHeight: "100vh" }}
//       >
//         <Router>
//           <Snackbar
//             open={alertBox.open}
//             autoHideDuration={6000}
//             onClose={handleClose}
//             anchorOrigin={{ vertical: "top", horizontal: "center" }}
//           >
//             <Alert
//               onClose={handleClose}
//               severity={alertBox.error ? "error" : "success"}
//               variant="filled"
//               sx={{ width: "100%" }}
//             >
//               {alertBox.msg}
//             </Alert>
//           </Snackbar>

//           {/* Public and Protected Routes */}
//           <Routes>
//             {/* Public Routes */}
//             <Route path="/" element={<Login />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/signup" element={<Signup />} />

//             <Route path="/kycc" element={
//              <ProtectedRoute>
//              <KYC />
//              </ProtectedRoute>
//             }
//              />

//             <Route path="/kyc-status" element={
//               <ProtectedRoute>
//               <KycStatusPage />
//               </ProtectedRoute>
//               } />

//             {/* Protected Layout and Routes */}
//             <Route
//               path="/*"
//               element={
//                 <ProtectedRoute>
//                   <AppLayout
//                     darkMode={darkMode}
//                     toggleDarkMode={toggleDarkMode}
//                     sidebarOpen={sidebarOpen}
//                     toggleSidebar={toggleSidebar}
//                   />
//                 </ProtectedRoute>
//               }
//             />
//           </Routes>
//         </Router>
//       </div>
//     </myContext.Provider>
//   );
// }

// export default App;

