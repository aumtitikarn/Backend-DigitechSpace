"use client";

import Header from "../../component/Header";
import React from 'react';
import { useSearchParams } from 'next/navigation';

const Detail: React.FC = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const blogname = searchParams.get("blogname");
  const username = searchParams.get("username");
  const report = searchParams.get("report");
  const selectedReason = searchParams.get("selectedReason");
  const createdAt = searchParams.get("createdAt");

  const formatDate = (timestamp: string | null) => {
    if (!timestamp) return '';
    const date = new Date(timestamp); 
    return date.toLocaleString("th-TH", {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const handleSubmit1 = async (id: string | null) => {
    if (!id) {
      alert("Report ID is missing");
      return;
    }
  
    const confirmDeletion = confirm("Are you sure you want to delete this report?");
    if (!confirmDeletion) return;
  
    try {
      const response = await fetch('/api/getreportblog/delet', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }), // Send the id of the report to be deleted
      });
  
      if (response.ok) {
        alert("Report deleted successfully");
        // Add any additional logic, like updating the UI or redirecting
      } else {
        const data = await response.json();
        alert(`Failed to delete report: ${data.msg}`);
      }
    } catch (error) {
      console.error("Error deleting report:", error);
      alert("An error occurred while deleting the report.");
    }
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
            <h2 className="text-xl font-bold mb-10">รายงานบล็อก {blogname || ""}</h2>
            <h3 className="text-lg text-gray-700 mb-4">โดย คุณ {username || ""}</h3>
            <h4 className="text-xl font-bold mb-4">คำร้อง</h4>
            <p className="text-lg text-gray-700 mb-4">{report || ""}</p>
            <h4 className="text-xl font-bold mb-4">ข้อความเพิ่มเติม</h4>
            <p className="text-lg text-gray-700 mb-4">{selectedReason || ""}</p>
            <h4 className="text-xl font-bold mb-4">วันที่/เวลา</h4>
            <p className="text-lg text-gray-700 mb-4">{formatDate(createdAt)}</p>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex flex-col gap-4 lg:w-2/3 mx-auto">
            <button
             onClick={() => handleSubmit1(id)}
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
