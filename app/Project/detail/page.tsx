"use client";

import React, { useState, useEffect } from "react";
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
import { Switch } from "@headlessui/react";
import Swal from "sweetalert2";

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

const Detail: React.FC = () => {
  const [project, setProject] = useState<Project | null>(null);
  const { data: session, status } = useSession();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rejectText, setRejectText] = useState<string>("");
  const [enabled, setEnabled] = useState(true);
  const searchParams = useSearchParams();
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
        setEnabled(data.permission);
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
  const handleSwitchChange = async (checked: boolean) => {
    if (!checked) {
      const result = await Swal.fire({
        title: "ยืนยันการซ่อนโครงงาน",
        text: "ถ้าคุณกดซ่อน โครงงานนี้จะไปอยู่ที่หน้าอนุมัติการขาย คุณต้องการซ่อนโครงงานหรือไม่?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "ใช่, ซ่อนโครงงาน",
        cancelButtonText: "ยกเลิก",
      });

      if (result.isConfirmed) {
        setEnabled(false);
        await updateProjectPermission(false);
      }
    } else {
      setEnabled(true);
      await updateProjectPermission(true);
    }
  };
  const updateProjectPermission = async (newPermission: boolean) => {
    if (!id) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/project/id/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ permission: newPermission }),
      });

      if (!response.ok) {
        throw new Error("Failed to update project permission");
      }

      const updatedProject = await response.json();
      setProject(updatedProject);
      setStatusMessage(
        `Project ${newPermission ? "shown" : "hidden"} successfully`
      );
      if (!newPermission) {
        // Redirect to ApproveSell page after hiding the project
        router.push("/Project");
      }
    } catch (error) {
      console.error("Error updating project permission:", error);
      setStatusMessage("Failed to update project visibility");
    } finally {
      setIsLoading(false);
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
          <div className="flex flex-col items-center">
            <div className="relative w-full h-[500px] overflow-hidden rounded-lg">
              {imageUrl.length > 0 && (
                <img
                  src={`/api/project/images/${imageUrl[currentIndex]}`}
                  className="w-full h-full object-cover"
                  onError={(e) => console.error("Image failed to load:", e)}
                  alt="Project"
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
                    <Switch
                      checked={enabled}
                      onChange={handleSwitchChange}
                      className={`${
                        enabled ? "bg-blue-600" : "bg-gray-200"
                      } relative inline-flex items-center h-8 rounded-full w-20 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 my-3`}
                    >
                      <span className="sr-only">Toggle visibility</span>
                      <span
                        className={`${
                          enabled ? "translate-x-12" : "translate-x-1"
                        } inline-block w-6 h-6 transform bg-white rounded-full transition-transform`}
                      />
                      <span
                        className={`${
                          enabled ? "left-2" : "right-2"
                        } absolute text-xs font-medium ${
                          enabled ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {enabled ? "แสดง" : "ซ่อน"}
                      </span>
                    </Switch>
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
                {project.filesUrl && project.filesUrl.length > 0 && (
                  <div className="bg-white p-6 rounded-lg mt-10 shadow-custom">
                    <h2 className="text-lg font-bold text-[#33529B]">File</h2>
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
                            <span>{fileName}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

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
