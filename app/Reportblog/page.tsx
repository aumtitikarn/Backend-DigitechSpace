'use client';
import Header from "../component/Header";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Pagination from '../component/Pagination';

interface Project {
  _id: string;
  blogname: string;
  username: string;
  report: string;
  selectedReason: string;
  time: string;
}

const Reportblog: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const itemsPerPage = 5;

 

  const getPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:3000/api/getreportblog", {
        method: "GET",
        cache: "no-store"
      });

      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }

      const data = await response.json();
      console.log("Fetched Data:", data);

      if (data && Array.isArray(data.blogData)) {
        setProjects(data.blogData);
      } else {
        console.error('Data format is incorrect:', data);
        setError('Data format is incorrect');
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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = projects.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(projects.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FBFBFB] overflow-hidden">
      <Header />
      <main className="flex-grow">
        <div className="lg:mx-64 lg:mt-10 lg:mb-10 mt-10 mb-10 mx-5">
          <h2 className="text-xl font-bold mb-4">รายงานของผู้ใช้ : บล็อก</h2>
          {loading ? (
            <p>กำลังโหลดข้อมูล...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className="w-full h-full flex flex-col">
              <table className="min-w-full border-collapse border border-gray-400">
                <thead>
                  <tr>
                    <th className="border border-gray-400 p-2">#</th>
                    <th className="border border-gray-400 p-2 lg:text-lg">ชื่อโครงการ</th>
                    <th className="border border-gray-400 p-2 lg:text-lg">คำร้อง</th>
                    <th className="border border-gray-400 p-2 lg:text-lg">ผู้รายงาน</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.length > 0 ? (
                    currentItems.map((val, index) => (
                      <tr key={val._id}>
                        <td className="border border-gray-400 p-2 text-center text-sm lg:text-lg">
                          {indexOfFirstItem + index + 1}
                        </td>
                        <td className="border border-gray-400 p-2 text-sm truncate max-w-xs lg:text-lg">
                          <Link
                            href={{
                              pathname: `/Reportblog/detail`,
                              query: {
                                id: val._id,
                                name: val.blogname,
                                username: val.username,
                                report: val.report,
                                selectedReason: val.selectedReason,
                                time: val.time
                              },
                            }}
                          >
                            {val.blogname}
                          </Link>
                        </td>
                        <td className="border border-gray-400 p-2 text-sm truncate max-w-xs lg:text-lg">
                          {val.report}
                        </td>
                        <td className="border border-gray-400 p-2 text-sm truncate max-w-xs lg:text-lg">
                          {val.username}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="text-center p-4">ไม่มีข้อมูลคำร้อง</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          <p className="text-sm mt-2">
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

export default Reportblog;
