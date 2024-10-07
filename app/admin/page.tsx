"use client";

import Header from "../component/Header";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Pagination from '../component/Pagination';

interface Project {
  id: string;
  name: string;
  email: string;
}

const usernormal: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 5;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = projects.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(projects.length / itemsPerPage);

  const getPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/adminuser", {
        method: "GET",
        cache: "no-store"
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }
  
      const data = await response.json();
      console.log("Fetched Data:", data); // ตรวจสอบข้อมูลที่ได้มา
  
      // ตรวจสอบโครงสร้างข้อมูลและดึงเฉพาะ name และ email
      if (data && Array.isArray(data.adminusers)) {
        const formattedProjects = data.adminusers.map((user: any) => ({
          id: user._id, // ใช้ _id เป็น id
          name: user.name,
          email: user.email
        }));
        setProjects(formattedProjects);
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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="flex flex-col min-h-screen bg-[#FBFBFB] overflow-hidden">
      <Header />
      <main className="flex-grow">
        <div className="lg:mx-64 lg:mt-10 lg:mb-10 mt-10 mb-10 mx-5">
          <h2 className="text-xl font-bold mb-4 text-black">รายชื่อของแอดมิน</h2>
          <div className="w-full h-full flex flex-col">
            <table className="min-w-full border-collapse border border-gray-400">
              <thead>
                <tr>
                  <th className="border border-gray-400 p-2 text-black">#</th>
                  <th className="border border-gray-400 p-2 lg:text-lg text-black">Username</th>
                  <th className="border border-gray-400 p-2 lg:text-lg text-black">อีเมล</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((project, index) => (
                  <tr key={project.id}>
                    <td className="border border-gray-400 p-2 text-center text-sm lg:text-lg text-black">
                      {index + 1 + indexOfFirstItem}.
                    </td>
                    <td className="border border-gray-400 p-2 text-sm truncate max-w-xs lg:text-lg text-black">
                      <Link
                        href={{
                          pathname: `/admin/detail`,
                          query: {
                            id: project.id,
                            name: project.name,
                            email: project.email,
                          },
                        }}
                      >
                        {project.name}
                      </Link>
                    </td>
                    <td className="border border-gray-400 p-2 text-sm truncate max-w-xs lg:text-lg text-black">
                      {project.email}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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

export default usernormal;
