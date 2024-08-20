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
    <div className="flex flex-col min-h-screen bg-[#FBFBFB] ">
      <Header />
      <div className="lg:mx-65 mt-10 mb-2 lg:ml-10 "> 
        {projects.map((project) => (
          <div key={project.id} className="mb-4 p-4 lg:ml-10 ml-2">
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
      <div className="mt-4 ml-5 mr-5 lg:ml-20 lg:mr-20">
            <button
             
              className="w-full p-2 text-white rounded mt-6"
              style={{backgroundColor:"#33539B"}}
            >
              ลบคำร้อง
            </button>
            <button
             
              className="w-full p-2 text-white rounded mt-4"
              style={{backgroundColor:"#1976D2"}}
            >
              ติดต่อเจ้าของโครงงาน/บล็อก
            </button>
            <button
             
              className="w-full p-2 text-white rounded mt-4"
              style={{backgroundColor:"#9B3933"}}
            >
              ลบโครงงาน/บล็อก
            </button>
          </div>
              
    </div>
  );
};

export default Detail;
