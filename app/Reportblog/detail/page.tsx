"use client";

import Header from "../../component/Header";
import React from 'react';
import Link from 'next/link';

interface Project {
  id: number;
  name: string;
  creator: string;
  report: string;
}

const projects: Project[] = [
  { id: 1, name: 'แนะนำ Study with me', creator: 'สมใจ ใจดี', report: 'ไฟล์ไม่ทำงานตาม' },
];

const Detail: React.FC = () => {
  return (
    <div className="bg-[#FBFBFB]">
      <Header />
      <div className="lg:mx-65 mt-20 mb-2"> 
        {projects.map((project) => (
          <div key={project.id} className="mb-6 p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-10 ml-2">รายงานบล็อก {project.name}</h2>
            <h3 className="text-lg text-gray-700 mb-2">โดย คุณ {project.creator}</h3>
            <h4 className="text-xl font-bold mb-2">คำร้อง</h4>
            <p className="text-lg text-gray-700 mb-2">{project.report}</p>
            <h4 className="text-xl font-bold mb-2">ข้อความเพิ่มเติม</h4>
            <p className="text-lg text-gray-700 mb-2">ข้อความเพิ่มเติมที่นี่</p>
            <h4 className="text-xl font-bold mb-2">วันที่/เวลา</h4>
            <p className="text-lg text-gray-700 mb-2">15/08/2567 10:10:00</p>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-11">
                 <Link href="/">
                   <button className="bg-[#33529B] text-white px-20 py-2 rounded-lg">
                   ลบคำร้อง
                   </button>
                 </Link>
              </div>
              <div className="flex justify-center mt-11">
                 <Link href="/">
                   <button className="bg-[#1976D2] text-white px-20 py-2 rounded-lg">
                   ติดต่อเจ้าของโครงงาน/บล็อก
                   </button>
                 </Link>
              </div>
              <div className="flex justify-center mt-11">
                 <Link href="/">
                   <button className="bg-[#9B3933] text-white px-20 py-2 rounded-lg">
                   ลบโครงงาน/บล็อก
                   </button>
                 </Link>
              </div>
              
    </div>
  );
};

export default Detail;
