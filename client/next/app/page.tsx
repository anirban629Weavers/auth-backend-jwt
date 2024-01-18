"use client";
import Navbar from "@/components/Navbar";
// import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { product } from "@/types";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";

export default function Home() {
  // const session = await getServerSession(options);
  // console.log(session);
  const [allProducts, setAllProducts] = useState<Array<product>>([]);
  const axiosAuth = useAxiosAuth();

  const fetchProducts = async () => {
    const response = await axiosAuth.get("/protectedpost");
    setAllProducts(response.data);
  };

  const session = useSession();
  return (
    <>
      <Navbar />
      {session.data ? (
        <>
          {session?.data?.user?.name}
          <button
            type="submit"
            className="rounded-md px-3.5 py-2 m-1 overflow-hidden relative group cursor-pointer border-2 font-medium border-indigo-600 text-indigo-600"
            onClick={async () => {
              await fetchProducts();
            }}
          >
            <span className="absolute w-64 h-0 transition-all duration-300 origin-center rotate-45 -translate-x-20 bg-indigo-600 top-1/2 group-hover:h-64 group-hover:-translate-y-32 ease"></span>
            <span className="relative text-indigo-600 transition duration-300 group-hover:text-white ease">
              Fetch Products
            </span>
          </button>
          {allProducts.length === 0 ? (
            <h1>No Product Found</h1>
          ) : (
            <>
              {allProducts.map((product, index) => (
                <div key={index}>{product.title}</div>
              ))}
            </>
          )}
        </>
      ) : (
        <>User not logged in</>
      )}
    </>
  );
}
