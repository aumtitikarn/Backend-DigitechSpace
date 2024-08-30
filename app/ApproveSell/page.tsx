"use client";

import Header from "../component/Header";
import React, { useState } from 'react';
import Link from 'next/link';
import Pagination from '../component/Pagination';
interface Project {
  id: number;
  name: string;
  creator: string;
  price: string;
}

const projects: Project[] = [
  { id: 1, name: 'Facebook Website', creator: 'สมใจ ใจดี', price: '25,000' },
  { id: 2, name: 'somjai', creator: 'สมใจ ใจดี', price: '45,000' },
  { id: 3, name: '@somjai', creator: 'สมใจ ใจดี', price: '29,000' },
  { id: 4, name: 'Facebook Website', creator: 'สมใจ ใจดี', price: '35,000' },
  { id: 5, name: 'somjai', creator: 'สมใจ ใจดี', price: '15,000' },
  { id: 6, name: '@somjai', creator: 'สมใจ ใจดี', price: '40,000' },
  { id: 7, name: 'Facebook Website', creator: 'สมใจ ใจดี', price: '20,000' },
  { id: 8, name: 'somjai', creator: 'สมใจ ใจดี', price: '27,000' },
  
];

const approvesell: React.FC = () => {
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
      <h2 className="text-xl font-bold mb-4">อนุมัติการขาย</h2>
      <Link href="/ApproveSell/Detail">
      <div className="w-full h-full flex flex-col"></div>
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
        {currentItems.map((project) => (
            <tr key={project.id}>
              <td className="border border-gray-400 p-2 text-center">{project.id}.</td>
              <td className="border border-gray-400 p-2 text-sm truncate max-w-xs lg:text-lg">
                    <Link href={`/ApproveSell/Detail?id=${project.id}`}>
                      {project.name}
                    </Link>
                  </td>
              <td className="border border-gray-400 p-2 text-sm truncate max-w-xs lg:text-lg">{project.creator}</td>
              <td className="border border-gray-400 p-2 text-sm truncate max-w-xs lg:text-lg">{project.price}</td>
            </tr>
          ))}
        </tbody>
       
      </table>
       </Link>
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

export default approvesell;
