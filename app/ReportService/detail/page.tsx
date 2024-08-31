"use client";

import React, { useState } from "react";
import Header from "../../component/Header";
import { useSearchParams } from "next/navigation";

interface PostData {
  id: number;
  name: string;
  creator: string;
  report: string;
  time: string;
}

function Blog() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const name = searchParams.get("name");
  const creator = searchParams.get("creator");
  const report = searchParams.get("report");
  const time = searchParams.get("time");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupInput, setPopupInput] = useState("");

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const handlePopupSubmit = () => {
    alert(`Popup Input: ${popupInput}`);
    setPopupInput("");
    setIsPopupOpen(false);
  };

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

  return (
    <div className="flex flex-col min-h-screen bg-[#FBFBFB] overflow-hidden">
      <Header />
      <main className="flex-grow">
        <div className="lg:mx-60 mt-10 mb-5">
          <div className="w-full mt-2 lg:w-2/3 mx-auto">
            <h1 className="text-lg font-bold mt-5 mb-5 text-black" style={{ fontSize: "36px" }}>
              คำร้องปัญหาของผู้ใช้
            </h1>
            <p className="mt-2 text-lg">โดย {name || ""}</p>
            <h1 className="text-lg font-bold mt-4" style={{ fontSize: "24px" }}>ปัญหา</h1>
            <p className="mt-2 text-lg">{report || ""}</p>
            <h1 className="text-lg font-bold mt-4" style={{ fontSize: "24px" }}>อีเมล</h1>
            <p className="mt-2 text-lg">{creator || ""}</p>
            <h1 className="text-xl font-bold mt-4" style={{ fontSize: "24px" }}>วันที่/เวลา</h1>
            <p className="mt-2 text-lg">{time || ""}</p>

            {/* Buttons */}
            <div className="mt-6 flex flex-col gap-4">
              <button
                onClick={handleSubmit}
                className="w-full p-2 text-white rounded"
                style={{ backgroundColor: "#33539B" }}
              >
                ลบคำร้อง
              </button>
              <button
                onClick={handleSubmit1}
                className="w-full p-2 text-white rounded"
                style={{ backgroundColor: "#1976D2" }}
              >
                ติดต่อเจ้าของโครงงาน/บล็อก
              </button>
              <button
                onClick={handleSubmit2}
                className="w-full p-2 text-white rounded"
                style={{ backgroundColor: "#9B3933" }}
              >
                ลบโครงงาน/บล็อก
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Blog;
