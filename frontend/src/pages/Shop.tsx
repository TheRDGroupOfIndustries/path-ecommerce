import React, { useEffect, useState } from "react";
import ProfileHeader from "@/components/ProfileHeader/ProfileHeader";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import ProductCard from "@/components/ProductCard/ProductCard";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL } from "@/lib/api.env";

const Shop = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("For You");
  const [activeIndex, setActiveIndex] = useState(0);
  const [products, setProducts] = useState([]);
  const [tabs, setTabs] = useState(["For You"]);
  const [trendy, setTrendy] = useState([]);
  useEffect(() => {
    const fetchTrendy = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/api/product/get-trendy`
        );
        setTrendy(res.data);
        // console.log("trendy: ",res.data);
      } catch (err) {
        console.error("Failed to fetch Trendy Product", err);
      }
    };
    fetchTrendy();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/api/product/get-all`
        );
        // console.log("res: ", res.data);
        setProducts(res.data);
        const categories = [...new Set(res.data.map((p) => p.category))];
        // console.log("cat: ",categories);

        setTabs(["For You", ...categories]);
      } catch (err) {
        console.error("Failed to fetch products", err);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts =
    activeFilter === "For You"
      ? products
      : products.filter((p) => p.category === activeFilter);

  return (
    <div className="container mx-auto p-4">
      <ProfileHeader type="products" />

      {trendy.length > 0 && (
        <Carousel
          className="w-full max-w-2xl overflow-visible mt-10"
          opts={{ loop: false }}
          setApi={(api) => {
            api.on("select", () => setActiveIndex(api.selectedScrollSnap()));
          }}
        >
          <CarouselContent className="-ml-4">
            {trendy.slice(0, 6).map((offer, index) => (
              <CarouselItem
                key={offer?.id}
                className="pl-4 basis-[75%]"
                onClick={() => navigate(`/product-detail/${offer?.id}`)}
              >
                <div
                  className="relative h-54 rounded-lg shadow-lg bg-cover bg-center flex items-center"
                  style={{ backgroundImage: `url(${offer?.images?.[0] || "https://placehold.co/600x400"})` }}
                >
                  <div className="absolute inset-0 bg-black/30 rounded-lg" />
                  <div className="relative z-10 flex flex-col justify-center h-full w-full px-4 ">
                    <div className="flex flex-col flex-1 justify-end h-1/4 gap-1">
                      <p className="text-sm text-white font-semibold">
                        {offer?.discount} % OFF
                      </p>
                      <h3 className="text-2xl font-semibold text-white">
                        {offer?.name}
                      </h3>
                      <p className="text-[10px] mb-2 text-white font-light">
                        {offer?.description.length > 110
                          ? offer?.description.slice(0, 115) + "..."
                          : offer?.description}
                      </p>
                    </div>
                    <div className="flex justify-end">
                      <Button className="bg-transparent underline underline-offset-3 tracking-widest text-xs font-light text-white">
                        Buy Now
                      </Button>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      )}

      <div className="flex justify-center mt-3 gap-1">
        {trendy.slice(0, 6).map((_, index) => (
          <div
            key={index}
            className={`h-1 rounded-full transition-all duration-300 w-8  ${
              activeIndex === index
                ? "bg-blue-900 shadow-md shadow-blue-900/50"
                : "bg-gray-300"
            }`}
          />
        ))}
      </div>

      <div className="mt-7 mb-20">
        <div
          className="flex space-x-2 mb-4 overflow-x-auto text-sm max-w-2xl whitespace-nowrap"
          style={{ scrollbarWidth: "none" }}
        >
          {tabs.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`rounded-2xl px-6 py-2 border-2 transition-colors duration-200
                ${
                  activeFilter === filter
                    ? "bg-blue-900 text-white border-blue-900 shadow"
                    : "bg-transparent border-gray-300 text-gray-600 hover:bg-blue-50"
                }
              `}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {filteredProducts.map((product) => (
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
