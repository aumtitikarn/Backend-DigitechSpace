"use client";

import Header from "../component/Header";
import React, { useState } from 'react';
import Link from 'next/link';
import Pagination from '../component/Pagination';

interface Project {
  id: number;
  name: string;
  creator: string;
  time: string;
}

  

const projects: Project[] = [
  { id: 1, name: '15,000.00', creator: 'สมใจ ใจดี', time: '10/12/2567' },
  { id: 2, name: '15,000.00', creator: 'สมใจ ใจดี', time: '10/12/2567' },
  { id: 3, name: '15,000.00', creator: 'สมใจ ใจดี', time: '10/12/2567' },
  { id: 4, name: '15,000.00', creator: 'สมใจ ใจดี', time: '10/12/2567' },
  { id: 5, name: '15,000.00', creator: 'สมใจ ใจดี', time: '10/12/2567' },
  { id: 6, name: '15,000.00', creator: 'สมใจ ใจดี', time: '10/12/2567' },
  { id: 7, name: '15,000.00', creator: 'สมใจ ใจดี', time: '10/12/2567' },
  { id: 8, name: '15,000.00', creator: 'สมใจ ใจดี', time: '10/12/2567' },
  { id: 9, name: '15,000.00', creator: 'สมใจ ใจดี', time: '10/12/2567' },
  { id: 10, name: '15,000.00', creator: 'สมใจ ใจดี', time: '10/12/2567' },
  { id: 11, name: '15,000.00', creator: 'สมใจ ใจดี', time: '10/12/2567' },
  { id: 12, name: '15,000.00', creator: 'สมใจ ใจดี', time: '10/12/2567' },
  { id: 13, name: '15,000.00', creator: 'สมใจ ใจดี', time: '10/12/2567' },
  { id: 14, name: '15,000.00', creator: 'สมใจ ใจดี', time: '10/12/2567' },
  { id: 15, name: '15,000.00', creator: 'สมใจ ใจดี', time: '10/12/2567' },
  { id: 16, name: '15,000.00', creator: 'สมใจ ใจดี', time: '10/12/2567' },
];

const Reportproject: React.FC = () => {
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
    < div className="flex flex-col min-h-screen bg-[#FBFBFB] overflow-hidden">
        <Header/>
        <div className="lg:mx-16 mt-20 mb-2">
      <h2 className="text-xl font-bold mb-4 ml-5">รายงานของผู้ใช้ : โครงงาน</h2>
      <Link href="/Withdraw/detail">
      <div className="w-full h-full flex flex-col">
      <table className="min-w-full border-collapse border border-gray-400">
        <thead>
          <tr>
            <th className="border border-gray-400 p-2">#</th>
            <th className="border border-gray-400 p-2 lg:text-lg">ผู้ส่งคำร้อง</th>
            <th className="border border-gray-400 p-2 lg:text-lg">จำนวนเงิน(บาท)</th>
            <th className="border border-gray-400 p-2 lg:text-lg">วันที่ส่งคำร้อง</th>
          </tr>
        </thead>
       
        <tbody>
        {currentItems.map((project) => (
                  <tr key={project.id}>
                    <td className="border border-gray-400 p-2 text-center text-sm lg:text-lg">{project.id}.</td>
                    <td className="border border-gray-400 p-2 text-sm truncate max-w-xs lg:text-lg">{project.name}</td>
                    <td className="border border-gray-400 p-2 text-sm truncate max-w-xs lg:text-lg">{project.creator}</td>
                    <td className="border border-gray-400 p-2 text-sm truncate max-w-xs lg:text-lg">{project.time}</td>
                  </tr>
                ))}
        </tbody>
       
      </table>
      </div>
       </Link>
      <p className="text-sm mt-2">
        *หากอยากดูข้อมูลเพิ่มเติมให้คลิกที่ตารางคนนั้น
      </p>
      <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
    </div>
    </div>
  );
};

export default Reportproject;
