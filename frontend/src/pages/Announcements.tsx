import Loader from "@/components/Loader/Loader";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { API_URL } from "@/lib/api.env";
import axios from "axios";
import { ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";

export default function Announcements() {

const [announcements, setAnnouncements] = useState();

  const handleGoBack = () => {
    window.history.back();
  };
   useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/announcement/get`);
        setAnnouncements(res.data.reverse());
      } catch (error) {
        console.error("Failed to fetch announcements:", error);
      }
    };

    fetchAnnouncements();
  }, []);

  if(!announcements)return <Loader/>
  return (
    <div className="container mx-auto p-4 mb-18">
      {/* Header */}
      <div className="flex items-center h-14  text-black mb-2">
        <ChevronLeft
          className="w-8 h-8 cursor-pointer"
          onClick={handleGoBack}
        />
        <h2 className="flex-1 text-2xl text-center font-semibold">
          Announcements
        </h2>
      </div>

      {/* Announcements List */}

      <div className=" py-4 space-y-2">
        {announcements.map((announcement) => (
          <div className="flex items-start gap-3 py-3" key={announcement.id}>
            {/* Avatar */}
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-blue-200 text-blue-800 text-sm">
                A
              </AvatarFallback>
            </Avatar>

            {/* Message Content */}
            <div>
              <p className="text-sm font-medium text-gray-800 mb-1">
                {/* {announcement.title} */}
                Admin
              </p>
              <Card className="bg-gray-100 border-none shadow-none p-3 max-w-md rounded-tl-none">
                <CardContent className="p-0 text-gray-700 text-sm space-y-2">
                  <p
                    // className={`text-sm leading-relaxed ${
                    //   announcement.isRead ? "text-gray-600" : "text-gray-700"
                    // }`}
                    className="text-sm leading-relaxed text-gray-800"
                  >
                    {announcement?.text}
                    {/* {announcement?.content} */}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

//  <Card key={announcement.id} className="bg-white shadow-sm">
//             <CardContent className="p-4">
//               <div className="flex items-start space-x-3">
//                 {/* Bell Icon */}
//                 <div
//                   className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
//                     announcement.isRead ? "bg-gray-100" : "bg-blue-100"
//                   }`}
//                 >
//                   <Bell
//                     className={`w-4 h-4 ${
//                       announcement.isRead ? "text-gray-500" : "text-blue-600"
//                     }`}
//                   />
//                 </div>

//                 {/* Content */}
//                 <div className="flex-1 min-w-0">
//                   <div className="flex items-center justify-between mb-2">
//                     <h3
//                       className={`text-sm font-medium ${
//                         announcement.isRead ? "text-gray-700" : "text-blue-600"
//                       }`}
//                     >
//                       {announcement.title}
//                     </h3>
//                   </div>

//                   <p
//                     className={`text-sm leading-relaxed ${
//                       announcement.isRead ? "text-gray-600" : "text-gray-700"
//                     }`}
//                   >
//                     {announcement.content}
//                   </p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//   <div className="flex items-start gap-3 py-3">
//     {/* Avatar */}
//     <Avatar className="w-8 h-8">
//       <AvatarFallback className="bg-blue-200 text-blue-800 text-sm">
//         A
//       </AvatarFallback>
//     </Avatar>

//     {/* Message Content */}
//     <div>
//     <p className="text-sm font-medium text-gray-800 mb-1">Admin</p>
//       <Card className="bg-gray-100 border-none shadow-none p-3 max-w-md">
//         <CardContent className="p-0 text-gray-700 text-sm space-y-2">
//           <p>
//             Lorem ipsum dolor sit amet consectetur. Eliefend venenatis
//             ornare proin non quisque id. Proin eget tortor feugiat vel sit
//             eget imperdiet. Proin risus mattis dictum amet purus aliquam in.
//           </p>
//           <p>
//             Facilisis nunc volutpat fringilla pellentesque at nunc in. Eu et
//             egestas ut a dictum tincidunt sed in. Diam arcu massa iaculis
//             lectus massa ultricies justo.
//           </p>
//           <p>
//             Diam nunc aliquet imperdiet elementum aenean lectus. Vitae
//             fermentum faucibus semper diam magna. Lobortis odio consequat
//             mollis magna nulla elit. Quis phasellus porta sed velit quam
//             commodo velit.
//           </p>
//         </CardContent>
//       </Card>
//     </div>

//   </div>
