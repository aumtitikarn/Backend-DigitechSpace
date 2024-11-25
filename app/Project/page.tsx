"use client";

import Header from "../component/Header";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Pagination from "../component/Pagination";

interface Project {
  _id: string;
  projectname: string;
  description: string;
  receive: string[];
  category: string;
  price: number;
  review: number;
  sold: number;
  rathing: number;
  imageUrl: string[];
  author: string;
  iduser: string;
  filesUrl: string[];
  email: string;
  profileImage: string;
  authorName: string;
}

const Project: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedRathing, setSelectedRathing] = useState<number | null>(null);
  const itemsPerPage = 10;

  const categories = Array.from(
    new Set(projects.map((project) => project.category))
  );

  const rathingOptions = Array.from(
    new Set(projects.map((project) => project.rathing))
  ).sort((a, b) => a - b);

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(event.target.value || null);
  };

  const handleRathingChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedRathing(value ? parseFloat(value) : null);
  };

  const filteredProjects = projects.filter((project) => {
    const searchValue = searchTerm.toLowerCase();
    const matchesSearch =
      project.projectname?.toLowerCase().includes(searchValue) ||
      project.authorName?.toLowerCase().includes(searchValue) ||
      project.email?.toLowerCase().includes(searchValue);

    const matchesCategory =
      !selectedCategory || project.category === selectedCategory;

    const matchesRathing =
      selectedRathing === null || project.rathing === selectedRathing;

    return matchesSearch && matchesCategory && matchesRathing;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProjects.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);

  useEffect(() => {
    const getProjects = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/getproject", {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }

        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error("Error loading projects:", error);
        setError("Error loading projects");
      } finally {
        setLoading(false);
      }
    };

    getProjects();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedRathing]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FBFBFB] overflow-hidden">
      <main className="flex-grow">
        <div className="lg:mx-64 lg:mt-10 lg:mb-10 mt-10 mb-10 mx-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div>
              <h2 className="text-xl font-bold text-black">โครงงาน</h2>
              <p className="text-black">โครงงานทั้งหมดที่ถูกเผยแพร่แล้วบนเว็บไซต์</p>
            </div>
            <div className="relative w-full sm:w-auto flex gap-4">
              <input
                type="text"
                placeholder="ค้นหาโครงงาน, ผู้ขาย หรืออีเมล..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full sm:w-64 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5D76AD] text-black"
              />
              <select
                value={selectedCategory || ""}
                onChange={handleCategoryChange}
                className="w-full sm:w-64 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5D76AD] text-black"
              >
                <option value="">ทุกหมวดหมู่</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <select
                value={selectedRathing || ""}
                onChange={handleRathingChange}
                className="w-32 sm:w-32 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5D76AD] text-black"
              >
                <option value="">ทุกคะแนน</option>
                {rathingOptions.map((rathing) => (
                  <option key={rathing} value={rathing}>
                    {rathing} ดาว
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5 rounded-lg shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-[#0B1E48]">
                    <tr>
                      <th className="px-6 py-3 text-left text-[16px] text-white uppercase tracking-wider font-semibold">#</th>
                      <th className="px-6 py-3 text-left text-[16px] text-white uppercase tracking-wider font-semibold">ชื่อโครงงาน</th>
                      {/* <th className="px-6 py-3 text-left text-[16px] text-white uppercase tracking-wider font-semibold">คะแนน</th> */}
                      <th className="px-6 py-3 text-left text-[16px] text-white uppercase tracking-wider font-semibold">ราคา</th>
                      <th className="px-6 py-3 text-left text-[16px] text-white uppercase tracking-wider font-semibold">ผู้สร้าง</th>
                      <th className="px-6 py-3 text-left text-[16px] text-white uppercase tracking-wider font-semibold">อีเมล</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentItems.map((project, index) => (
                      <tr key={project._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {index + 1 + indexOfFirstItem}.
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                          <Link href={`/Project/detail?project=${project._id}`}>
                            {project.projectname || "-"}
                          </Link>
                        </td>
                        {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                          {project.rathing || "-"} ดาว
                        </td> */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                          {project.price || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                          {project.authorName || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                          {project.email || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
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

export default Project;

