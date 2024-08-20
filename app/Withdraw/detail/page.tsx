"use client";

import Header from "../../component/Header";
import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface Project {
  id: number;
  name: string;
  creator: string;
  time: string;
  bank: string;
  numberbank:string;
}

const projects: Project[] = [
  { id: 1, name: '25,000.00', creator: 'สมใจ ', time: '10/12/2567', bank: 'ธ.กสิกรไทย', numberbank:'209348576',},
  { id: 2, name: '15,000.00', creator: 'สมใจ ใจดี', time: '10/12/2567', bank: 'ธ.กสิกรไทย', numberbank:'223455678',},
  { id: 3, name: '35,000.00', creator: 'มานะ ', time: '10/12/2567', bank: 'ธ.กสิกรไทย', numberbank:'4635723456',},
  { id: 4, name: '25,000.00', creator: 'มาสาย', time: '10/12/2567', bank: 'ธ.กสิกรไทย', numberbank:'2234568999',},
  { id: 5, name: '15,000.00', creator: 'นายดำ', time: '10/12/2567', bank: 'ธ.กสิกรไทย', numberbank:'112341298',},
];

const Detail: React.FC = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const project = projects.find(p => p.id === Number(id));

  if (!project) {
    return <div>Project not found</div>;
  }
  return (
    <div className="flex flex-col min-h-screen bg-[#FBFBFB] overflow-hidden">
      <Header />
      <div className="lg:mx-16 mt-10 mb-2">
          <div key={project.id}  className="mb-4 p-4 lg:ml-10 ml-2">
            <h1 className="text-xl font-bold mb-10 ">คำร้องขอถอนเงิน</h1>
            <h3 className="text-lg text-gray-700 mb-4">โดย คุณ {project.creator}</h3>
            <h4 className="text-xl font-bold mb-4">จำนวนเงิน</h4>
            <p className="text-lg text-gray-700 mb-4">{project.name}</p>
            <h4 className="text-xl font-bold mb-4">ธนาคารใช้รับรายได้</h4>
            <p className="text-lg text-gray-700 mb-4">{project.bank}</p>
            <h4 className="text-xl font-bold mb-4">เลขบัญชี</h4>
            <p className="text-lg text-gray-700 mb-4">{project.numberbank}</p>
          </div>
        </div>
        <div className="mt-4 ml-5 mr-5 lg:ml-20 lg:mr-20">
            <button
             
              className="w-full p-2 text-white rounded mt-6"
              style={{backgroundColor:"#33539B"}}
            >
            เสร็จสิ้น
            </button>
            <button
             
              className="w-full p-2 text-white rounded mt-4"
              style={{backgroundColor:"#1976D2"}}
            >
                ติดต่อผู้ถอน
            </button>
            <button
             
              className="w-full p-2 text-white rounded mt-4"
              style={{backgroundColor:"#9B3933"}}
            >
            ลบคำร้อง
            </button>
          </div>
       
      </div>
   
  );
};

export default Detail;
