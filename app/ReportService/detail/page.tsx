"use client";

import React, { useState } from "react";
import Header from "../../component/Header";
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function page() {
  interface Project1 {
    id: number;
    name: string;
    report: string;
    email: string;
}

const projects: Project1[] = [
  { id: 1, name: 'สมใจ ใจดี', report: 'มีคำไม่สุภาพ หรือ คำหยาบคาย', email: 'a1@gmail.com' },
  { id: 2, name: 'สมใจ', report: 'ไฟล์ไม่ทำงานตามที่ควรจะเป็น', email: 'a1@gmail.com' },
  { id: 3, name: 'สมหมาย', report: 'มีคำไม่สุภาพ หรือ คำหยาบคาย', email: 'a1@gmail.com' },
  { id: 4, name: 'ใจดี', report: 'มีคำไม่สุภาพ หรือ คำหยาบคาย', email: 'a1@gmail.com' },
  { id: 5, name: 'ใจ ใจ', report: 'ไฟล์ไม่ทำงานตามที่ควรจะเป็น', email: 'a1@gmail.com' },
  { id: 6, name: 'ดี', report: 'มีคำไม่สุภาพ หรือ คำหยาบคาย', email: 'a1@gmail.com' },
  { id: 7, name: 'สม', report: 'มีคำไม่สุภาพ หรือ คำหยาบคาย', email: 'a1@gmail.com' },
  { id: 8, name: 'ใจใจดี', report: 'ไฟล์ไม่ทำงานตามที่ควรจะเป็น', email: 'a1@gmail.com' },
];


  const [input1, setInput1] = useState("");
  const [input2, setInput2] = useState("");

  const handleSubmit = () => {
    alert(`Input 1: ${input1}, Input 2: ${input2}`);
    setInput1("");
    setInput2("");
  };

  const handleSubmit1 = () => {
    alert(`Input 1: ${input1}, Input 2: ${input2}`);
    setInput1("");
    setInput2("");
  };

  const handleSubmit2 = () => {
    alert(`Input 1: ${input1}, Input 2: ${input2}`);
    setInput1("");
    setInput2("");
  };

  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const project = projects.find(p => p.id === Number(id));

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
      <main style={{backgroundColor:"#FBFBFB"}}>
        <Header/>
        
    <div key={project.id} className="flex flex-col md:flex-row w-full max-w-auto justify-center p-4 bg text-black" style={{backgroundColor:"#FBFBFB"}}>
      <div className="flex flex-col md:flex-col w-full max-w-auto justify-center" >
        <div className="flex flex-col justify-center">
          <h1 className="text-lg font-bold mt-5 mb-5 text-black" style={{fontSize:"36px"}}>คำร้องปัญหาของผู้ใช้</h1>
        </div>
        <p className="mt-2 text-lg">
        โดย {project.name}
        </p>
        <div className="flex flex-col md:flex-coljustify-center w-full mt-6">
          <h1 className="text-lg font-bold mt-4" style={{fontSize:"24px"}}>ปัญหา</h1>
          <p className="mt-2 text-lg">
          เว็บบัค {project.report}
          </p>

          <h1 className="text-lg font-bold mt-4" style={{fontSize:"24px"}}>อีเมล</h1>
          <p className="mt-2 text-lg">
          a1@gmail.com {project.email}
          </p>

          <div className="mt-4">
            <button
              onClick={handleSubmit}
              className="w-full p-2 text-white rounded mt-6"
              style={{backgroundColor:"#33539B"}}
            >
              ลบคำร้อง
            </button>
            <button
              onClick={handleSubmit1}
              className="w-full p-2 text-white rounded mt-4"
              style={{backgroundColor:"#1976D2"}}
            >
              ติดต่อเจ้าของโครงงาน/บล็อก
            </button>
            <button
              onClick={handleSubmit2}
              className="w-full p-2 text-white rounded mt-4"
              style={{backgroundColor:"#9B3933"}}
            >
              ลบโครงงาน/บล็อก
            </button>
          </div>
        </div>
      </div>
    </div>
        
    <div className="flex flex-col space-y-4">
                <div className="w-full h-48 p-2">s</div>
            </div>
    </main>
  );
}

export default page;
