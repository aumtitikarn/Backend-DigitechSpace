"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation"; // Ensure you import this if you want to use it
import Header from "../../component/Header";
import Link from "next/link";

const Detail: React.FC = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const username = searchParams.get("username");
  const name = searchParams.get("name");
  const phonenumber = searchParams.get("phonenumber");
  const email = searchParams.get("email");

  // เพิ่ม state สำหรับข้อความ
  const [message, setMessage] = useState<string>("");

  const handleSubmit2 = async () => {
    if (!id || !email || !message) { // Ensure message is included
      alert("Blog ID, email, or message is missing");
      return;
    }

    const confirmed = confirm("Are you sure you want to contact the project owner?");
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/normoluser/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          name: name,  // You can replace this with the actual name if available
          email: email, 
          message: message // Use the message from state
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Error contacting project owner:", error);
      alert("An error occurred while contacting the project owner.");
    }
};


  return (
    <div className="flex flex-col min-h-screen bg-[#FBFBFB] overflow-hidden">
      <Header />
      <main className="flex-grow">
        <div className="lg:mx-60 mt-10 mb-5">
          <div className="flex items-center justify-center lg:mb-10 mb-10">
            <div className="rounded-full bg-gray-400 h-20 w-20 flex items-center justify-center">
              <svg className="h-10 w-10 text-gray-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
          </div>
          <div className="w-full mt-2 lg:w-2/3 mx-auto">
            <h2 className="text-xl font-bold mb-2 text-black">รายละเอียดของข้อมูลผู้ใช้</h2>
            <p className="text-lg text-gray-700 mb-1 text-black">ชื่อผู้ใช้: {username || ""}</p>
            <p className="text-lg text-gray-700 mb-1 text-black">อีเมล: {email || ""}</p>
            <p className="text-lg text-gray-700 mb-1 text-black">ชื่อ-นามสกุล: {name || ""}</p>
            <p className="text-lg text-gray-700 mb-1 text-black">เบอร์โทรศัพท์: {phonenumber || ""}</p>

            <div className="mt-6">
              <p className="text-sm mt-20">ส่งเมลเฉพาะผู้ใช้</p>
              <textarea
                className="w-full h-28 border border-gray-400 p-2 rounded-md"
                placeholder="ข้อความ"
                value={message} // เชื่อมต่อกับ state
                onChange={(e) => setMessage(e.target.value)} // อัปเดต message เมื่อเปลี่ยนแปลง
              ></textarea>
              <button onClick={handleSubmit2} className="w-full mt-2 bg-blue-600 text-white p-2 rounded-md">
                ส่งเมล
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Detail;
