"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { redirect, useSearchParams } from "next/navigation";
import { GoCheck } from "react-icons/go";
import { MdAccountCircle } from "react-icons/md";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Link from "next/link";
import Header from "../../component/Header";

interface Project {
  imageUrl: string[];
}

const Detail: React.FC = () => {
  const { data: session, status } = useSession();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const searchParams = useSearchParams();
  
  const id = searchParams.get("id");
  const author = searchParams.get("author");
  const projectname = searchParams.get("projectname");
  const price = searchParams.get("price");
  const description = searchParams.get("description");
  const filesUrlStr = searchParams.get("filesUrl");
  const imageUrlStr = searchParams.get("imageUrl");
  const receive = searchParams.get("receive")?.split(",") || [];
  const permission = searchParams.get("permission");
  const rathing = searchParams.get("rathing");
  const sold = searchParams.get("sold");
  const review = searchParams.get("review");
  const category = searchParams.get("category");

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    redirect("/auth/signin");
    return null;
  }

  const handleApprove = async (projectId: string) => {
    if (!projectId) return;
  
    setIsLoading(true);
    setStatusMessage(null);
  
    try {
      const response = await fetch(`/api/project/${projectId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ permission: true }),
      });
  
      const responseData = await response.json();
  
      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to update project permission');
      }
  
      setStatusMessage('Project approved successfully.');
    } catch (error) {
      console.error('Error approving project:', error);
      setStatusMessage('Approval failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotApprove = async (projectId: string) => {
    if (!projectId) return;

    setIsLoading(true);
    setStatusMessage(null);

    try {
      const response = await fetch(`/api/notify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: author,
          message: `Your project "${projectname}" was not approved.`,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send notification');
      }

      setStatusMessage('Notification sent successfully.');
    } catch (error) {
      console.error('Error sending notification:', error);
      setStatusMessage('Failed to send notification. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const parseJson = (str: string | null) => {
    try {
      return JSON.parse(str || "[]");
    } catch {
      console.error("Failed to parse JSON:", str);
      return [];
    }
  };

  const filesUrl = parseJson(filesUrlStr);
  const imageUrl = parseJson(imageUrlStr);
  const handleNextClick = () => {
    if (imageUrl.length > 0) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % imageUrl.length);
    }
  };

  const handlePrevClick = () => {
    if (imageUrl.length > 0) {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + imageUrl.length) % imageUrl.length);
    }
  };

  return (
    <main className="flex flex-col min-h-screen bg-[#FBFBFB]">
      <Header />
      <div className="lg:mx-60 lg:mt-20 lg:mb-20 mt-10 mb-10">
        <div className="flex flex-col min-h-screen">
          {/* Slider Section */}
          <div className="flex flex-col items-center p-4">
            <div className="relative w-full h-auto overflow-hidden rounded-lg">
            {imageUrl.length > 0 && (
                <img
                  src={imageUrl[currentIndex]} // Display the current image
                  alt={projectname || "Project Image"}
                  className="w-full h-auto object-cover rounded-lg"
                />
              )}
              <button
                onClick={handlePrevClick}
                className="absolute left-10 top-1/2 transform -translate-y-1/2 text-gray-500 p-2 rounded-full text-4xl bg-gray-100"
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
                <p className="text-xl font-bold text-[24px]">
                  {projectname || ""}
                </p>
                <div className="flex items-center">
                  <p className="text-sm text-gray-600 mr-2">by</p>
                  <span className="text-gray-500 mr-2 text-2xl">
                    <MdAccountCircle />
                  </span>
                  <p className="text-sm text-gray-600 truncate w-[150px]">
                    {author || ""}
                  </p>
                </div>
                <p className="text-lg font-bold mt-3 text-[#33529B]">
                  {price || ""} THB
                </p>
              </div>
            </div>

            {/* Description Section */}
            <div className="bg-white p-6 rounded-lg mt-10 shadow-custom">
              <h2 className="text-lg font-bold text-[#33529B]">
                Description
              </h2>
              <div className="border-t border-gray-300 my-4"></div>
              <p className="text-sm text-gray-600 mt-2">
                {description || ""}
              </p>
            </div>

            {/* Receive Section */}
            <div className="bg-white p-6 rounded-lg mt-10 shadow-custom">
              <h2 className="text-lg font-bold text-[#33529B]">Receive</h2>
              <div className="border-t border-gray-300 my-4"></div>
              <ul className="list-none text-sm text-gray-600 mt-2">
                {receive.map((item, index) => (
                  <li key={index} className="flex items-center">
                    <GoCheck className="w-5 h-5 text-green-500 mr-2" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="flex justify-center mt-11">
                <a
                  href={filesUrl[0] || "#"} // Assuming filesUrl is an array and you want to link to the first file
                  download
                  className="bg-[#33529B] text-white px-20 py-2 rounded-lg"
                >
                  Download
                </a>
              </div>
              <div className="flex justify-center mt-5 space-x-2 md:space-x-20 lg:space-x-10">
                <Link href="/ApproveSell">
                  <button
                    onClick={() => handleNotApprove(id || "")} // Pass the project ID to the function
                    className="bg-[#666666] text-white w-[180px] lg:w-[350px] md:w-[250px] py-3 rounded-lg text-sm lg:text-base"
                  >
                    ไม่อนุมัติ
                  </button>
                </Link>
                
                <button
                  onClick={() => handleApprove(id || "")} // Pass the project ID to the function
                  className="bg-[#33529B] text-white w-[180px] lg:w-[350px] md:w-[250px] py-3 rounded-lg text-sm lg:text-base"
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : 'อนุมัติ'}
                </button>
              </div>
            </div>

            {statusMessage && (
              <p className={`mt-2 ${statusMessage.includes('failed') ? 'text-red-500' : 'text-green-500'}`}>
                {statusMessage}
              </p>
            )}

            <h4 className="bg-white text-[#FF2020] p-4 mt-10 rounded-lg">
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
    </main>
  );
};

export default Detail;
