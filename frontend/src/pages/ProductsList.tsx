
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@/context/authContext";

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {  ChevronLeft, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '@/context/authContext';
import { API_URL } from '@/lib/api.temp';
import Loader from '@/components/Loader/Loader';


const ProductListItem = ({ image, rating, title, description, productId }) => {
  const navigate = useNavigate();

  return (
    <Card
      className="rounded-lg mb-4 bg-gray-100 p-2 border-none shadow-none"
      onClick={() => navigate(`/product-detail/${productId}`)}
    >
      <CardContent className="flex items-center space-x-4 px-1 py-1">
        <div className="relative w-32 h-32 flex-shrink-0 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover rounded-lg"
          />
          <div className="absolute bottom-2 left-2 flex items-center px-1 py-[1px] bg-gray-100/40 rounded-xs gap-1">
            <Star className="w-3 h-3 text-yellow-400 fill-current" />
            <span className="text-[10px] text-black">{rating}</span>
          </div>
        </div>
        <div className="flex-1 flex flex-col space-y-3 overflow-hidden">
          <h3 className="text-lg text-black font-semibold truncate">{title}</h3>
          <p className="text-sm font-light text-gray-600 break-words">
            {description.length > 72 ? (
              <>{description.slice(0, 72)}...</>
            ) : (
              description
            )}
          </p>
          <p className="text-xs text-black/90 font-light truncate">
            Product ID: {productId}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

const ProductsList = () => {
  // const navigate=useNavigate();
  const { user } = useAuth();
  const [products, setProducts] = useState();
  const id = user?.id;
  // console.log("id: ",id);

//   useEffect(() => {
//     const fetchData = async () => {
//       const res = await axios(`http://localhost:8000/api/seller/${id}`);
//       // console.log("res: ",res);

// <<<<<<< chetan-frontend
//       setProducts(res.data.productSeller);
//     };
//     fetchData();
//   }, [id]);

   useEffect(() => {
   const fetchData = async () => {
    const res = await axios(`${API_URL}/api/seller/${id}`);
    // console.log("res: ",res);
    
    setProducts(res.data.productSeller)
    
  };
  fetchData();
}, [id]);


  // console.log("res:",products );

  const handleGoBack = () => {
    window.history.back();
  };


 if (!products) return <Loader />;


  return (
    <div className="container mx-auto p-4 mb-16">
      <div className="flex items-center h-14  text-black mb-2">
        <ChevronLeft
          className="w-8 h-8 cursor-pointer"
          onClick={handleGoBack}
        />
        <h2 className="flex-1 text-2xl text-center font-semibold">
          Products list
        </h2>
      </div>

      {products.map((product) => (
        <ProductListItem
          key={product?.id}
          image={product?.images[0]}
          rating={product?.ratings}
          title={product?.name}
          description={product?.description || "Demo Description "}
          productId={product?.id}
        />
      ))}
    </div>
  );
};

export default ProductsList;
