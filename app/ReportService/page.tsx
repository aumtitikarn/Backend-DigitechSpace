"use client";

import Header from "../component/Header";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Pagination from '../component/Pagination';

interface PostData {
  _id: number; // Make sure this matches the type returned by the API
  report: string;
  email: string;
  username:string;
  // Add other properties as needed
}

const ReportService: React.FC = () => {
  const [postData, setPostData] = useState<PostData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = postData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(postData.length / itemsPerPage);

  // Function to fetch data from API
  const getPosts = async () => {
    try {
      const response = await fetch("/api/getreportservice", {
        method: "GET",
        cache: "no-store"
      });

      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }

      const data = await response.json();
      console.log("Fetched Data: ", data); // Log the data to inspect its structure
      if (data && data.postservice) {
        setPostData(data.postservice); // Assume API returns { postservice: [...] }
      } else {
        console.error('Data format is incorrect:', data);
      }
    } catch (error) {
      console.error("Error loading posts: ", error);
    }
  };

  useEffect(() => {
    getPosts(); // Fetch posts when component mounts
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FBFBFB] overflow-hidden">
      <Header />
      <main className="flex-grow">
        <div className="lg:mx-64 lg:mt-10 lg:mb-10 mt-10 mb-10 mx-5">
          <h2 className="text-xl font-bold mb-4 text-black">คำร้องปัญหาของผู้ใช้</h2>
          <div className="w-full h-full flex flex-col overflow-hidden rounded-lg shadow-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-[#0B1E48]">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-[16px] text-white uppercase tracking-wider font-semibold">#</th>
            <th scope="col" className="px-6 py-3 text-left text-[16px] text-white uppercase tracking-wider font-semibold">ผู้ส่งคำร้อง</th>
            <th scope="col" className="px-6 py-3 text-left text-[16px] text-white uppercase tracking-wider font-semibold">ปัญหา</th>
            <th scope="col" className="px-6 py-3 text-left text-[16px] text-white uppercase tracking-wider font-semibold">อีเมล</th>
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
                        username: val.username
                      },
                    }}
                    className="text-black"
                  >
                    {val.username}
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
                        username: val.username
                      },
                    }}
                    className="text-black"
                  >
                  {val.report}
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
                        username: val.username
                      },
                    }}
                    className="text-black"
                  >
                  {val.email}
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                ไม่มีข้อมูลคำร้อง
              </td>
            </tr>
          )}
        </tbody>
      </table>
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
