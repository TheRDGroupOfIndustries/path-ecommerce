import { Route, Routes, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/authContext";
import Login from "./Auth/Login";
import SignUp from "./Auth/Signup";
import AllService from "./pages/AllService";
import HousesPlots from "./pages/HousesPlots";
import Enquire from "./pages/Enquire";
import BottomNavBar from "./pages/BottomNavBar ";
import Shop from "./pages/Shop";
import ProfilePage from "./pages/ProfilePage";

function App() {
   const location = useLocation();

  const hiddenPaths = ["/enquire", "/login", "/signup"];
const hideNavbar = hiddenPaths.some(path => location.pathname.startsWith(path));


  return (
    <AuthProvider>
      <div className="text-3xl text-gray-500 font-Sora">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/all-service" element={<AllService />} />
          <Route path="/houses-plots" element={<HousesPlots />} />
         <Route path="/enquire/:type/:id" element={<Enquire />} />
        </Routes>
        {!hideNavbar && <BottomNavBar />}
      </div>
    </AuthProvider>
  );
}

export default App;
