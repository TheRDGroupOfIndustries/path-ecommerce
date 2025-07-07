// import { Search } from 'lucide-react'
// import React from 'react'

// const ProfileHeader = () => {
//   return (
//     <div>
  
//       <div className="flex justify-between items-center">
//         <div className="flex items-center space-x-2">
//           <img
//             src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
//             alt="User"
//             className="w-10 h-10 rounded-full object-cover"
//           />
//           <div className="leading-tight">
//             <p className="text-sm text-muted-foreground">Hey,</p>
//             <p className="text-lg font-semibold text-black">anme</p>
//           </div>
//         </div>
//         <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center">
//           <Search size={20} />
//         </div>
//       </div>

//       <div className="relative w-2/3 mt-4">
//         <div className="w-full h-0.5 bg-black relative">
//           <div className="w-3 h-3 bg-black rounded-full absolute -bottom-1 -right-1"></div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default ProfileHeader


import { Search } from "lucide-react";
import React from "react";
import { useAuth } from "@/context/authContext";

const ProfileHeader = () => {
  const { user } = useAuth(); // Accessing the user from AuthContext
  // console.log("userHeadr: ",user);
  

  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <img
            src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="User"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="leading-tight">
            <p className="text-sm text-muted-foreground">Hey,</p>
            <p className="text-lg font-semibold text-black">
              {user?.name || "Guest"}
            </p>
          </div>
        </div>

        <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center">
          <Search size={20} />
        </div>
      </div>

      <div className="relative w-2/3 mt-4">
        <div className="w-full h-0.5 bg-black relative">
          <div className="w-3 h-3 bg-black rounded-full absolute -bottom-1 -right-1"></div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
