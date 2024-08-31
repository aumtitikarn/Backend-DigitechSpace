"use client";

import Header from "../../component/Header";
import React from 'react';
import { useSearchParams } from 'next/navigation';

interface Project {
  id: number;
  name: string;
  creator: string;
  report: string;
  more: string;
}

const Detail: React.FC = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const name = searchParams.get("name");
  const creator = searchParams.get("creator");
  const report = searchParams.get("report");
  const more = searchParams.get("more");
  const time = searchParams.get("time");

  const handleSubmit1 = () => {
    alert("ลบคำร้อง");
    // Add your specific logic here
  };

  const handleSubmit2 = () => {
    alert("ติดต่อเจ้าของโครงงาน/บล็อก");
    // Add your specific logic here
  };

  const handleSubmit3 = () => {
    alert("ลบโครงงาน/บล็อก");
    // Add your specific logic here
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FBFBFB] overflow-hidden">
      <Header />
      <main className="flex-grow">
        <div className="lg:mx-60 mt-10 mb-5">
          {/* Container for content and buttons */}
          <div className="w-full mt-2 lg:w-2/3 mx-auto">
            {/* Content */}
            <h2 className="text-xl font-bold mb-10">รายงานบล็อก {name || ""}</h2>
            <h3 className="text-lg text-gray-700 mb-4">โดย คุณ {creator || ""}</h3>
            <h4 className="text-xl font-bold mb-4">คำร้อง</h4>
            <p className="text-lg text-gray-700 mb-4">{report || ""}</p>
            <h4 className="text-xl font-bold mb-4">ข้อความเพิ่มเติม</h4>
            <p className="text-lg text-gray-700 mb-4">{more || ""}</p>
            <h4 className="text-xl font-bold mb-4">วันที่/เวลา</h4>
            <p className="text-lg text-gray-700 mb-4">{time || ""}</p>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex flex-col gap-4 lg:w-2/3 mx-auto">
            <button
              onClick={handleSubmit1}
              className="w-full p-2 text-white rounded"
              style={{ backgroundColor: "#33539B" }}
            >
              ลบคำร้อง
            </button>
            <button
              onClick={handleSubmit2}
              className="w-full p-2 text-white rounded"
              style={{ backgroundColor: "#1976D2" }}
            >
              ติดต่อเจ้าของโครงงาน/บล็อก
            </button>
            <button
              onClick={handleSubmit3}
              className="w-full p-2 text-white rounded"
              style={{ backgroundColor: "#9B3933" }}
            >
              ลบโครงงาน/บล็อก
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Detail;
