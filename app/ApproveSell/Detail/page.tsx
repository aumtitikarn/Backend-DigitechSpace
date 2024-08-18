"use client";

import React, { useState } from "react";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { GoCheck, GoShare, GoHeartFill } from "react-icons/go";
import { IoIosStar } from "react-icons/io";
import { MdAccountCircle } from "react-icons/md";
import { FaChevronLeft } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa";
import { GoHeart } from "react-icons/go";
import Link from "next/link";
import Header from "../../component/Header";

const Detail = () => {
  const { data: session, status } = useSession();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    redirect("/auth/signin");
    return null;
  }

  const images = ["/pexample1.png", "/pexample3.png", "/pexample4.png"];

  const handlePrevClick = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };
  const handleFavoriteClick = () => {
    setIsFavorited((prev) => !prev);  // เปลี่ยนสถานะเมื่อคลิก
  };

  

  return (
    <main className="flex flex-col min-h-screen bg-[#FBFBFB] ">
      <Header />
      <div className="lg:mx-60 lg:mt-20 lg:mb-20 mt-10 mb-10 ">
        <div className="flex flex-col min-h-screen">
          {/* Slider Section */}
          <div className="flex flex-col items-center p-4">
            <div className="w-full">
              <div className="relative w-full h-auto overflow-hidden rounded-lg">
                <img
                  src={images[currentIndex]}
                  alt="Project Image"
                  className="w-full h-[500px] object-cover"
                />
                {/* Slider Controls */}
                <button
                  onClick={handlePrevClick}
                  className="absolute left-10 top-1/2 transform -translate-y-1/2  text-gray-500 p-2 rounded-full text-4xl bg-gray-100"
                >
                  <FaChevronLeft />
                </button>
                <button
                  onClick={handleNextClick}
                  className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-500 p-2 rounded-full text-4xl bg-gray-100"
                >
                  <FaChevronRight />
                </button>
              </div>
            </div>

            {/* Information Section */}
            <div className="w-full mt-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xl font-bold text-[24px]">Facebook Website</p>
                  <div className="flex items-center">
                    <p className="text-sm text-gray-600 mr-2">by</p>
                    <span className="text-gray-500 mr-2 text-2xl">
                      <MdAccountCircle />
                    </span>
                    <p className="text-sm text-gray-600 truncate w-[150px]">
                      Titikarn Waitayasuwan
                    </p>
                  </div>
                  <p className="text-lg font-bold mt-3 text-[#33529B]">
                    45,000 THB
                  </p>
                  <div className="flex items-center">
                    <span className="text-yellow-500 mr-2">
                      <IoIosStar />
                    </span>
                    <span className="text-sm text-gray-600">
                      4.8 (28) | Sold 28
                    </span>
                  </div>
                </div>
                
              </div>

              {/* Description Section */}
              <div className="bg-white p-6 rounded-lg mt-10 shadow-custom">
                <h2 className="text-lg font-bold text-[#33529B]">
                  Description
                </h2>
                <div className="border-t border-gray-300 my-4"></div>
                <p className="text-sm text-gray-600 mt-2">
                  This is just a dummy text that has been inserted as a
                  placeholder for future content. While it may seem
                  insignificant at first glance, the use of dummy text is a
                  common practice in the design and publishing industry, as it
                  allows designers and developers to visualize the layout and
                  overall aesthetic of a project without being distracted by the
                  actual content.
                </p>
              </div>

              {/* Receive Section */}
              <div className="bg-white p-6 rounded-lg mt-10 shadow-custom">
                <h2 className="text-lg font-bold text-[#33529B]">Receive</h2>
                <div className="border-t border-gray-300 my-4"></div>
                <ul className="list-none text-sm text-gray-600 mt-2">
                  <li className="flex items-center">
                    <GoCheck className="w-5 h-5 text-green-500 mr-2" />
                    รายการ
                  </li>
                  <li className="flex items-center">
                    <GoCheck className="w-5 h-5 text-green-500 mr-2" />
                    ชุดข้อความ
                  </li>
                  <li className="flex items-center">
                    <GoCheck className="w-5 h-5 text-green-500 mr-2" />
                    ข้อมูล
                  </li>
                  
                </ul>
                <div className="flex justify-center mt-11">
  <Link href="/">
    <button className="bg-[#33529B] text-white px-20 py-2 rounded-lg">
      Download
    </button>
  </Link>
</div>

<div className="flex justify-center mt-5 space-x-2 md:space-x-20 lg:space-x-10">
  <Link href="/">
    <button className="bg-[#666666] text-white w-[180px] lg:w-[350px] md:w-[250px] py-3 rounded-lg text-sm lg:text-base">
      ไม่อนุมัติ
    </button>
  </Link>
  <Link href="/">
    <button className="bg-[#33529B] text-white w-[180px] lg:w-[350px]  md:w-[250px] py-3 rounded-lg text-sm lg:text-base">
      อนุมัติ
    </button>
  </Link>
</div>
</div>

              <h4 className="bg-white text-[#FF2020] p-4 mt-10 rounded-lg ">
              *ใส่หมายเหตุ หากไม่อนุมัติ
              </h4>
      <textarea
        id="comment"
        rows={4}
        placeholder="Type your comment here..."
        className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#33529B] focus:border-transparent"
      ></textarea>
    
              </div>
              </div>       
              </div>  
              </div>     
    </main>
  );
};

export default Detail;
