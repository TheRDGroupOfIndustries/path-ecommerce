import { Route, Routes, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/authContext";
import { Toaster } from "react-hot-toast";
import Login from "./Auth/Login";
import SignUp from "./Auth/Signup";
import AllService from "./pages/AllService";
import HousesPlots from "./pages/HousesPlots";
import Enquire from "./pages/Enquire";
import BottomNavBar from "./pages/BottomNavBar ";
import Shop from "./pages/Shop";
import ProfilePage from "./pages/ProfilePage";
import ProductDetail from "./pages/ProductDetail";
import ProductsList from "./pages/ProductsList";
import MyOrders from "./pages/MyOrders";
import Settings from "./pages/Settings";
import EditProfile from "./pages/EditProfile";
import TrackOrders from "./pages/TrackOrders";
import ProductReviews from "./pages/ProductReviews";

function App() {
  const location = useLocation();

  const hiddenPaths = ["/enquire", "/login", "/signup", "/product-detail"];
  const hideNavbar = hiddenPaths.some((path) =>
    location.pathname.startsWith(path)
  );

  return (
    <AuthProvider>
      <div className="text-3xl text-gray-500 font-Sora">
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              fontSize: "14px", // Smaller text on mobile
              padding: "10px 16px",
              maxWidth: "90%", // Prevents overflow
            },
          }}
        />

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/" element={<Shop />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/all-service" element={<AllService />} />
          <Route path="/houses-plots" element={<HousesPlots />} />
          <Route path="/enquire/:type/:id" element={<Enquire />} />
          <Route path="/product-detail/:id" element={<ProductDetail />} />
          <Route path="/product-list" element={<ProductsList />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/track-orders" element={<TrackOrders />} />
          <Route path="/product-reviews" element={<ProductReviews />} />
        </Routes>

        {!hideNavbar && <BottomNavBar />}
      </div>
    </AuthProvider>
  );
}

export default App;
