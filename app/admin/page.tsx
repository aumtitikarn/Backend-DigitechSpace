"use client";

import Header from "../component/Header";
import React, { useState } from 'react';
import Link from 'next/link';
import Pagination from '../component/Pagination';

interface Project {
  id: number;
  Username: string;
  name: string;
  Email: string;
 
}

const projects: Project[] = [
  { id: 1, Username: '@somjai', name: 'สมใจ ใจดี', Email: 'phorn@gmail.com' },
  { id: 2, Username: '@somjai', name: 'สมใจ ใจดี', Email: 'thiwa@gmail.com' },
  { id: 3, Username: '@somjai', name: 'สมใจ ใจดี', Email: 'phorn@gmail.com' },
  { id: 4, Username: '@somjai', name: 'สมใจ ใจดี', Email: 'thiwa@gmail.com' },
  { id: 5, Username: '@somjai', name: 'สมใจ ใจดี', Email: 'thiwa@gmail.com' },
  { id: 6, Username: '@somjai', name: 'สมใจ ใจดี', Email: 'thiwa@gmail.com' },
  { id: 7, Username: '@somjai', name: 'สมใจ ใจดี ', Email: 'phorn@gmail.com' },
  { id: 8, Username: '@somjai', name: 'สมใจ ใจดี', Email: 'phorn@gmail.com' },
];

const usernormal: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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
        <h2 className="text-xl font-bold mb-4 ">รายชื่อของแอดมิน</h2>
        <div className="w-full h-full flex flex-col">
          <table className="min-w-full border-collapse border border-gray-400">
            <thead>
              <tr>
                <th className="border border-gray-400 p-2">#</th>
                <th className="border border-gray-400 p-2 lg:text-lg">Username</th>
                <th className="border border-gray-400 p-2 lg:text-lg">ชื่อ-นามสกุล</th>
                <th className="border border-gray-400 p-2 lg:text-lg">อีเมล</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((project) => (
                <tr key={project.id}>
                  <td className="border border-gray-400 p-2 text-center text-sm lg:text-lg">{project.id}.</td>
                  <td className="border border-gray-400 p-2 text-sm truncate max-w-xs lg:text-lg">
                    <Link href={{
    pathname: `/admin/detail`,
    query: {
      id: project.id,
      Username: project.Username,
       name: project.name,
      Email: project.Email,
    },
  }}>
                      {project.Username}
                    </Link>
                  </td>
                  <td className="border border-gray-400 p-2 text-sm truncate max-w-xs lg:text-lg">{project.name}</td>
                  <td className="border border-gray-400 p-2 text-sm truncate max-w-xs lg:text-lg">{project.Email}</td>
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
