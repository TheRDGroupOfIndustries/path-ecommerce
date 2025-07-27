import {
  ShoppingBag,
  HandPlatter,
  Building2,
  CircleUserRound,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const tabs = [
  { name: "Shop", icon: ShoppingBag, path: "/" },
  { name: "Marketplace", icon: HandPlatter, path: "/all-service" },
  { name: "Houses & Plots", icon: Building2, path: "/houses-plots" },
  { name: "Profile", icon: CircleUserRound, path: "/profile" },
];

const BottomNavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <>
      {/*  Mobile View Navbar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 w-full">
        <div className="mx-auto primary-bg-dark text-white py-3 px-2 flex gap-10 items-center shadow-lg">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = location.pathname === tab.path;

            return (
              <button
                key={tab.name}
                onClick={() => navigate(tab.path)}
                className="flex flex-col items-center justify-center space-y-1 flex-1"
              >
                <Icon
                  size={24}
                  className={isActive ? "text-white" : "text-white/40"}
                />
                <span
                  className={`text-[10px] ${
                    isActive
                      ? "text-white font-regular"
                      : "font-light text-white/40"
                  }`}
                >
                  {tab.name}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Desktop View Footer */}
      <footer className="hidden md:block bg-gray-900 text-white py-10 px-16 z-50 w-full">
        <div className="max-w-[1200px] mx-auto grid grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-semibold mb-4">About SPC</h3>
            <p className="text-sm text-gray-400">
              SPC is a Smart Property & Commerce platform where you can shop for
              products, explore services, and invest in properties all in one place.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li
                className="flex items-center gap-2 hover:text-white cursor-pointer"
                onClick={() => navigate("/")}
              >
                <ShoppingBag size={16} /> Shop
              </li>
              <li
                className="flex items-center gap-2 hover:text-white cursor-pointer"
                onClick={() => navigate("/all-service")}
              >
                <HandPlatter size={16} /> Marketplace
              </li>
              <li
                className="flex items-center gap-2 hover:text-white cursor-pointer"
                onClick={() => navigate("/houses-plots")}
              >
                <Building2 size={16} /> Houses & Plots
              </li>
              <li
                className="flex items-center gap-2 hover:text-white cursor-pointer"
                onClick={() => navigate("/profile")}
              >
                <CircleUserRound size={16} /> Profile
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="hover:text-white cursor-pointer">Contact Us</li>
              <li className="hover:text-white cursor-pointer">Privacy Policy</li>
              <li className="hover:text-white cursor-pointer">Terms of Service</li>
              <li className="hover:text-white cursor-pointer">FAQs</li>
            </ul>
          </div>

          {/* Socials */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="hover:text-white cursor-pointer">Instagram</li>
              <li className="hover:text-white cursor-pointer">LinkedIn</li>
              <li className="hover:text-white cursor-pointer">Twitter</li>
              <li className="hover:text-white cursor-pointer">Facebook</li>
            </ul>
          </div>
        </div>
      </footer>
    </>
  );
};

export default BottomNavBar;







// import {
//   ShoppingBag,
//   HandPlatter,
//   Building2,
//   CircleUserRound,
// } from "lucide-react";
// import { useLocation, useNavigate } from "react-router-dom";

// const tabs = [
//   { name: "Shop", icon: ShoppingBag, path: "/" },
//   { name: "Marketplace", icon: HandPlatter, path: "/all-service" },
//   { name: "Houses & Plots", icon: Building2, path: "/houses-plots" },
//   { name: "Profile", icon: CircleUserRound, path: "/profile" },
// ];

// const BottomNavBar= () => {
//   const location = useLocation();
//   const navigate = useNavigate();

//   return (
//     <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 w-full ">
//       <div className="mx-auto primary-bg-dark text-white py-3 px-2 flex gap-10 items-center shadow-lg">
//         {tabs.map((tab) => {
//           const Icon = tab.icon;
//           const isActive = location.pathname === tab.path;

//           return (
//             <button
//               key={tab.name}
//               onClick={() => navigate(tab.path)}
//               className="flex flex-col items-center justify-center space-y-1 flex-1"
//             >
//               <Icon
//                 size={24}
//                 className={isActive ? "text-white" : "text-white/40"}
//               />
//               <span
//                 className={`text-[10px] ${
//                   isActive ? "text-white font-regular" : "font-light text-white/40"
//                 }`}
//               >
//                 {tab.name}
//               </span>
//             </button>
//           );
//         })}
//       </div>
//     </nav>
//   );
// };

// export default BottomNavBar;
