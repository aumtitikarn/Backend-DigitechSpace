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
  { id: 1, name: 'Facebook...', creator: 'สมใจ ใจดี', report: 'ไฟล์ไม่ทำงานตาม' },
  
];

const Detail: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#FBFBFB] ">
      <Header />
      <div className="lg:mx-65 mt-10 mb-2 lg:ml-10 ">
      {projects.map((project) => (
          <div key={project.id} className="mb-4 p-4 lg:ml-10 ml-2">
            <h2 className="text-xl font-bold mb-10 ml-2">รายงานบล็อก {project.name}</h2>
            <h3 className="text-lg text-gray-700 mb-4">โดย คุณ {project.creator}</h3>
            <h4 className="text-xl font-bold mb-4">คำร้อง</h4>
            <p className="text-lg text-gray-700 mb-4">{project.report}</p>
            <h4 className="text-xl font-bold mb-4">ข้อความเพิ่มเติม</h4>
            <p className="text-lg text-gray-700 mb-4">ข้อความเพิ่มเติมที่นี่</p>
            <h4 className="text-xl font-bold mb-4">วันที่/เวลา</h4>
            <p className="text-lg text-gray-700 mb-4">15/08/2567 10:10:00</p>
          </div>
        ))}
        </div>
        <div className="flex justify-center mt-10">
  <Link href="/">
    <button className="bg-[#33529B] text-white w-[350px] lg:w-[800px] py-2 rounded-lg">
      ลบคำร้อง
    </button>
  </Link>
</div>
<div className="flex justify-center mt-5">
  <Link href="/">
    <button className="bg-[#1976D2] text-white w-[350px] lg:w-[800px] py-2 rounded-lg">
      ติดต่อเจ้าของโครงงาน/บล็อก
    </button>
  </Link>
</div>
<div className="flex justify-center mt-5">
  <Link href="/">
    <button className="bg-[#9B3933] text-white w-[350px] lg:w-[800px] py-2 rounded-lg">
      ลบโครงงาน/บล็อก
    </button>
  </Link>
</div>


      </div>
   
  );
};

export default Detail;
