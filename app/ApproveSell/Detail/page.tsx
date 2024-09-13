"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect, useSearchParams } from "next/navigation";
import { GoCheck } from "react-icons/go";
import { MdAccountCircle } from "react-icons/md";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Link from "next/link";
import Header from "../../component/Header";
import { useRouter } from 'next/navigation';

interface Project {
  _id: string;
  projectname: string;
  description: string;
  price: number;
  author: string;
  receive: string[];
  permission: boolean;
  rathing: number;
  sold: number;
  review: number;
  category: string;
  filesUrl: string[];
  imageUrl: string[];
}

const Detail: React.FC = () => {
  const [project, setProject] = useState<Project | null>(null);
  const { data: session, status } = useSession();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rejectText, setRejectText] = useState<string>("");
  const searchParams = useSearchParams();
  const router = useRouter();

  const id = searchParams.get("_id");
  
  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;

      try {
        const response = await fetch(`http://localhost:3000/api/project/id/${id}`, {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch project data");
        }

        const data: Project = await response.json();
        setProject(data);
      } catch (error) {
        console.error("Error fetching project data:", error);
      }
    };

    fetchProject();
  }, [id]);

  useEffect(() => {
    const fetchAdditionalData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/project`, {
          method: "GET",
          cache: "no-store"
        });

        if (!response.ok) {
          throw new Error('Failed to fetch additional project data');
        }

        const data = await response.json();
        console.log('Additional data:', data);
      } catch (error) {
        console.error('Error fetching additional project data:', error);
      }
    };

    fetchAdditionalData();
  }, []);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    redirect("/auth/signin");
    return null;
  }
  useEffect(() => {
    if (!id) return;

    const updateStatusToPending = async () => {
      try {
        const response = await fetch(`/api/project/id/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: 'reviewing',
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to update project status');
        }
      } catch (error) {
        console.error('Error updating project status:', error);
      }
    };

    updateStatusToPending();
  }, [id]);
  const handleApprove = async () => {
    if (!id) return;

    setIsLoading(true);
    setStatusMessage(null);

    try {
      const response = await fetch(`/api/project/id/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ permission: true ,
          status: 'approved',
        }),
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

  
const handleNotApprove = async () => {
  if (!id || !rejectText) return;

  setIsLoading(true);
  setStatusMessage(null);

  try {
    const response = await fetch(`/api/project/id/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: 'rejected',
        rejecttext: rejectText,
      }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.error || 'Failed to update project');
    }

    setStatusMessage('Project has been successfully rejected and notification has been sent.');

    // Redirect to the ApproveSell page
    router.push('/ApproveSell');
  } catch (error) {
    console.error('Error updating project:', error);
    setStatusMessage('Failed to reject project. Please try again.');
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

  const imageUrl = project?.imageUrl || [];
  const filesUrl = project?.filesUrl || [];
  
  const handlePrevClick = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + imageUrl.length) % imageUrl.length
    );
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % imageUrl.length);
  };

  return (
    <main className="flex flex-col min-h-screen bg-[#FBFBFB]">
      <Header />
      <div className="lg:mx-64 lg:mt-20 lg:mb-20 mt-10 mb-10">
        <div className="flex flex-col min-h-screen ">
          {/* Slider Section */}
          <div className="flex flex-col items-center p-4">
            <div className="relative w-full h-auto overflow-hidden rounded-lg">
              {imageUrl.length > 0 && (
                <img
                src={`/api/project/image/${imageUrl[currentIndex]}`}
                  className="w-full h-auto object-cover rounded-lg"
                  onError={(e) => console.error('Image failed to load:', e)}
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
            {project ? (
              <>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xl font-bold text-[24px]">
                      {project.projectname}
                    </p>
                    <div className="flex items-center">
                      <p className="text-sm text-gray-600 mr-2">by</p>
                      <span className="text-gray-500 mr-2 text-2xl">
                        <MdAccountCircle />
                      </span>
                      <p className="text-sm text-gray-600 truncate w-[150px]">
                        {project.author}
                      </p>
                    </div>
                    <p className="text-lg font-bold mt-3 text-[#33529B]">
                      {project.price} THB
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
                    {project.description}
                  </p>
                </div>

                {/* Receive Section */}
                <div className="bg-white p-6 rounded-lg mt-5 shadow-custom">
                  <h2 className="text-lg font-bold text-[#33529B]">Receive</h2>
                  <div className="border-t border-gray-300 my-4"></div>
                  <ul className="list-none text-sm text-gray-600 mt-2">
                    {project?.receive && project.receive.length > 0 ? (
                      project.receive.map((item, index) => (
                        <li key={index} className="flex items-center">
                          <GoCheck className="w-5 h-5 text-green-500 mr-2" />
                          {item}
                        </li>
                      ))
                    ) : (
                      <li className="text-gray-500">No items to display</li>
                    )}
                  </ul>
                  <div className="flex justify-center mt-11">
                    <a
                      href={filesUrl[0] || "#"}
                      className="bg-[#33529B] text-white w-[180px] lg:w-[350px] md:w-[250px] py-3 rounded-lg text-sm lg:text-base flex items-center justify-center"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      ดูไฟล์
                    </a>
                  </div>
                </div>

                {/* Buttons Section */}
                <div className="flex justify-center mt-5 space-x-2 md:space-x-20 lg:space-x-10">
                  <button
                    onClick={() => handleNotApprove()}
                    className={`bg-[#666666] text-white w-[180px] lg:w-[350px] md:w-[250px] py-3 rounded-lg text-sm lg:text-base ${!rejectText ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={!rejectText}
                  >
                    ไม่อนุมัติ
                  </button>
                  
                  <button
                    onClick={() => handleApprove()}
                    className="bg-[#33529B] text-white w-[180px] lg:w-[350px] md:w-[250px] py-3 rounded-lg text-sm lg:text-base"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Processing...' : 'อนุมัติ'}
                  </button>
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
                  value={rejectText}
                  onChange={(e) => setRejectText(e.target.value)}
                ></textarea>
              </>
            ) : (
              <p>Loading project details...</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Detail;
