"use client";

import Header from "../component/Header";
import React, { useState } from 'react';
import Link from 'next/link';
import Pagination from '../component/Pagination';

interface Project {
  id: number;
  name: string;
  creator: string;
  report: string;
 
}

const projects: Project[] = [
  { id: 1, name: 'สมใจ ใจดี', report: 'เว็บบัค', creator: 'a1@gmail.com' },
  { id: 2, name: 'สมใจ ใจดี', report: 'เว็บโหลดช้า', creator: 'a1@gmail.com' },
  { id: 3, name: 'สมใจ ใจดี', report: 'ไม่สามารถเข้าหน้า...', creator: 'a1@gmail.com' },
  { id: 4, name: 'สมใจ ใจดี', report: 'เว็บบัค', creator: 'a1@gmail.com' },
  { id: 5, name: 'สมใจ ใจดี', report: 'เว็บบัค', creator: 'a1@gmail.com' },
  { id: 6, name: 'สมใจ ใจดี', report: 'เว็บโหลดช้า', creator: 'a1@gmail.com' },
  { id: 7, name: 'สมใจ ใจดี', report: 'เว็บโหลดช้า ', creator: 'a1@gmail.com' },
  { id: 8, name: 'สมใจ ใจดี', report: 'ไม่สามารถเข้าหน้า..', creator: 'a1@gmail.com' },
];

const Report: React.FC = () => {
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
        <h2 className="text-xl font-bold mb-4 ">คำร้องปัญหาของผู้ใช้</h2>
        <div className="w-full h-full flex flex-col">
          <table className="min-w-full border-collapse border border-gray-400">
            <thead>
              <tr>
                <th className="border border-gray-400 p-2">#</th>
                <th className="border border-gray-400 p-2 lg:text-lg">ผู้ส่งคำร้อง</th>
                <th className="border border-gray-400 p-2 lg:text-lg">ปัญหา</th>
                <th className="border border-gray-400 p-2 lg:text-lg">อีเมล</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((project) => (
                <tr key={project.id}>
                  <td className="border border-gray-400 p-2 text-center text-sm lg:text-lg">{project.id}.</td>
                  <td className="border border-gray-400 p-2 text-sm truncate max-w-xs lg:text-lg">
                    <Link href={`/ReportService/detail?id=${project.id}`}>
                      {project.name}
                    </Link>
                  </td>
                  <td className="border border-gray-400 p-2 text-sm truncate max-w-xs lg:text-lg">{project.report}</td>
                  <td className="border border-gray-400 p-2 text-sm truncate max-w-xs lg:text-lg">{project.creator}</td>
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

export default Report;
