"use client";

import Header from "../component/Header";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Pagination from "../component/Pagination";
import Swal from "sweetalert2";

interface Project {
  id: string;
  name: string;
  firstname: string;
  lastname: string;
  email: string;
  phonenumber: string;
  username: string;
  facebook: string;
  line: string;
  imageUrl: string;
}

const Usernormal: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 10;

  // Filter projects based on search term
  const filteredProjects = projects.filter((project) => {
    const searchValue = searchTerm.toLowerCase();
    return (
      project.username?.toLowerCase().includes(searchValue) ||
      project.name?.toLowerCase().includes(searchValue) ||
      project.email?.toLowerCase().includes(searchValue) ||
      project.phonenumber?.toLowerCase().includes(searchValue)
    );
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProjects.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const [emailContent, setEmailContent] = useState("");
  const [isSending, setIsSending] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      adjustHeight();
    }
  }, [emailContent]);

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEmailContent(e.target.value);
    adjustHeight();
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const sendEmail = async () => {
    if (projects.length === 0) {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ไม่พบรายชื่อผู้ใช้",
      });
      return;
    }

    setIsSending(true);

    try {
      const emails = projects.map((project) => project.email);
      const response = await fetch("/api/sendemailall", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emails: emails,
          subject: "Digitech Space",
          emailContent: emailContent,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        Swal.fire({
          icon: "success",
          title: "สำเร็จ",
          text: result.message,
        });
        setEmailContent("");
      } else {
        const errorData = await response.json();
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: `เกิดข้อผิดพลาดในการส่งอีเมล: ${errorData.message}`,
        });
      }
    } catch (error) {
      console.error("Error sending email:", error);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "เกิดข้อผิดพลาดในการส่งอีเมล",
      });
    } finally {
      setIsSending(false);
    }
  };

  const getPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/normoluser", {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }

      const data = await response.json();
      console.log("Fetched Data:", data);

      if (data && Array.isArray(data.normalusers)) {
        const formattedProjects = data.normalusers.map((user: any) => ({
          id: user._id,
          name: user.name,
          phonenumber: user.phonenumber,
          username: user.username,
          email: user.email,
          facebook: user.facebook,
          line: user.line,
          imageUrl: user.imageUrl,
        }));
        setProjects(formattedProjects);
      } else {
        console.error("Data format is incorrect:", data);
        setError("Data format is incorrect");
      }
    } catch (error) {
      console.error("Error loading projects:", error);
      setError("Error loading projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FBFBFB] overflow-hidden">
      <Header />
      <main className="flex-grow">
        <div className="lg:mx-64 lg:mt-10 lg:mb-10 mt-10 mb-10 mx-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-black">
              รายชื่อของผู้ใช้ธรรมดา
            </h2>
            <div className="relative">
              <input
                type="text"
                placeholder="ค้นหาผู้ใช้..."
                value={searchTerm}
                onChange={handleSearch}
                className="text-black w-64 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5D76AD]"
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5 rounded-lg shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-[#0B1E48]">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-[16px] text-white uppercase tracking-wider font-semibold"
                      >
                        #
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-[16px] text-white uppercase tracking-wider font-semibold"
                      >
                        ชื่อบัญชี
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-[16px] text-white uppercase tracking-wider font-semibold"
                      >
                        ชื่อ - นามสกุล
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-[16px] text-white uppercase tracking-wider font-semibold"
                      >
                        อีเมล
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-[16px] text-white uppercase tracking-wider font-semibold"
                      >
                        เบอร์โทรศัพท์
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentItems.map((project, index) => (
                      <tr key={project.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {index + 1 + indexOfFirstItem}.
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                          <Link
                            href={{
                              pathname: `/normal/detail`,
                              query: {
                                id: project.id,
                                username: project.username,
                                name: project.name,
                                phonenumber: project.phonenumber,
                                firstname: project.firstname,
                                lastname: project.lastname,
                                email: project.email,
                                facebook: project.facebook,
                                line: project.line,
                                imageUrl: project.imageUrl,
                              },
                            }}
                          >
                            {project.username || "-"}
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                          <Link
                            href={{
                              pathname: `/normal/detail`,
                              query: {
                                id: project.id,
                                username: project.username,
                                name: project.name,
                                phonenumber: project.phonenumber,
                                firstname: project.firstname,
                                lastname: project.lastname,
                                email: project.email,
                                facebook: project.facebook,
                                line: project.line,
                                imageUrl: project.imageUrl,
                              },
                            }}
                          >
                            {project.name || "-"}
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                          <Link
                            href={{
                              pathname: `/normal/detail`,
                              query: {
                                id: project.id,
                                username: project.username,
                                name: project.name,
                                phonenumber: project.phonenumber,
                                firstname: project.firstname,
                                lastname: project.lastname,
                                email: project.email,
                                facebook: project.facebook,
                                line: project.line,
                                imageUrl: project.imageUrl,
                              },
                            }}
                          >
                            {project.email || "-"}
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                          <Link
                            href={{
                              pathname: `/normal/detail`,
                              query: {
                                id: project.id,
                                username: project.username,
                                name: project.name,
                                phonenumber: project.phonenumber,
                                firstname: project.firstname,
                                lastname: project.lastname,
                                email: project.email,
                                facebook: project.facebook,
                                line: project.line,
                                imageUrl: project.imageUrl,
                              },
                            }}
                          >
                            {project.phonenumber || "-"}
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <p className="text-sm mt-2 text-black">
            *หากอยากดูข้อมูลเพิ่มเติมให้คลิกที่ตารางคนนั้น
          </p>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />

          <div className="mt-6 w-auto lg:w-auto h-auto p-4 flex-shrink-0 rounded-2xl border border-[#D0D8E9] bg-white shadow-[0px_0px_60.1px_-16px_#D9DDE5]">
            <div className="w-full mt-3">
              <p className="text-[#6C7996A6] text-[16px] mb-3 font-semibold">
                ส่งอีเมลหาผู้ใช้ทั้งหมด
              </p>
              <textarea
                ref={textareaRef}
                className="w-full min-h-[50px] px-4 py-2 flex items-center rounded-[9px] border border-[rgba(208,216,233,0.41)] bg-[#F5F5F6] text-[#5D76AD] focus:outline-none focus:ring-2 focus:ring-[#5D76AD] resize-none overflow-hidden"
                placeholder="ข้อความอีเมล"
                value={emailContent}
                onChange={handleChange}
              />
              <button
                className="mt-5 w-full lg:w-full py-3 flex-shrink-0 rounded-[10px] bg-[#5D76AD] text-white font-semibold flex items-center justify-center hover:bg-[#4A5F8C] transition-colors duration-300"
                onClick={sendEmail}
                disabled={isSending}
              >
                {isSending ? "กำลังส่ง..." : "ส่งอีเมล"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Usernormal;