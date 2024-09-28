"use client";

import React from "react";
import Header from "../../component/Header";
import { useSearchParams } from "next/navigation";

const Blog: React.FC = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const id = searchParams.get("_id");
  const report = searchParams.get("report");
  const username = searchParams.get("username");

  const handleSubmit1 = async (id: string | null, email: string | null, report: string) => {
    if (!id) {
        alert("Report ID is missing");
        return;
    }

    const confirmDeletion = confirm("Are you sure you want to delete this report?");
    if (!confirmDeletion) return;

    if (!email) {
        alert("Email is missing");
        return;
    }

    // สร้างข้อความแจ้งเตือน
    const notificationMessage = `We have received your report and we will take action as soon as possible.`;

    try {
        // ส่งข้อความแจ้งเตือนก่อน
        const notificationResponse = await fetch('/api/notification', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email, // รับ email จาก session
                notificationValue: notificationMessage, // ส่งข้อความแจ้งเตือนด้วยชื่อฟิลด์ที่ถูกต้อง
            }),
        });

        // Check for notification success
        if (!notificationResponse.ok) {
            const notificationData = await notificationResponse.json();
            console.error("Failed to send notification:", notificationData);
            alert(`Failed to send notification: ${notificationData.error}`);
            return; // Stop if notification fails
        }

        // Proceed to delete the report if notification is successful
        const deleteResponse = await fetch('/api/getreportservice/delete', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id }), // Sending report ID
        });

        // Handle delete response
        if (deleteResponse.ok) {
            alert("Report deleted successfully");
        } else {
            const data = await deleteResponse.json();
            alert(`Failed to delete report: ${data.msg}`);
        }
    } catch (error) {
        console.error("Error during deletion process:", error);
        alert("An error occurred while processing your request.");
    }
};

  

  return (
    <div className="flex flex-col min-h-screen bg-[#FBFBFB] overflow-hidden">
      <Header />
      <main className="flex-grow">
        <div className="lg:mx-60 mt-10 mb-5 mx-20">
          <div className="w-full mt-2 lg:w-2/3 mx-auto">
            <div className="flex flex-col gap-4">
              <h1 className="text-lg font-bold mt-5 mb-5 text-black" style={{ fontSize: "32px" }}>คำร้องปัญหาของผู้ใช้</h1>
              <p className="mt-4 text-lg text-black">โดย {username}</p>
              <div className="flex flex-col w-full">
                <h1 className="text-lg font-bold mt-4 text-black" style={{ fontSize: "24px" }}>ปัญหา</h1>
                <p className="mt-2 text-lg text-black">{report}</p>
                <h1 className="text-lg font-bold mt-4 text-black" style={{ fontSize: "24px" }}>อีเมล</h1>
                <p className="mt-2 text-lg text-black">{email}</p>
                <div className="mt-10">
                  <button
                    onClick={() => handleSubmit1(id, email, "Your report has been successfully deleted.")}
                    className="w-full p-2 text-white rounded mt-6"
                    style={{ backgroundColor: "#33539B" }}
                  >
                    ลบคำร้อง
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Blog;
