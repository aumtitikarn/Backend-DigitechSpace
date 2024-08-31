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
  bank: string;
  numberbank:string;
}

const projects: Project[] = [
  { id: 1, creator: '25,000.00', name: 'สมใจ ', time: '10/12/2567', bank: 'ธ.กสิกรไทย', numberbank:'209348576',},
  { id: 2, creator: '15,000.00', name: 'สมใจ ใจดี', time: '10/12/2567', bank: 'ธ.กสิกรไทย', numberbank:'223455678',},
  { id: 3, creator: '35,000.00', name: 'มานะ ', time: '10/12/2567', bank: 'ธ.กสิกรไทย', numberbank:'4635723456',},
  { id: 4, creator: '25,000.00', name: 'มาสาย', time: '10/12/2567', bank: 'ธ.กสิกรไทย', numberbank:'2234568999',},
  { id: 5, creator: '15,000.00', name: 'นายดำ', time: '10/12/2567', bank: 'ธ.กสิกรไทย', numberbank:'112341298',},
];

const Withdraw: React.FC = () => {
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
      <h2 className="text-xl font-bold mb-4 ">คำร้องขอถอนเงิน</h2>
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
                  <td className="border border-gray-400 p-2 text-sm truncate max-w-xs lg:text-lg">
                    <Link href={{
    pathname: `/Withdraw/detail`,
    query: {
      id: project.id,
      name: project.name,
      creator: project.creator,
      time: project.time,
      bank: project.bank,
      numberbank: project.numberbank,
    },
  }}>
                      {project.name}
                    </Link>
                  </td>
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
    </main>
    </div>
  );
};

export default Withdraw;
