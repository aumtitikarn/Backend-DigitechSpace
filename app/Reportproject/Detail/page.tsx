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
  const email = searchParams.get("email");
  const author = searchParams.get("author");
  const projectId = searchParams.get("projectId");
 

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
  const handleSubmit2 = async (id: string | null) => {
    if (!id) {
        alert("Blog ID is missing");
        return;
    }

    if (!email || !author) {
        alert("Email or Author is missing");
        return;
    }

    const confirmed = confirm("Are you sure ?");
    if (!confirmed) return;

    try {
        const response = await fetch(`/api/getreportproject`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id,       // ID ของโปรเจกต์
                email,    // อีเมลของเจ้าของโปรเจกต์
                author,   // ชื่อของผู้ติดต่อ
                name,     // ชื่อผู้ติดต่อ (ถ้ามี)
                username, // ชื่อผู้ใช้ (ถ้ามี)
                report,   // รายงาน (ถ้ามี)
                more,     // ข้อมูลเพิ่มเติม (ถ้ามี)
            }),
        });

        if (response.ok) {
            alert("Email sent to the project owner successfully!");
        } else {
            const data = await response.json();
            alert(`Failed to send email: ${data.msg}`);
        }
    } catch (error) {
        console.error("Error contacting project owner:", error);
        alert("An error occurred while contacting the project owner.");
    }
};


  const handleSubmit3 = async (projectId: string | null) => {
    if (!projectId) {
        alert("Project ID is missing");
        return;
    }

    const confirmDeletion = confirm("Are you sure you want to delete this project?");
    if (!confirmDeletion) return;

    try {
        const response = await fetch(`/api/getreportproject`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ projectId }), // ส่ง projectId ของโปรเจกต์ที่จะถูกลบ
        });

        if (response.ok) {
            alert("Project deleted successfully");
            window.location.reload(); // รีโหลดหน้าเมื่อการลบสำเร็จ
        } else {
            const data = await response.json();
            alert(`Failed to delete project: ${data.msg}`);
        }
        const notificationMessage = `Your project was deleted due to: ${report}`; 

        const notificationResponse = await fetch('/api/notification', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                email,  // รับ email จาก sessions
                notificationValue: notificationMessage 
            }), // ส่ง email และ notificationMessage
        });
        
        if (!notificationResponse.ok) {
            const notificationData = await notificationResponse.json();
            console.error("Failed to send notification:", notificationData);
        }
        
    } catch (error) {
        console.error("Error deleting project:", error);
        alert("An error occurred while deleting the project.");
    }
};


  

  return (
    <div className="flex flex-col min-h-screen bg-[#FBFBFB] overflow-hidden">
      <Header />
      <main className="flex-grow">
        <div className="lg:mx-60 mt-10 mb-5 mx-20">
          {/* Container for content and buttons */}
          <div className="w-full mt-2 lg:w-2/3 mx-auto">
            {/* Content */}
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-bold mb-5 text-black">รายงานโครงงาน {name || ""}</h2>
              <h3 className="text-lg text-gray-700 mb-2 text-black">โดย คุณ {username || ""}</h3>
              <h4 className="text-xl font-bold mb-2 text-black">คำร้อง</h4>
              <p className="text-lg text-gray-700 mb-2 text-black">{report || ""}</p>
              <h4 className="text-xl font-bold mb-2 text-black">ข้อความเพิ่มเติม</h4>
              <p className="text-lg text-gray-700 mb-2 text-black">{more || ""}</p>
              <h4 className="text-xl font-bold mb-2 text-black">ข้อมูลเจ้าของโครงงาน</h4>
              <p className="text-lg text-gray-700 mb-2 text-black">ชื่อ: {author || ""}</p>
              <p className="text-lg text-gray-700 mb-2 text-black">อีเมล: {email || ""}</p>
              <h4 className="text-xl font-bold mb-2 text-black">วันที่/เวลา</h4>
              <p className="text-lg text-gray-700 mb-4 text-black">{formatDate(createdAt)}</p>
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
                 onClick={() => handleSubmit2(id)}
                className="w-full p-2 text-white rounded"
                style={{ backgroundColor: "#1976D2" }}
              >
                ติดต่อเจ้าของโครงงาน/บล็อก
              </button>
              <button
                onClick={() => handleSubmit3(projectId)}
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
