import {
  ShoppingBag,
  HandPlatter,
  Building2,
  CircleUserRound,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const tabs = [
  { name: "Shop", icon: ShoppingBag, path: "/" },
  { name: "Services", icon: HandPlatter, path: "/all-service" },
  { name: "Houses & Plots", icon: Building2, path: "/houses-plots" },
  { name: "Profile", icon: CircleUserRound, path: "/profile" },
];

const BottomNavBar= () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 w-full ">
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
                className={isActive ? "text-white" : "text-white/50"}
              />
              <span
                className={`text-[10px] ${
                  isActive ? "text-white font-regular" : "font-light text-white/50"
                }`}
              >
                {tab.name}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavBar;
