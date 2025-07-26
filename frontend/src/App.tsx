import { Route, Routes, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/authContext";
import { Toaster } from "react-hot-toast";
import BottomNavBar from "./pages/BottomNavBar";
import ProtectedRoute from "./Auth/ProtectedRoute";
import NotFound from "./components/Loader/Not-Found";
import { Suspense, lazy, useEffect } from "react";
import MyEnquiries from "./pages/MyEnquiries";
import HelpDesk from "./pages/HelpDesk";

// 1️⃣ Lazy load pages for better performance
const Login = lazy(() => import("./Auth/Login"));
const SignUp = lazy(() => import("./Auth/Signup"));
const GoogleSuccess = lazy(() => import("./pages/GoogleSuccess"));
const AllService = lazy(() => import("./pages/AllService"));
const HousesPlots = lazy(() => import("./pages/HousesPlots"));
const Enquire = lazy(() => import("./pages/Enquire"));
const Shop = lazy(() => import("./pages/Shop"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const ProductsList = lazy(() => import("./pages/ProductsList"));
const MyOrders = lazy(() => import("./pages/MyOrders"));
const Settings = lazy(() => import("./pages/Settings"));
const EditProfile = lazy(() => import("./pages/EditProfile"));
const TrackOrders = lazy(() => import("./pages/TrackOrders"));
const AllEnqueries = lazy(() => import("./pages/AllEnqueries"));
const EnquiryDetail = lazy(() => import("./pages/EnquiryDetail"));
const Announcements = lazy(() => import("./pages/Announcements"));
const ReviewsList = lazy(() => import("./pages/ReviewsList"));
const ChangeEmail = lazy(() => import("./pages/ChangeEmail"));
const ChangePassword = lazy(() => import("./pages/ChangePassword"));
const MyReferrals = lazy(() => import("./pages/MyReferrals"));
const ReviewsPage = lazy(() => import("./pages/ReviewsPage"));
const SearchPage = lazy(() => import("./components/Search/SearchPage"));
const ForgetPass = lazy(() => import("./pages/Forget-Password"));
const MyCart = lazy(() => import("./pages/MyCart"));
const ChangeAddress = lazy(() => import("./pages/ChangeAddress"));
const BuyNow = lazy(() => import("./pages/BuyNow"));
const Thanks = lazy(() => import("./pages/Thanks"));

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
              fontSize: "14px",
              padding: "10px 16px",
              maxWidth: "90%",
            },
          }}
        />
        {!hideNavbar && <BottomNavBar />}

        {/* 3️⃣ Suspense fallback for lazy loading */}
        <Suspense
          fallback={<div className="text-center mt-10">Loading...</div>}
        >
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/google-success" element={<GoogleSuccess />} />
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
            <Route
              path="/my-cart"
              element={
                <ProtectedRoute>
                  <MyCart />
                </ProtectedRoute>
              }
            />
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
            <Route
              path="/my-enquiries"
              element={
                <ProtectedRoute>
                  <MyEnquiries />
                </ProtectedRoute>
              }
            />
            <Route
              path="/help-desk"
              element={
                <ProtectedRoute>
                  <HelpDesk />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </div>
    </AuthProvider>
  );
}

export default App;
