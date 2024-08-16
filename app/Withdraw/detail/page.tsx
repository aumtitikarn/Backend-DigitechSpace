"use client";

import Header from "../../component/Header";
import React from 'react';
import Link from 'next/link';

interface Project {
  id: number;
  name: string;
  creator: string;
  time: string;
}

const projects: Project[] = [
  { id: 1, name: '15,000.00', creator: 'สมใจ ใจดี', time: '10/12/2567' }
  
];

const Detail: React.FC = () => {
  return (
    <div className="bg-[#FBFBFB]">
      <Header />
      <div className="lg:mx-65 mt-20 mb-2">
      {projects.map((project) => (
          <div key={project.id} className="mb-6 p-4 bg-white rounded-lg shadow-md">
            <h1 className="text-xl font-bold mb-10 ml-2">คำร้องขอถอนเงิน</h1>
            <h3 className="text-lg text-gray-700 mb-4">โดย คุณ {project.creator}</h3>
            <h4 className="text-xl font-bold mb-4">จำนวนเงิน</h4>
            <p className="text-lg text-gray-700 mb-4">{project.name}</p>
            <h4 className="text-xl font-bold mb-4">ธนาคารใช้รับรายได้</h4>
            <p className="text-lg text-gray-700 mb-4">ธ.กสิกรไทย</p>
            <h4 className="text-xl font-bold mb-4">เลขบัญชี</h4>
            <p className="text-lg text-gray-700 mb-4">209348576</p>
          </div>
        ))}
        </div>
        <div className="flex justify-center mt-11">
                 <Link href="/">
                   <button className="bg-[#33529B] text-white px-20 py-2 rounded-lg">
                   เสร็จสิ้น
                   </button>
                 </Link>
              </div>
              <div className="flex justify-center mt-11">
                 <Link href="/">
                   <button className="bg-[#1976D2] text-white px-20 py-2 rounded-lg">
                   ติดต่อผู้ถอน
                   </button>
                 </Link>
              </div>
              <div className="flex justify-center mt-11">
                 <Link href="/">
                   <button className="bg-[#9B3933] text-white px-20 py-2 rounded-lg">
                   ลบคำร้อง
                   </button>
                 </Link>
              </div>
      </div>
   
  );
};

export default Detail;
