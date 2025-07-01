import React, { useEffect, useState } from "react";
import ProfileHeader from "@/components/ProfileHeader/ProfileHeader";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import ProductCard from "@/components/ProductCard/ProductCard"

import axios from "axios";


// const offers = [
//     {
//       id: 1,
//       discount: "25% Discount",
//       title: "Nike Sports Shoes",
//       description:
//         "Lorem ipsum dolor sit amet consectetur. Sit diam neque id nisi fermentum eget in sagittis ac. ",
//       image:
//         "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//       buttonText: "BUY NOW",
//     },
//     {
//       id: 2,
//       discount: "10% Discount",
//       title: "Samsun",
//       description:
//         "Lorem ipsum dolor sit amet consectetur. Sit diam neque id nisi fermentum eget in sagittis ac.",
//       image:
//         "https://images.unsplash.com/photo-1549482199-bc1ca6f58502?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//       buttonText: "BUY NOW",
//     },
//     {
//       id: 3,
//       discount: "20% Discount",
//       title: "Nothing",
//       description:
//         "Lorem ipsum dolor sit amet consecteturLorem ipsum dolor sit amet consecteturLorem ipsum dolor sit amet consecteturLorem ipsum dolor sit amet consectetur. Sit diam neque id nisi fermentum eget in sagittis ac.",
//       image:
//         "https://images.unsplash.com/photo-1721059537509-a0eeaa242bf6?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//       buttonText: "BUY NOW",
//     },
//   ];

const FILTERS = [
  { label: "For You", value: "all" },
  { label: "Appliances", value: "appliances" },
  { label: "Furniture", value: "furniture" },
  { label: "Speaker", value: "speaker" },
];


  // const products = [
  //   {
  //     id: 1,
  //     rating: 3.4,
  //     title: "Title for the Product",
  //     description: "Lorem ipsum dolor sit amet consecteturdolor sit amet consecteturdolor sit amet consecteturdolor sit amet consecteturdolor sit amet consecteturdolor sit amet consectetur. Tellus faucibus. sit amet consectetur. Tellus asdfasd",
  //     price: 250,
  //     originalPrice: 500,
  //     discount: "50% OFF",
  //     image: "https://images.unsplash.com/photo-1556228852-80b6e5eeff06?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  //   },
  //   {
  //     id: 2,
  //     rating: 3.4,
  //     title: "Title for the Product",
  //     description: "Lorem ipsum dolor sit amet consectetur. Tellus faucibus.",
  //     price: 250,
  //     originalPrice: 500,
  //     discount: "50% OFF",
  //     image: "https://images.unsplash.com/photo-1686831889383-290d9bab10e6?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  //   },
  //   {
  //     id: 3,
  //     rating: 3.4,
  //     title: "Title for the Product",
  //     description: "Lorem ipsum dolor sit amet consectetur. Tellus faucibus.",
  //     price: 250,
  //     originalPrice: 500,
  //     discount: "50% OFF",
  //     image: "https://images.unsplash.com/photo-1687662008657-b94277bfb30e?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  //   },
  //   {
  //     id: 4,
  //     rating: 3.4,
  //     title: "Title for the Product",
  //     description: "Lorem ipsum dolor sit amet consectetur. Tellus faucibus.",
  //     price: 250,
  //     originalPrice: 500,
  //     discount: "50% OFF",
  //     image: "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  //   },
  // ];

  
const Shop = () => {

  

   const [activeFilter, setActiveFilter] = useState("all");
 const [activeIndex, setActiveIndex] = useState(0); 
  const [products, setProducts] = useState([]);
  const [offers,setOffers]=useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/product/get-all");
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to fetch products", err);
      }
    };
    fetchProducts();
  }, []);

  

  
  const filteredProducts =
    activeFilter === "all"
      ? products
      : products.filter((p) => p.category === activeFilter);
  return (
    <div className="container mx-auto p-4">
      <ProfileHeader />
     

      <Carousel
        className="w-full max-w-2xl overflow-visible mt-10"
       opts={{ loop: false }}
    setApi={(api) => {
    api.on("select", () => setActiveIndex(api.selectedScrollSnap()));
  }} 
      >
        <CarouselContent className="-ml-4">
          {offers.map((offer, index) => (
            <CarouselItem key={offer.id} className="pl-4 basis-[75%]">
              <div
                className="relative h-54 rounded-lg shadow-lg bg-cover bg-center flex items-center"
                style={{ backgroundImage: `url(${offer.image})` }}
              >
                <div className="absolute inset-0 bg-black/30 rounded-lg" />
                <div className="relative z-10 flex flex-col justify-center h-full w-full px-4 ">
                  <div className="flex flex-col flex-1 justify-end h-1/4 gap-1">
                    <p className="text-sm text-white font-semibold">{offer.discount}</p>
                    <h3 className="text-2xl font-semibold text-white">{offer.title}</h3>
                    <p className="text-[10px] mb-2 text-white font-light">
                      {offer.description.length > 110
                        ? offer.description.slice(0, 115) + "..."
                        : offer.description}
                    </p>
                  </div>
                  <div className="flex justify-end">
                    <Button className="bg-transparent underline underline-offset-3 tracking-widest text-xs font-light text-white">
                      {offer.buttonText}
                    </Button>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

    
      <div className="flex justify-center mt-3 gap-1">
        {offers.map((_, index) => (
          <div
            key={index}
            className={`h-1 rounded-full transition-all duration-300 w-8  ${
              activeIndex === index ? "bg-blue-900 shadow-md shadow-blue-900/50" : "bg-gray-300"
            }`}
          />
        ))}
      </div>

     
      <div className="mt-7 mb-20">
       <div className="flex space-x-2 mb-4 overflow-x-auto text-sm max-w-2xl whitespace-nowrap" style={{scrollbarWidth: 'none'}}>
          {FILTERS.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setActiveFilter(filter.value)}
              className={`rounded-2xl px-6 py-2 border-2 transition-colors duration-200
                ${
                  activeFilter === filter.value
                    ? "bg-blue-900 text-white border-blue-900 shadow"
                    : "bg-transparent border-gray-300 text-gray-600 hover:bg-blue-50"
                }
              `}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {products.map((product) => (
         
             <ProductCard
              key={product.id}
              id={product.id}
              ratings={product.ratings}
              title={product.name}
              description={product.description}
              price={product.price}
              discount={product.discount}
              images={product.images}
            />
           
          ))}
        </div>
      </div>
    </div>
  );
};

export default Shop;
