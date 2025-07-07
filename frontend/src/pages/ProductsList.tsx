import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {  ChevronLeft, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProductListItem = ({ image, rating, title, description, productId }) => {
  return (


<Card className="rounded-lg mb-4 bg-gray-100 h-50  p-2 border-none shadow-none">
      <CardContent className="flex items-center space-x-4 px-1 py-1 ">
        <div className="relative w-full h-42  overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover rounded-lg"
          />
          <div className="absolute bottom-2 left-2 flex items-center px-1 py-[1px] bg-gray-100/40 rounded-xs gap-1">
            <Star className="w-3 h-3 text-yellow-400 fill-current" />
            <span className="text-[10px] text-black">
              {rating}
            </span>
          </div>
        </div>
        <div className='flex flex-col space-y-7'>
          <h3 className="text-lg text-black font-semibold">{title}</h3>
          <p className="text-sm font-light text-gray-600">
            {description.length > 80 ? (
              <>
                {description.slice(0, 80)}...
               
              </>
            ) : (
              description
            )}
          </p>
          <p className="text-xs text-black/90 font-light">Product ID: {productId}</p>
        </div>
      </CardContent>
    </Card>
  );
};

const ProductsList = () => {

    const navigate=useNavigate();
  const products = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=704&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      rating: 4.5,
      title: "Coinverge Radiance",
      description: "A luxurious skincare combo with a lightweight radiance serum and nourishing cream,",
      productId: "B1001",
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      rating: 4.5,
      title: "Coinverge Radiance",
      description: "A luxurious skincare combo with a lightweight radiance serum and nourishing cream",
      productId: "B1001",
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?q=80&w=728&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      rating: 4.5,
      title: "Coinverge Radiance",
      description: "A luxurious skincare combo with a lightweight radiance serum and nourishing cream",
      productId: "B1001",
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?q=80&w=728&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      rating: 4.5,
      title: "Coinverge Radiance",
      description: "A luxurious skincare combo with a lightweight radiance serum and nourishing cream",
      productId: "B1001",
    },
  ];
   const handleGoBack = () => {
    window.history.back();
  };


  return (
    <div className="container mx-auto p-4 mb-6">


        <div className="flex items-center h-14 mb-4 text-black gap-4">
            
                <ChevronLeft
                  className="w-6 h-6 cursor-pointer"
                  onClick={handleGoBack}
                />
                <h2 className=" text-2xl text-start">
                Products list
                </h2>
              </div>
        
      {products.map((product) => (
        <ProductListItem
          key={product.id}
          image={product.image}
          rating={product.rating}
          title={product.title}
          description={product.description}
          productId={product.productId}
        />
      ))}
    </div>
  );
};

export default ProductsList;