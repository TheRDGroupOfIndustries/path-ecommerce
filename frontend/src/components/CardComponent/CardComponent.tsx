import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

const CardComponent = ({ service, btnText, type }) => {
  const navigate = useNavigate();

  return (
    <Card
      className="overflow-hidden py-2 bg-gray-100 gap-0 flex flex-col h-full w-full sm:max-w-xs md:max-w-sm lg:max-w-md cursor-pointer"
      onClick={() => navigate(`/enquire/${type}/${service.id}`)}
    >
      <CardHeader className="px-2">
        <img
          src={service.image}
          alt={service.title}
        
          className="w-full h-40 sm:h-48 md:h-56 rounded-2xl object-cover"
        />
      </CardHeader>
      <CardContent className="p-2 flex flex-col flex-1">
        <CardTitle className="text-base sm:text-lg">
          {service.title.length > 40
            ? service.title.slice(0, 40) + "..."
            : service.title}
        </CardTitle>
        <CardDescription className="mt-2  text-xs sm:text-sm mb-2 flex-grow  ">
          {service.description.length > 45
            ? service.description.slice(0, 45) + "..."
            : service.description}
            {/* {service.description} */}
        </CardDescription>

        
        <Button
          className={`mt-auto py-4 w-full rounded-3xl hover:text-white transition-colors duration-300 ${
            btnText === "View"
              ? "text-white primary-bg-dark"
              : "bg-transparent text-black"
          }`}
         
          onClick={(e) => {
            e.stopPropagation();
           
          }}
          type="button"
        >
          {btnText}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CardComponent;
