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
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 10;

  // Filter projects based on search term
  const filteredProjects = projects.filter((project) => {
    const searchValue = searchTerm.toLowerCase();
    return (
      project.name?.toLowerCase().includes(searchValue) ||
      project.report?.toLowerCase().includes(searchValue) ||
      project.username?.toLowerCase().includes(searchValue)
    );
  });

  const getPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/getreportproject", {
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

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProjects.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <h2 className="text-xl font-bold text-black">รายงานของผู้ใช้ : โครงงาน</h2>
            <div className="relative w-full sm:w-auto">
              <input
                type="text"
                placeholder="ค้นหาโครงงาน, คำร้อง หรือผู้รายงาน..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full sm:w-64 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5D76AD] text-black"
              />
            </div>
          </div>
          {loading ? (
            <p>กำลังโหลดข้อมูล...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5 rounded-lg">
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
                                {val.name || "-"}
                              </Link>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                              {val.report || "-"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                              {val.username || "-"}
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
              </div>
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