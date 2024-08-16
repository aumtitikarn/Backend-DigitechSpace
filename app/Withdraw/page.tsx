"use client";

import Header from "../component/Header";
import React from 'react';
import Link from 'next/link';

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
];

const Reportproject: React.FC = () => {
  return (
    < div className="bg-[#FBFBFB] ">
        <Header/>
        <div className="lg:mx-65 mt-20 mb-2">
      <h2 className="text-xl font-bold mb-4">รายงานของผู้ใช้ : โครงงาน</h2>
      <Link href="/Withdraw/detail">
      <table className="min-w-full border-collapse border border-gray-400">
        <thead>
          <tr>
            <th className="border border-gray-400 p-2">#</th>
            <th className="border border-gray-400 p-2">ผู้ส่งคำร้อง</th>
            <th className="border border-gray-400 p-2">จำนวนเงิน(บาท)</th>
            <th className="border border-gray-400 p-2">วันที่ส่งคำร้อง</th>
          </tr>
        </thead>
       
        <tbody>
          {projects.map((project) => (
            <tr key={project.id}>
              <td className="border border-gray-400 p-2 text-center">{project.id}.</td>
              <td className="border border-gray-400 p-2">{project.creator}</td>
              <td className="border border-gray-400 p-2">{project.name}</td>
              <td className="border border-gray-400 p-2">{project.time}</td>
            </tr>
          ))}
        </tbody>
       
      </table>
       </Link>
      <p className="text-sm mt-2">
        *หากอยากดูข้อมูลเพิ่มเติมให้คลิกที่ตารางด้านบน
      </p>
    </div>
    </div>
  );
};

export default Reportproject;
