"use client";

import Header from "../component/Header";
import React from 'react';
import Link from 'next/link';

interface Project {
  id: number;
  name: string;
  creator: string;
  report: string;
}

const projects: Project[] = [
  { id: 1, name: 'Facebook... ', creator: 'สมใจ ใจดี', report: 'ไฟล์ไม่ทำงานตาม' },
  { id: 2, name: 'Facebook...', creator: 'สมใจ ใจดี', report: 'ไฟล์ไม่ทำงานตาม' },
  { id: 3, name: 'Facebook...', creator: 'สมใจ ใจดี', report: 'ไฟล์ไม่ทำงานตาม' },
  { id: 4, name: 'Facebook...', creator: 'สมใจ ใจดี', report: 'ไฟล์ไม่ทำงานตาม' },
];

const Reportproject: React.FC = () => {
  return (
    < div className="bg-[#FBFBFB] ">
        <Header/>
        <div className="lg:mx-65 mt-20 mb-2">
      <h2 className="text-xl font-bold mb-4">รายงานของผู้ใช้ : โครงงาน</h2>
      <Link href="/Reportproject/Detail">
      <table className="min-w-full border-collapse border border-gray-400">
        <thead>
          <tr>
            <th className="border border-gray-400 p-2">#</th>
            <th className="border border-gray-400 p-2">ชื่อโครงการ</th>
            <th className="border border-gray-400 p-2">คำร้อง</th>
            <th className="border border-gray-400 p-2">ผู้รายงาน</th>
          </tr>
        </thead>
       
        <tbody>
          {projects.map((project) => (
            <tr key={project.id}>
              <td className="border border-gray-400 p-2 text-center">{project.id}.</td>
              <td className="border border-gray-400 p-2">{project.name}</td>
              <td className="border border-gray-400 p-2">{project.report}</td>
              <td className="border border-gray-400 p-2">{project.creator}</td>
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
