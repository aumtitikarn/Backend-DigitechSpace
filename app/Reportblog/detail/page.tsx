"use client";

import Header from "../../component/Header";
import React from 'react';
import { useSearchParams } from 'next/navigation';

interface Project {
  id: number;
  name: string;
  creator: string;
  report: string;
  more:string;
}

const projects: Project[] = [
  { id: 1, name: 'แนะนำ Study with me', creator: 'สมใจ ', report: 'มีคำไม่สุภาพ หรือ คำหยาบคาย',more:'เป็นแบบอย่างที่ไม่ดี' },
  { id: 2, name: 'แนะนำ Study with me', creator: 'สมใจ ใจดี', report: 'ไฟล์ไม่ทำงานตามที่ควรจะเป็น' ,more:'ไฟล์เปิดไม่ได้ค่ะ'},
  { id: 3, name: 'แนะนำ Study with me', creator: 'สมศัก ใจดี', report: 'มีคำไม่สุภาพ หรือ คำหยาบคาย',more:'เป็นแบบอย่างที่ไม่ดี' },
  { id: 4, name: 'แนะนำ Study with me', creator: 'ใจดี', report: 'มีคำไม่สุภาพ หรือ คำหยาบคาย' ,more:'เป็นแบบอย่างที่ไม่ดี'},
  { id: 5, name: 'แนะนำ Study with me', creator: 'มานะ ใจดี', report: 'ไฟล์ไม่ทำงานตามที่ควรจะเป็น' ,more:'ไฟล์เปิดไม่ได้ค่ะ'},
  { id: 6, name: 'แนะนำ Study with me', creator: 'นายดำ ', report: 'มีคำไม่สุภาพ หรือ คำหยาบคาย',more:'เป็นแบบอย่างที่ไม่ดี' },
  { id: 7, name: 'แนะนำ Study with me', creator: 'สม', report: 'มีคำไม่สุภาพ หรือ คำหยาบคาย',more:'เป็นแบบอย่างที่ไม่ดี' },
  { id: 8, name: 'แนะนำ Study with me', creator: 'สมใจ มานะ', report: 'ไฟล์ไม่ทำงานตามที่ควรจะเป็น',more:'ไฟล์เปิดไม่ได้ค่ะ' },

];

const detail: React.FC = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const project = projects.find(p => p.id === Number(id));

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FBFBFB]">
      <Header />
      <div className="lg:mx-65 mt-10 mb-2 lg:ml-10">
        <div key={project.id} className="mb-4 p-4 lg:ml-10 ml-2">
          <h2 className="text-xl font-bold mb-10 ml-2">รายงานบล็อก {project.name}</h2>
          <h3 className="text-lg text-gray-700 mb-4">โดย คุณ {project.creator}</h3>
          <h4 className="text-xl font-bold mb-4">คำร้อง</h4>
          <p className="text-lg text-gray-700 mb-4">{project.report}</p>
          <h4 className="text-xl font-bold mb-4">ข้อความเพิ่มเติม</h4>
          <p className="text-lg text-gray-700 mb-4">{project.more}</p>
          <h4 className="text-xl font-bold mb-4">วันที่/เวลา</h4>
          <p className="text-lg text-gray-700 mb-4">15/08/2567 10:10:00</p>
        </div>
      </div>
      <div className="mt-4 ml-5 mr-5 lg:ml-20 lg:mr-20">
        <button
          className="w-full p-2 text-white rounded mt-6"
          style={{ backgroundColor: "#33539B" }}
        >
          ลบคำร้อง
        </button>
        <button
          className="w-full p-2 text-white rounded mt-4"
          style={{ backgroundColor: "#1976D2" }}
        >
          ติดต่อเจ้าของโครงงาน/บล็อก
        </button>
        <button
          className="w-full p-2 text-white rounded mt-4"
          style={{ backgroundColor: "#9B3933" }}
        >
          ลบโครงงาน/บล็อก
        </button>
      </div>
    </div>
  );
};

export default detail;
