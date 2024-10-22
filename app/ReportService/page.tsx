"use client";

import Header from "../component/Header";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Pagination from "../component/Pagination";

interface PostData {
  _id: number;
  report: string;
  email: string;
  username: string;
}

const ReportService: React.FC = () => {
  const [postData, setPostData] = useState<PostData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 10;

  // Filter posts based on search term
  const filteredPosts = postData.filter((post) => {
    const searchValue = searchTerm.toLowerCase();
    return (
      post.username?.toLowerCase().includes(searchValue) ||
      post.report?.toLowerCase().includes(searchValue) ||
      post.email?.toLowerCase().includes(searchValue)
    );
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPosts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);

  // Function to fetch data from API
  const getPosts = async () => {
    try {
      const response = await fetch("/api/getreportservice", {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }

      const data = await response.json();
      console.log("Fetched Data: ", data);
      if (data && data.postservice) {
        setPostData(data.postservice);
      } else {
        console.error("Data format is incorrect:", data);
      }
    } catch (error) {
      console.error("Error loading posts: ", error);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FBFBFB] overflow-hidden">
      <Header />
      <main className="flex-grow">
        <div className="lg:mx-64 lg:mt-10 lg:mb-10 mt-10 mb-10 mx-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <h2 className="text-xl font-bold text-black">
              คำร้องปัญหาของผู้ใช้
            </h2>
            <div className="relative w-full sm:w-auto">
              <input
                type="text"
                placeholder="ค้นหาผู้ส่งคำร้อง, ปัญหา หรืออีเมล..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full sm:w-64 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5D76AD] text-black"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden border border-gray-200 sm:rounded-lg shadow-sm">
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
                        ผู้ส่งคำร้อง
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-[16px] text-white uppercase tracking-wider font-semibold"
                      >
                        ปัญหา
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-[16px] text-white uppercase tracking-wider font-semibold"
                      >
                        อีเมล
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentItems.length > 0 ? (
                      currentItems.map((val, index) => (
                        <tr key={val._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {indexOfFirstItem + index + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <Link
                              href={{
                                pathname: `/ReportService/${val._id}`,
                                query: {
                                  _id: val._id,
                                  report: val.report,
                                  email: val.email,
                                  username: val.username,
                                },
                              }}
                              className="text-black"
                            >
                              {val.username || "-"}
                            </Link>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                            <Link
                              href={{
                                pathname: `/ReportService/${val._id}`,
                                query: {
                                  _id: val._id,
                                  report: val.report,
                                  email: val.email,
                                  username: val.username,
                                },
                              }}
                              className="text-black"
                            >
                              {val.report || "-"}
                            </Link>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                            <Link
                              href={{
                                pathname: `/ReportService/${val._id}`,
                                query: {
                                  _id: val._id,
                                  report: val.report,
                                  email: val.email,
                                  username: val.username,
                                },
                              }}
                              className="text-black"
                            >
                              {val.email || "-"}
                            </Link>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center"
                        >
                          ไม่มีข้อมูลคำร้อง
                        </td>
                      </tr>
                    )}
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
        </div>
      </main>
    </div>
  );
};

export default ReportService;