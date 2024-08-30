"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation"; // Ensure you import this if you want to use it
import Header from "../../component/Header";
import Link from "next/link";

interface Project {
  id: number;
  name: string;
  creator: string;
  report: string;
  more: string;
}

const projects: Project[] = [
  { id: 1, name: "Facebook Website", creator: "สมใจ ใจดี", report: "ไฟล์ไม่ทำงาน", more: "ไฟล์เปิดไม่ได้ค่ะ" },
  { id: 2, name: "Facebook Website", creator: "สมศรี", report: "ไม่ตรงปก", more: "ไม่สวย" },
  { id: 3, name: "Facebook Website", creator: "สมใจ ใจดี", report: "ไฟล์ไม่ทำงาน", more: "ไฟล์เปิดไม่ได้ค่ะ" },
  { id: 4, name: "Facebook Website", creator: "สมศรี", report: "ไม่ตรงปก", more: "ไม่สวย" },
  { id: 5, name: "Facebook Website", creator: "สมใจ ใจดี", report: "ไฟล์ไม่ทำงาน", more: "ไฟล์เปิดไม่ได้ค่ะ" },
  { id: 6, name: "Facebook Website", creator: "สมศรี", report: "ไม่ตรงปก", more: "ไม่สวย" },
  { id: 7, name: "Facebook Website", creator: "สมใจ ใจดี", report: "ไฟล์ไม่ทำงาน", more: "ไฟล์เปิดไม่ได้ค่ะ" },
  { id: 8, name: "Facebook Website", creator: "สมศรี", report: "ไม่ตรงปก", more: "ไม่สวย" },
];

const Detail: React.FC = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const project = projects.find((p) => p.id === Number(id));

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

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FBFBFB]">
      <Header />
      <div className="lg:mx-10 lg:mt-10 lg:mb-10 mt-10 mb-10 mx-1">
        <div key={project.id} className="mb-4 p-4 lg:ml-10 ml-2">
          <h2 className="text-xl font-bold mb-10 ">รายงานบล็อก {project.name}</h2>
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
          onClick={handleSubmit}
          className="w-full p-2 text-white rounded mt-6"
          style={{ backgroundColor: "#33539B" }}
        >
          ลบคำร้อง
        </button>
        <button
          onClick={handleSubmit1}
          className="w-full p-2 text-white rounded mt-4"
          style={{ backgroundColor: "#1976D2" }}
        >
          ติดต่อเจ้าของโครงงาน/บล็อก
        </button>
        <button
          onClick={handleSubmit2}
          className="w-full p-2 text-white rounded mt-4"
          style={{ backgroundColor: "#9B3933" }}
        >
          ลบโครงงาน/บล็อก
        </button>
      </div>
    </div>
  );
};

export default Detail;
