import { Search } from "lucide-react"
import { useAuth } from "@/context/authContext"
import PROIFLE_IMAGE from "@/assets/user_img.png"
import LOOGO from "@/assets/SPC.jpg"
import { useLocation, useNavigate } from "react-router-dom"

const ProfileHeader = ({ type }: { type?: string }) => {
  const { user } = useAuth()
  const location = useLocation()
  const navigation = useNavigate()

  const handleClick = (path: string) => {
    navigation(path)
  }

  const tabs = [
    { name: "Shop", path: "/" },
    { name: "Marketplace", path: "/all-service" },
    { name: "Houses & Plots", path: "/houses-plots" },
  ]

  return (
    <>
      {/* Desktop View */}
      <div className="hidden md:block">
        {/* First Header */}
        <div className="w-full bg-white px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2 w-16 h-16">
            <img src={LOOGO || "/placeholder.svg"} alt="Logo" className="w-full h-full object-cover" />
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-[40%] mx-6">
            <div className="relative">
              <input
                className="w-full h-[50px] rounded-full bg-gray-100 px-6 pr-14 text-sm text-black placeholder-gray-500"
                placeholder="Search for products..."
              />
              <button
                onClick={() => navigation(`/search/${type}`)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 primary-bg text-white rounded-full flex items-center justify-center"
              >
                <Search size={18} />
              </button>
            </div>
          </div>

          {/* Profile */}
          <div className="flex items-center">
            <button onClick={() => navigation("/profile")} className="cursor-pointer flex items-center space-x-2">
              <img src={user?.imageUrl || PROIFLE_IMAGE} alt="User" className="w-12 h-12 rounded-full object-cover" />
            </button>
          </div>
        </div>

        {/* Second Header - Navigation Tabs */}
        <div className="w-full bg-white border-t border-gray-200 px-6 py-4">
          <div className="flex justify-center gap-8">
            {tabs.map((items) => {
              const isActive = location.pathname === items.path
              return (
                <button
                  key={items.path}
                  onClick={() => handleClick(items.path)}
                  className={`${
                    isActive ? "after:translate-y-12 -mt-4 text-blue-600 after:opacity-100 " : ""
                  } text-lg font-sans font-medium relative after:absolute after:w-1.5 after:h-1.5 after:rounded-full after:left-[45%] after:-top-1/4 after:bg-blue-600 after:-translate-y-full after:opacity-0 hover:after:opacity-100 hover:after:translate-y-12 after:transition-all after:duration-500 hover:text-blue-600 hover:-mt-4 transition-all duration-300 text-shadow-neutral-900`}
                >
                  {items.name}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Mobile View  */}
      <div className="md:hidden">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <img src={user?.imageUrl || PROIFLE_IMAGE} alt="User" className="w-12 h-12 rounded-full object-cover" />
            <div className="leading-tight">
              <p className="text-sm text-muted-foreground">Hey,</p>
              <p className="text-lg font-semibold text-black">{user?.name || "Guest"}</p>
            </div>
          </div>
          <button
            onClick={() => navigation(`/search/${type}`)}
            className="p-4 primary-bg text-white rounded-full flex items-center justify-center"
          >
            <Search size={20} />
          </button>
        </div>
        <div className="relative w-2/4 md:w-3/12 mt-4">
          <div className="w-full h-0.5 bg-black relative">
            <div className="w-3 h-3 bg-black rounded-full absolute -bottom-1 -right-1"></div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProfileHeader










// import { Search } from "lucide-react"
// import { useAuth } from "@/context/authContext"
// import PROIFLE_IMAGE from "@/assets/user_img.png"
// import LOOGO from "@/assets/SPC.jpg"
// import { useLocation, useNavigate } from "react-router-dom"

// const ProfileHeader = ({ type }: { type?: string }) => {
//   const { user } = useAuth()
//   const location = useLocation()
//   const navigation = useNavigate()

//   const handleClick = (path: string) => {
//     navigation(path)
//   }

//   const tabs = [
//     { name: "Shop", path: "/" },
//     { name: "Marketplace", path: "/all-service" },
//     { name: "Houses & Plots", path: "/houses-plots" },
//   ]

//   return (
//     <>
// {/* Desktop View */}
// <div className="hidden md:block">
//   {/* First Header */}
//   <div className="w-full bg-white px-6 py-4 flex items-center justify-between">

//     {/* logo */}
//     <div className="w-16 h-16">
//       <img src={LOOGO || "/placeholder.svg"} alt="Logo" className="w-full h-full object-cover" />
//     </div>

//     <div className="flex items-center space-x-6">
//       {/* Search Bar */}
//       <div className="w-[330px]">
//         <div className="relative">
//           <input
//             className="w-full h-[47px] bg-gray-100 px-4 pr-12 text-sm text-black placeholder-gray-500 rounded-[10px]"
//             placeholder="Search for products..."
//           />
//           <button
//             onClick={() => navigation(`/search/${type}`)}
//             className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white p-2 bg-blue-600 rounded-[25px]"
//           >
//             <Search size={18} />
//           </button>
//         </div>
//       </div>

//       {/* Profile */}
//       <button onClick={() => navigation("/profile")} className="cursor-pointer flex items-center space-x-2">
//         <img src={user?.imageUrl || PROIFLE_IMAGE} alt="User" className="w-12 h-12 rounded-full object-cover" />
//       </button>
//     </div>
//   </div>

//   {/* Second Header - Navigation Tabs */}
//   <div className="w-full bg-white border-t border-gray-200 px-6 py-4">
//     <div className="flex justify-center gap-8">
//       {tabs.map((items) => {
//         const isActive = location.pathname === items.path;
//         return (
//           <button
//             key={items.path}
//             onClick={() => handleClick(items.path)}
//             className={`${
//               isActive ? "after:translate-y-12 -mt-4 text-blue-600 after:opacity-100 " : ""
//             } text-lg font-sans font-medium relative after:absolute after:w-1.5 after:h-1.5 after:rounded-full after:left-[45%] after:-top-1/4 after:bg-blue-600 after:-translate-y-full after:opacity-0 hover:after:opacity-100 hover:after:translate-y-12 after:transition-all after:duration-500 hover:text-blue-600 hover:-mt-4 transition-all duration-300 text-shadow-neutral-900`}
//           >
//             {items.name}
//           </button>
//         );
//       })}
//     </div>
//   </div>
// </div>



//       {/* Mobile View */}
//       <div className="md:hidden">
//         <div className="flex justify-between items-center">
//           <div className="flex items-center space-x-2">
//             <img src={user?.imageUrl || PROIFLE_IMAGE} alt="User" className="w-12 h-12 rounded-full object-cover" />
//             <div className="leading-tight">
//               <p className="text-sm text-muted-foreground">Hey,</p>
//               <p className="text-lg font-semibold text-black">{user?.name || "Guest"}</p>
//             </div>
//           </div>
//           <button
//             onClick={() => navigation(`/search/${type}`)}
//             className="p-4 primary-bg text-white rounded-full flex items-center justify-center"
//           >
//             <Search size={20} />
//           </button>
//         </div>
//         <div className="relative w-2/4 md:w-3/12 mt-4">
//           <div className="w-full h-0.5 bg-black relative">
//             <div className="w-3 h-3 bg-black rounded-full absolute -bottom-1 -right-1"></div>
//           </div>
//         </div>
//       </div>
//     </>
//   )
// }

// export default ProfileHeader

//----------------------------------------------------------------------------------------------


// import { Search } from "lucide-react";
// import React, { useState } from "react";
// import { useAuth } from "@/context/authContext";
// import PROIFLE_IMAGE from "@/assets/user_img.png";
// import LOOGO from "@/assets/SPC.jpg";
// import { useLocation, useNavigate } from "react-router-dom";

// const ProfileHeader = ({ type }: { type?: string }) => {
//   const { user } = useAuth();

//   // const [active, setActive] = useState(tabs[0].name)
//   const location = useLocation();
//   const navigation = useNavigate();

//   const handleClick = (path: string) => {
//     navigation(path);
//   };

//   const tabs = [
//     { name: "Shop", path: "/" },
//     { name: "Marketplace", path: "/all-service" },
//     { name: "Houses & Plots", path: "/houses-plots" },
//   ];

//   return (
//     <>
//       <div className="hidden md:flex w-full justify-between items-center">
//         <div className="flex items-center space-x-2 w-16 h-16">
//           <img src={LOOGO} alt="Logo" className="w-full h-full object-cover" />
//         </div>

//         <div className="flex gap-4">
//           {tabs.map((items) => {
//             const isActive = location.pathname === items.path;
//             return (
//               <button
//                 key={items.path}
//                 onClick={() => handleClick(items.path)}
//                 className={`${
//                   isActive
//                     ? "after:translate-y-12 -mt-4 text-blue-600 after:opacity-100 "
//                     : ""
//                 } text-lg font-sans font-medium relative after:absolute after:w-1.5 after:h-1.5 after:rounded-full after:left-[45%] after:-top-1/4 after:bg-blue-600 after:-translate-y-full after:opacity-0 hover:after:opacity-100 hover:after:translate-y-12 after:transition-all after:duration-500 hover:text-blue-600 hover:-mt-4 transition-all duration-300 text-shadow-neutral-900`}
//               >
//                 {items.name}
//               </button>
//             );
//           })}
//         </div>

//         <div className="flex gap-2">
//           <button onClick={() => navigation("/profile")} className="cursor-pointer flex items-center space-x-2">
//             <img
//               src={user?.imageUrl || PROIFLE_IMAGE}
//               alt="User"
//               className="w-12 h-12 rounded-full object-cover"
//             />
//           </button>
//           {/* <input className="w-60 h-12 rounded-full bg-gray-100 px-4 text-sm text-black" placeholder="Search for products..." /> */}
//           <button
//             onClick={() => navigation(`/search/${type}`)}
//             className="p-4 primary-bg text-white rounded-full flex items-center justify-center"
//           >
//             <Search size={18} />
//           </button>
//         </div>
//       </div>


//       <div className="md:hidden">
//         <div className="flex justify-between items-center">
//           <div className="flex items-center space-x-2">
//             <img
//               src={user?.imageUrl || PROIFLE_IMAGE}
//               alt="User"
//               className="w-12 h-12 rounded-full object-cover"
//             />
//             <div className="leading-tight">
//               <p className="text-sm text-muted-foreground">Hey,</p>
//               <p className="text-lg font-semibold text-black">
//                 {user?.name || "Guest"}
//               </p>
//             </div>
//           </div>

//           <button
//             onClick={() => navigation(`/search/${type}`)}
//             className="p-4 primary-bg text-white rounded-full flex items-center justify-center"
//           >
//             <Search size={20} />
//           </button>
//         </div>

//         <div className="relative w-2/4 md:w-3/12 mt-4">
//           <div className="w-full h-0.5 bg-black relative">
//             <div className="w-3 h-3 bg-black rounded-full absolute -bottom-1 -right-1"></div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default ProfileHeader;
