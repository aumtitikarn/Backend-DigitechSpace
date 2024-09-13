"use client";

import Header from "../component/Header";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Pagination from '../component/Pagination';

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
  status?: string; // Add this if status is optional
}

const ApproveSell: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const itemsPerPage = 5;

  useEffect(() => {
    const getPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("http://localhost:3000/api/project", {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }

        const data = await response.json();
        console.log("Fetched Data:", data);

        if (data && Array.isArray(data.projectData)) {
          // Filter out rejected projects
          const filteredProjects = data.projectData.filter((project: Project) => project.status !== 'rejected');
          setProjects(filteredProjects);
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
          <h2 className="text-xl font-bold mb-4">อนุมัติการขาย</h2>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <table className="min-w-full border-collapse border border-gray-400">
              <thead>
                <tr>
                  <th className="border border-gray-400 p-2 text-center text-sm lg:text-lg">#</th>
                  <th className="border border-gray-400 p-2 lg:text-lg">ชื่อโครงการ</th>
                  <th className="border border-gray-400 p-2 lg:text-lg">ผู้สร้าง</th>
                  <th className="border border-gray-400 p-2 lg:text-lg">ราคา</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((project, index) => (
                    <tr key={project._id}>
                      <td className="border border-gray-400 p-2 text-center"> {indexOfFirstItem + index + 1}.</td>
                      <td className="border border-gray-400 p-2 text-sm truncate max-w-xs lg:text-lg">
                        <Link href={`/ApproveSell/Detail?_id=${project._id}`}>
                          {project.projectname}
                        </Link>
                      </td>
                      <td className="border border-gray-400 p-2 text-sm truncate max-w-xs lg:text-lg">{project.author}</td>
                      <td className="border border-gray-400 p-2 text-sm truncate max-w-xs lg:text-lg">{project.price}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center p-4">ไม่มีข้อมูลคำร้อง</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
          <p className="text-sm mt-2">
            *หากอยากดูข้อมูลเพิ่มเติมให้คลิกที่ตารางด้านบน
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

export default ApproveSell;
