"use client";

import Header from "../component/Header";
import React from 'react';
import Link from 'next/link';

interface Project {
  id: number;
  name: string;
  creator: string;
  price: string;
}

const projects: Project[] = [
  { id: 1, name: '@somjai', creator: 'สมใจ ใจดี', price: '0640398458' },
  { id: 2, name: '@somjai', creator: 'สมใจ ใจดี', price: '0640398458' },
  { id: 3, name: '@somjai', creator: 'สมใจ ใจดี', price: '0640398458' },
  { id: 4, name: '@somjai', creator: 'สมใจ ใจดี', price: '0640398458' },
];

const approvesell: React.FC = () => {
  return (
    < div className="bg-[#FBFBFB]">
        <Header/>
        <div className="lg:mx-65 mt-20 mb-2">
      <h2 className="text-xl font-bold mb-4">อนุมัติการขาย</h2>
      <Link href="/ApproveSell/Detail">
      <table className="min-w-full border-collapse border border-gray-400">
        <thead>
          <tr>
            <th className="border border-gray-400 p-2">#</th>
            <th className="border border-gray-400 p-2">ชื่อโครงการ</th>
            <th className="border border-gray-400 p-2">ผู้สร้าง</th>
            <th className="border border-gray-400 p-2">ราคา</th>
          </tr>
        </thead>
       
        <tbody>
          {projects.map((project) => (
            <tr key={project.id}>
              <td className="border border-gray-400 p-2 text-center">{project.id}.</td>
              <td className="border border-gray-400 p-2">{project.name}</td>
              <td className="border border-gray-400 p-2">{project.creator}</td>
              <td className="border border-gray-400 p-2">{project.price}</td>
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

export default approvesell;
