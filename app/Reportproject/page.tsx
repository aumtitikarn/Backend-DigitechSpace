'use client';
import Header from "../component/Header";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Pagination from '../component/Pagination';

interface Project {
  _id: string;
  name: string;
  username: string;
  report: string;
  more: string;
  email: string;
  author: string;
  projectId: string;
  createdAt: Date;
}

const Reportproject: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 10;

  const getPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:3000/api/getreportproject", {
        method: "GET",
        cache: "no-store"
      });

      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }

      const data = await response.json();
      console.log("Fetched Data:", data);

      if (data && Array.isArray(data.projectData)) {
        const projectsWithDate = data.projectData.map((project: any) => ({
          ...project,
          time: new Date(project.time),
        }));

        setProjects(projectsWithDate);
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

  const formatDate = (date: any) => {
    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime()) ? parsedDate.toISOString() : "";
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FBFBFB] overflow-hidden">
      <Header />
      <main className="flex-grow">
        <div className="lg:mx-64 lg:mt-10 lg:mb-10 mt-10 mb-10 mx-5">
          <h2 className="text-xl font-bold mb-4">รายงานของผู้ใช้ : โครงงาน</h2>
          {loading ? (
            <p>กำลังโหลดข้อมูล...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className="w-full h-full flex flex-col overflow-hidden rounded-lg shadow-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-[#0B1E48]">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-[16px] text-white uppercase tracking-wider font-semibold">#</th>
                  <th scope="col" className="px-6 py-3 text-left text-[16px] text-white uppercase tracking-wider font-semibold">ชื่อโครงงาน</th>
                  <th scope="col" className="px-6 py-3 text-left text-[16px] text-white uppercase tracking-wider font-semibold">คำร้อง</th>
                  <th scope="col" className="px-6 py-3 text-left text-[16px] text-white uppercase tracking-wider font-semibold">ผู้รายงาน</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.length > 0 ? (
                  currentItems.map((val, index) => (
                    <tr key={val._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                        {indexOfFirstItem + index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                        <Link
                          href={{
                            pathname: `/Reportproject/Detail`,
                            query: {
                              id: val._id,
                              name: val.name,
                              username: val.username,
                              report: val.report,
                              more: val.more,
                              email: val.email,
                              author: val.author,
                              projectId: val.projectId,
                              createdAt: formatDate(val.createdAt),
                            },
                          }}
                          className="text-black"
                        >
                          {val.name}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                        {val.report}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                        {val.username}
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
          )}
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

export default Reportproject;
