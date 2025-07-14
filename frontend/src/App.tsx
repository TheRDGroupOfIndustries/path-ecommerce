import { Route, Routes, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/authContext";
import { Toaster } from "react-hot-toast";
import Login from "./Auth/Login";
import SignUp from "./Auth/Signup";
import AllService from "./pages/AllService";
import HousesPlots from "./pages/HousesPlots";
import Enquire from "./pages/Enquire";
import BottomNavBar from "./pages/BottomNavBar";
import Shop from "./pages/Shop";
import ProfilePage from "./pages/ProfilePage";
import ProductDetail from "./pages/ProductDetail";
import ProductsList from "./pages/ProductsList";
import MyOrders from "./pages/MyOrders";
import Settings from "./pages/Settings";
import EditProfile from "./pages/EditProfile";
import TrackOrders from "./pages/TrackOrders";
import ProductReviews from "./pages/ProductReviews";
import ProtectedRoute from "./Auth/ProtectedRoute";
import AllEnqueries from "./pages/AllEnqueries";
import EnquiryDetail from "./pages/EnquiryDetail";
import Announcements from "./pages/Announcements";
import ReviewsList from "./pages/ReviewsList";
import ChangeEmail from "./pages/ChangeEmail";
import ChangePassword from "./pages/ChangePassword";
import MyReferrals from "./pages/MyReferrals";

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
            }
          }}
        />

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Shop />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/all-service"
            element={
              <ProtectedRoute>
                <AllService />
              </ProtectedRoute>
            }
          />
          <Route
            path="/houses-plots"
            element={
              <ProtectedRoute>
                <HousesPlots />
              </ProtectedRoute>
            }
          />
          <Route
            path="/enquire/:type/:id"
            element={
              <ProtectedRoute>
                <Enquire />
              </ProtectedRoute>
            }
          />
          <Route
            path="/product-detail/:id"
            element={
              <ProtectedRoute>
                <ProductDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/product-list"
            element={
              <ProtectedRoute>
                <ProductsList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-orders"
            element={
              <ProtectedRoute>
                <MyOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-profile"
            element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/track-orders"
            element={
              <ProtectedRoute>
                <TrackOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/product-reviews/:productId"
            element={
              <ProtectedRoute>
                <ProductReviews />
              </ProtectedRoute>
            }
          />
          <Route
            path="/all-enquires"
            element={
              <ProtectedRoute>
                <AllEnqueries/>
              </ProtectedRoute>
            }
          />
          <Route
            path="/enquiry-detail/:id"
            element={
              <ProtectedRoute>
                <EnquiryDetail/>
              </ProtectedRoute>
            }
          />
          <Route
            path="/announcements"
            element={
              <ProtectedRoute>
                <Announcements/>
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-reviews"
            element={
              <ProtectedRoute>
                <ReviewsList/>
              </ProtectedRoute>
            }
          />
          <Route
            path="/change-email"
            element={
              <ProtectedRoute>
                <ChangeEmail/>
              </ProtectedRoute>
            }
          />
          <Route
            path="/change-password"
            element={
              <ProtectedRoute>
                <ChangePassword/>
              </ProtectedRoute>
            }
          />
                    <Route
            path="/testing"
            element={
              <ProtectedRoute>
                <MyReferrals />
              </ProtectedRoute>
            }
          />
        </Routes>
        {!hideNavbar && <BottomNavBar/>}
      </div>
    </AuthProvider>
  );
}

export default App;
