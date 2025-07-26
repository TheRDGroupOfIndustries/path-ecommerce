import { API_URL } from "@/lib/api.env";
import axios from "axios";
import { LucideSearch } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import SearchLoader from "../Loader/SearchLoader";
import CardComponent from "../CardComponent/CardComponent";
import ProductCard from "../ProductCard/ProductCard";

function SearchPage() {
  const [loading, setLoading] = useState(false);
  const [isSearched, setSearched] = useState(false);
  const [serveCard, setServeCard] = useState(false);
  const [data, setData] = useState([]);
  const [input, setInput] = useState("");
  const [dynamicUrl, setDynamicUrl] = useState("");
  const params = useParams();
  const type = params.type;
   const inputRef = useRef(null);

  useEffect(() => {
    switch (type) {
      case "products":
        setDynamicUrl(`${API_URL}/api/product/search`);
        break;
      case "Houses & Plots":
        setDynamicUrl(`${API_URL}/api/property/search`);
        setServeCard(true);
        break;
      case "services":
        setDynamicUrl(`${API_URL}/api/marketplace/search`);
        setServeCard(true);
        break;
      default:
        break;
    }
  }, [type]);
   useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  const handleChange = async () => {
    try {
      setLoading(true);
      const req = await axios.get(`${dynamicUrl}/${input}`);
      if (req.status === 201) {
        setData(req.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setSearched(true);
    }
  };

  // useEffect(() => {
  //   setTimeout(() => {
  //     handleChange();
  //   }, 3000);
  // }, [input]);

  if (loading) {
    return <SearchLoader />;
  }
  return (
    <div className="container mx-auto w-screen min-h-screen h-auto px-2 mb-20 sm:p-4">
      <div className="w-full h-20 py-4 flex justify-between items-center gap-2">
        <input
         ref={inputRef}
          type="text"
          className="w-5/6 py-4 px-4 rounded-xl outline-none border-none text-sm bg-gray-200"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Search for ${type}...`}
        />
        <button
          onClick={() => handleChange()}
          className="primary-bg rounded-full grid place-items-center p-4"
        >
          <LucideSearch size={22} color="white" />
        </button>
      </div>

      {data.length > 0 ? (
        <div
          className=" grid grid-cols-2
          sm:grid-cols-2
          md:grid-cols-3
          lg:grid-cols-4
          gap-4
          mt-2"
        >
          {data.map((items, i) =>
            serveCard ? (
              <CardComponent
                key={i}
                service={{
                  id: items.id,
                  title: items.name,
                  image: items.imageUrl?.[0],
                  category: items.category,
                  description: items.description,
                }}
                btnText={"View"}
                type={"marketplace"}
              />
            ) : (
              <ProductCard
                key={items.id}
                id={items.id}
                ratings={items.ratings}
                title={items.name}
                description={items.description}
                price={items.price}
                discount={items.discount}
                images={items.images}
              />
            )
          )}
        </div>
      ) : (
        isSearched && (
          <div className="h-96 grid place-items-center">
            <p className="text-center text-sm">
              OOPS! <br />
              Nothing found, Please Try with different keywords...
            </p>
          </div>
        )
      )}
    </div>
  );
}

export default SearchPage;
