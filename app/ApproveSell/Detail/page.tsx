"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSession } from "next-auth/react";
import { redirect, useSearchParams } from "next/navigation";
import { GoCheck } from "react-icons/go";
import { MdAccountCircle } from "react-icons/md";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Link from "next/link";
import Header from "../../component/Header";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { MdOutlineFileDownload } from "react-icons/md";

interface Project {
  _id: string;
  projectname: string;
  description: string;
  email: string;
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

// Loading Component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

// Main Content Component
const DetailContent = () => {
  const searchParams = useSearchParams();
  const [project, setProject] = useState<Project | null>(null);
  const { data: session, status } = useSession();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rejectText, setRejectText] = useState<string>("");
  const router = useRouter();

  const id = searchParams.get("_id");
  const profileImage = searchParams.get("profileImage");
  const authorName = searchParams.get("authorName");

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;

      try {
        const response = await fetch(`/api/project/id/${id}`, {
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
        const response = await fetch(`/api/project`, {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch additional project data");
        }

        const data = await response.json();
        console.log("Additional data:", data);
      } catch (error) {
        console.error("Error fetching additional project data:", error);
      }
    };

    fetchAdditionalData();
  }, []);
  useEffect(() => {
    if (!id) return;

    const updateStatusToPending = async () => {
      try {
        const response = await fetch(`/api/project/id/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "reviewing",
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to update project status");
        }
      } catch (error) {
        console.error("Error updating project status:", error);
      }
    };

    updateStatusToPending();
  }, [id]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    redirect("/auth/signin");
    return null;
  }

  const handleApprove = async () => {
    if (!id) return;

    setIsLoading(true);
    setStatusMessage(null);

    try {
      // อัปเดตสถานะของโปรเจกต์
      const response = await fetch(`/api/project/id/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ permission: true, status: "approved" }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.error || "Failed to update project permission"
        );
      }

      // บันทึกข้อความแจ้งเตือน
      const email = project?.email; // เปลี่ยนเป็นการดึง email จากผู้ส่งคำขอ หรือข้อมูลโปรเจกต์
      const notificationMessage = `Project "${project?.projectname}" has been approved.`;

      const notificationResponse = await fetch("/api/notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, notificationValue: notificationMessage }), // ส่ง email และ notificationValue
      });

      const notificationData = await notificationResponse.json();

      if (!notificationResponse.ok) {
        throw new Error(
          notificationData.error || "Failed to save notification"
        );
      }

      setStatusMessage("Project approved successfully and notification sent.");
    } catch (error) {
      console.error("Error approving project:", error);
      setStatusMessage(`Approval failed.`); // แสดงข้อความผิดพลาดที่ชัดเจน
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
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "rejected",
          rejecttext: rejectText,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to update project");
      }
      // บันทึกข้อความแจ้งเตือน
      const email = project?.email; // เปลี่ยนเป็นการดึง email จากผู้ส่งคำขอ หรือข้อมูลโปรเจกต์
      const notificationMessage = `Your project was not approved because: ${rejectText}`; // เพิ่ม rejectText ในข้อความ

      const notificationResponse = await fetch("/api/notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, notificationValue: notificationMessage }), // ส่ง email และ notificationValue
      });

      const notificationData = await notificationResponse.json();

      if (!notificationResponse.ok) {
        throw new Error(
          notificationData.error || "Failed to save notification"
        );
      }

      setStatusMessage(
        "Project has been successfully rejected and notification has been sent."
      );

      // Redirect to the ApproveSell page
      router.push("/ApproveSell");
    } catch (error) {
      console.error("Error updating project:", error);
      setStatusMessage("Failed to reject project. Please try again.");
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

  const handleDownload = async (fileName: string) => {
    if (!fileName) {
      console.error("No file name provided");
      return;
    }

    const fileUrl = `/api/project/files/${fileName}`;
    const response = await fetch(fileUrl);

    if (response.ok) {
      // ดาวน์โหลดไฟล์
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      alert("ดาวน์โหลดไฟล์สำเร็จ");
    } else {
      console.error("Failed to download file");
      alert("ดาวน์โหลดไฟล์ไม่สำเร็จ");
    }
  };

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
        <div className="flex flex-col min-h-screen">
          {/* Slider Section */}
          <div className="flex flex-col items-center p-4">
            <div className="relative w-full h-[500px] overflow-hidden rounded-lg">
              {imageUrl.length > 0 && (
               <Image
               src={`/api/project/images/${imageUrl[currentIndex]}`}
               alt="Project"
               fill
               className="object-cover"
               sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1200px"
               onError={(e) => console.error("Image failed to load:", e)}
               priority
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
                    <p className="text-xl font-bold text-[24px] text-black my-3">
                      {project.projectname}
                    </p>
                    <div className="flex items-center">
                      <p className="text-sm text-gray-600 mr-2">by</p>
                      <span className="text-gray-500  text-3xl mr-2">
                        {profileImage ? (
                          <Image
                            src={profileImage}
                            alt="Author Profile"
                            width={30}
                            height={30}
                            className="w-8 h-8 rounded-full"
                          />
                        ) : (
                          <span className="text-gray-500 text-3xl mr-2">
                            <MdAccountCircle />
                          </span>
                        )}
                      </span>
                      <p className="text-sm text-gray-600 truncate w-[150px]">
                        {authorName}
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
                </div>

                {/* File Section */}
                <div className="bg-white p-6 rounded-lg mt-10 shadow-custom">
                  <h2 className="text-lg font-bold text-[#33529B]">
                    File
                  </h2>
                  <div className="border-t border-gray-300 my-4"></div>
                  <ul className="list-none mt-2">
                    {project.filesUrl.map((fileName, index) => (
                      <li className="flex items-center mb-2 " key={index}>
                        <button
                          onClick={() => handleDownload(fileName)}
                          style={{ cursor: "pointer" }}
                          className="flex items-center space-x-2 hover:text-blue-600 text-black"
                        >
                          <MdOutlineFileDownload className="w-5 h-5 text-gray-500" />
                          <span >{fileName}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {statusMessage && (
                  <p
                    className={`mt-2 ${
                      statusMessage.includes("failed")
                        ? "text-red-500"
                        : "text-green-500"
                    }`}
                  >
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
                  className="text-black w-full p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#33529B] focus:border-transparent"
                  value={rejectText}
                  onChange={(e) => setRejectText(e.target.value)}
                ></textarea>
              </>
            ) : (
              <p>Loading project details...</p>
            )}
          </div>

          {/* Buttons Section */}
          <div className="flex justify-center mt-5 space-x-2 md:space-x-20 lg:space-x-10">
            <button
              onClick={() => handleNotApprove()}
              className={`bg-[#666666] text-white w-[180px] lg:w-[350px] md:w-[250px] py-3 rounded-lg text-sm lg:text-base ${
                !rejectText ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={!rejectText}
            >
              ไม่อนุมัติ
            </button>

            <button
              onClick={() => handleApprove()}
              className="bg-[#33529B] text-white w-[180px] lg:w-[350px] md:w-[250px] py-3 rounded-lg text-sm lg:text-base"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "อนุมัติ"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

// Main Detail Component with Suspense
const Detail: React.FC = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <DetailContent />
    </Suspense>
  );
};

export default Detail;
