"use client";

import Header from "../../component/Header";
import React from 'react';
import { useSearchParams } from 'next/navigation';

const Detail: React.FC = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const name = searchParams.get("name");
  const username = searchParams.get("username");
  const report = searchParams.get("report");
  const more = searchParams.get("more");
  const createdAt = searchParams.get("createdAt");

  // Function to format date
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
      const response = await fetch('/api/getreportproject/delete', {
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
    alert("Button 2 clicked");
    // Add your specific logic here
  };

  const handleSubmit3 = () => {
    alert("Button 3 clicked");
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
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-bold mb-5">รายงานบล็อก {name || ""}</h2>
              <h3 className="text-lg text-gray-700 mb-2">โดย คุณ {username || ""}</h3>
              <h4 className="text-xl font-bold mb-2">คำร้อง</h4>
              <p className="text-lg text-gray-700 mb-2">{report || ""}</p>
              <h4 className="text-xl font-bold mb-2">ข้อความเพิ่มเติม</h4>
              <p className="text-lg text-gray-700 mb-2">{more || ""}</p>
              <h4 className="text-xl font-bold mb-2">วันที่/เวลา</h4>
              <p className="text-lg text-gray-700 mb-4">{formatDate(createdAt)}</p>
            </div>

            {/* Buttons */}
            <div className="mt-6 flex flex-col gap-4">
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
        </div>
      </main>
    </div>
  );
};

export default Detail;
