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
import ProtectedRoute from "./Auth/ProtectedRoute";
import AllEnqueries from "./pages/AllEnqueries";
import EnquiryDetail from "./pages/EnquiryDetail";
import Announcements from "./pages/Announcements";
import ReviewsList from "./pages/ReviewsList";
import ChangeEmail from "./pages/ChangeEmail";
import ChangePassword from "./pages/ChangePassword";
import MyReferrals from "./pages/MyReferrals";
import NotFound from "./components/Loader/Not-Found";
import ReviewsPage from "./pages/ReviewsPage";
import SearchPage from "./components/Search/SearchPage";
import ForgetPass from "./pages/Forget-Password";
import MyCart from "./pages/MyCart";
import ChangeAddress from "./pages/ChangeAddress";
import BuyNow from "./pages/BuyNow";
import Thanks from "./pages/Thanks";

function App() {
  const location = useLocation();

  const hiddenPaths = [
    "/enquire",
    "/login",
    "/signup",
    "/product-detail",
    "/thanks",
    "/forgot-password",
    "/buy-now",
    "/my-cart",
    "/change-address",
  ];
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
            path="/reviews/:type/:id"
            element={
              <ProtectedRoute>
                <ReviewsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/all-enquires"
            element={
              <ProtectedRoute>
                <AllEnqueries />
              </ProtectedRoute>
            }
          />
          <Route
            path="/enquiry-detail/:id"
            element={
              <ProtectedRoute>
                <EnquiryDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/announcements"
            element={
              <ProtectedRoute>
                <Announcements />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-reviews"
            element={
              <ProtectedRoute>
                <ReviewsList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/change-email"
            element={
              <ProtectedRoute>
                <ChangeEmail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/change-password"
            element={
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-referrals"
            element={
              <ProtectedRoute>
                <MyReferrals />
              </ProtectedRoute>
            }
          />

          <Route
            path="/search/:type"
            element={
              <ProtectedRoute>
                <SearchPage />
              </ProtectedRoute>
            }
          />

          <Route path="/forgot-password" element={<ForgetPass />} />
          <Route path="/my-cart" element={<MyCart />} />

          <Route
            path="/thanks"
            element={
              <ProtectedRoute>
                <Thanks />
              </ProtectedRoute>
            }
          />
          <Route
            path="/buy-now"
            element={
              <ProtectedRoute>
                <BuyNow />
              </ProtectedRoute>
            }
          />

          <Route
            path="/buy-now/:id/:code?"
            element={
              <ProtectedRoute>
                <BuyNow />
              </ProtectedRoute>
            }
          />

          <Route
            path="/change-address/:address"
            element={
              <ProtectedRoute>
                <ChangeAddress />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
        {!hideNavbar && <BottomNavBar />}
      </div>
    </AuthProvider>
  );
}

export default App;
