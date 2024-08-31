"use client";

import Header from "../../component/Header";
import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';

const Detail: React.FC = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const name = searchParams.get("name");
  const creator = searchParams.get("creator");
  const time = searchParams.get("time");
  const bank = searchParams.get("bank");
  const numberbank = searchParams.get("numberbank");
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
        <div className="lg:mx-64 lg:mt-10 lg:mb-10 mt-10 mb-10 mx-5">
          <div className="flex flex-col justify-center w-full lg:w-2/3 mx-auto">
            <h1 className="text-lg font-bold mt-5 mb-5 text-black" style={{ fontSize: "36px" }}>คำร้องขอถอนเงิน</h1>
            <p className="mt-2 text-lg">โดย {name || ""}</p>

            <h1 className="text-xl font-bold mt-4" style={{ fontSize: "24px" }}>จำนวนเงิน</h1>
            <p className="mt-2 text-lg">{creator || ""}</p>
            
            <h1 className="text-xl font-bold mt-4" style={{ fontSize: "24px" }}>ธนาคารใช้รับรายได้</h1>
            <p className="mt-2 text-lg">{bank || ""}</p>

            <h1 className="text-xl font-bold mt-4" style={{ fontSize: "24px" }}>เลขบัญชี</h1>
            <p className="mt-2 text-lg">{numberbank || ""}</p>

            {/* Buttons */}
            <div className="mt-6 flex flex-col gap-4">
              <button
                onClick={handleSubmit}
                className="w-full p-2 text-white rounded"
                style={{ backgroundColor: "#33539B" }}
              >
                เสร็จสิ้น
              </button>
              <button
                onClick={handleSubmit1}
                className="w-full p-2 text-white rounded"
                style={{ backgroundColor: "#1976D2" }}
              >
                ติดต่อผู้ถอน
              </button>
              <button
                onClick={handleSubmit2}
                className="w-full p-2 text-white rounded"
                style={{ backgroundColor: "#9B3933" }}
              >
                ลบคำร้อง
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Detail;
