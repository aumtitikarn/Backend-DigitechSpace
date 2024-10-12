"use client";

import Header from "../../component/Header";
import React from 'react';
import { useSearchParams } from 'next/navigation';
import Swal from 'sweetalert2';

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
      Swal.fire({
        icon: 'error',
        title: 'ข้อผิดพลาด',
        text: 'ไม่พบรหัสรายงาน',
      });
      return;
    }
  
    const result = await Swal.fire({
      title: 'คุณต้องการลบคำร้องนี้ใช่หรือไม่?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ใช่, ลบเลย!',
      cancelButtonText: 'ยกเลิก'
    });
  
    if (result.isConfirmed) {
      try {
        const response = await fetch('/api/getreportproject/delete', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id }),
        });
  
        if (response.ok) {
          Swal.fire(
            'ลบแล้ว!',
            'รายงานถูกลบเรียบร้อยแล้ว',
            'success'
          );
          // Add any additional logic, like updating the UI or redirecting
        } else {
          const data = await response.json();
          Swal.fire({
            icon: 'error',
            title: 'เกิดข้อผิดพลาด',
            text: `ไม่สามารถลบรายงานได้: ${data.msg}`,
          });
        }
      } catch (error) {
        console.error("Error deleting report:", error);
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: 'เกิดข้อผิดพลาดในการลบรายงาน',
        });
      }
    }
  };

  const handleSubmit2 = async (id: string | null) => {
    if (!id) {
      Swal.fire({
        icon: 'error',
        title: 'ข้อผิดพลาด',
        text: 'ไม่พบรหัสบล็อก',
      });
      return;
    }

    if (!email || !author) {
      Swal.fire({
        icon: 'error',
        title: 'ข้อผิดพลาด',
        text: 'ไม่พบอีเมลหรือชื่อผู้เขียน',
      });
      return;
    }

    const result = await Swal.fire({
      title: 'คุณต้องการติดต่อเจ้าของโครงงานใช่หรือไม่?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ใช่, ติดต่อเลย!',
      cancelButtonText: 'ยกเลิก'
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`/api/getreportproject`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id, email, author, name, username, report, more,
          }),
        });

        if (response.ok) {
          Swal.fire(
            'ส่งแล้ว!',
            'ส่งอีเมลถึงเจ้าของโครงงานเรียบร้อยแล้ว!',
            'success'
          );
        } else {
          const data = await response.json();
          Swal.fire({
            icon: 'error',
            title: 'เกิดข้อผิดพลาด',
            text: `ไม่สามารถส่งอีเมลได้: ${data.msg}`,
          });
        }
      } catch (error) {
        console.error("Error contacting project owner:", error);
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: 'เกิดข้อผิดพลาดในการติดต่อเจ้าของโครงงาน',
        });
      }
    }
  };

  const handleSubmit3 = async (projectId: string | null) => {
    if (!projectId) {
      Swal.fire({
        icon: 'error',
        title: 'ข้อผิดพลาด',
        text: 'ไม่พบรหัสโครงงาน',
      });
      return;
    }

    const result = await Swal.fire({
      title: "คุณต้องการลบบล็อกนี้ใช่หรือไม่?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ใช่, ลบเลย!',
      cancelButtonText: 'ยกเลิก'
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`/api/getreportproject`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ projectId }),
        });

        if (response.ok) {
          Swal.fire(
            'ลบแล้ว!',
            'โครงงานถูกลบเรียบร้อยแล้ว',
            'success'
          );
          window.location.reload();
        } else {
          const data = await response.json();
          Swal.fire({
            icon: 'error',
            title: 'เกิดข้อผิดพลาด',
            text: `ไม่สามารถลบโครงงานได้: ${data.msg}`,
          });
        }

        const notificationMessage = `Your project was deleted because: ${report}`;
        const notificationResponse = await fetch('/api/notification', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            email,
            notificationValue: notificationMessage 
          }),
        });
        
        if (!notificationResponse.ok) {
          const notificationData = await notificationResponse.json();
          console.error("ไม่สามารถส่งการแจ้งเตือนได้:", notificationData);
        }
        
      } catch (error) {
        console.error("Error deleting project:", error);
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: 'เกิดข้อผิดพลาดในการลบโครงงาน',
        });
      }
    }
  };

  

  return (
    <div className="flex flex-col min-h-screen bg-[#FBFBFB] overflow-hidden text-black">
      <Header />
      <main className="flex-grow">
        <div className="flex items-center justify-center  my-10">
          <div className="w-auto lg:w-[878px] h-auto flex-shrink-0 rounded-2xl border border-[#D0D8E9] bg-white shadow-[0px_0px_60.1px_-16px_#D9DDE5]">
            <div className="p-10">
                  <div className=" mb-5">
                    <div className="text-center">
                      <p className="font-bold mb-2 text-[#213766E5] text-[35px]">
                        รายงานโครงงาน
                      </p>
                      <h3 className="text-[18px]  mb-2 text-[#5D76AD] font-semibold">
                      {name || "N/A"}
                      </h3>
                      <h3 className="text-[16px]  mb-2 text-[#5D76AD]">
                        โดย คุณ {username || "N/A"}
                      </h3>
                    </div>
                    <div className="mt-10">
                      <p className="text-[#6C7996A6] text-[16px] mb-1">
                        เหตุผลที่รายงาน
                      </p>
                      <div className="mt-3 w-full h-[50px] px-4 flex items-center rounded-[9px] border border-[rgba(208,216,233,0.41)] bg-[#F5F5F6] text-[#5D76AD]">
                      {report || "N/A"}
                      </div>
                      <p className="mt-5 text-[#6C7996A6] text-[16px] mb-1">
                        ข้อความเพิ่มเติม
                      </p>
                      <div className="mt-3 w-full h-auto p-3 flex items-center rounded-[9px] border border-[rgba(208,216,233,0.41)] bg-[#F5F5F6] text-[#5D76AD]">
                      {more || "N/A"}
                      </div>
                      <p className="mt-5 text-[#6C7996A6] text-[16px] mb-1">
                        วันที่/เวลา
                      </p>
                      <div className="mt-3 w-full h-[50px] px-4 flex items-center rounded-[9px] border border-[rgba(208,216,233,0.41)] bg-[#F5F5F6] text-[#5D76AD]">
                      {formatDate(createdAt)}
                      </div>
                    </div>
                    <div className="flex justify-center mt-10">
                      <div className="flex item-center space-x-[30px]">
                        <button
                          onClick={() => handleSubmit1(id)}
                          className="w-[172px] h-[66px] flex-shrink-0 rounded-[10px] border border-[#B7CCFC] bg-white text-[#213766E5] font-semibold flex items-center justify-center hover:bg-[#F0F5FF] transition-colors duration-300"
                        >
                         <p className="text-[#5D76AD]">ลบคำร้อง</p>
                        </button>
                        <button
                          onClick={() => handleSubmit3(projectId)}
                          className="w-[172px] h-[66px] flex-shrink-0 rounded-[10px] bg-[#5D76AD] text-white font-semibold flex items-center justify-center hover:bg-[#4A5F8C] transition-colors duration-300"
                        >
                          ลบโครงงาน
                        </button>
                      </div>
                    </div>
                    <div className="text-center mt-5">
                    <u className="text-[#80A1EB] hover:text-[#B7CCFC]" onClick={() => handleSubmit2(id)}>ติดต่อเจ้าของโครงงาน</u>
                    </div>
                  </div>
            </div>
          </div>
        </div>
      </main>
    </div>
    // <div className="flex flex-col min-h-screen bg-[#FBFBFB] overflow-hidden">
    //   <Header />
    //   <main className="flex-grow">
    //     <div className="lg:mx-60 mt-10 mb-5 mx-20">
    //       {/* Container for content and buttons */}
    //       <div className="w-full mt-2 lg:w-2/3 mx-auto">
    //         {/* Content */}
    //         <div className="flex flex-col gap-4">
    //           <h2 className="text-xl font-bold mb-5 text-black">รายงานโครงงาน {name || ""}</h2>
    //           <h3 className="text-lg text-gray-700 mb-2 text-black">โดย คุณ {username || ""}</h3>
    //           <h4 className="text-xl font-bold mb-2 text-black">คำร้อง</h4>
    //           <p className="text-lg text-gray-700 mb-2 text-black">{report || ""}</p>
    //           <h4 className="text-xl font-bold mb-2 text-black">ข้อความเพิ่มเติม</h4>
    //           <p className="text-lg text-gray-700 mb-2 text-black">{more || ""}</p>
    //           <h4 className="text-xl font-bold mb-2 text-black">ข้อมูลเจ้าของโครงงาน</h4>
    //           <p className="text-lg text-gray-700 mb-2 text-black">ชื่อ: {author || ""}</p>
    //           <p className="text-lg text-gray-700 mb-2 text-black">อีเมล: {email || ""}</p>
    //           <h4 className="text-xl font-bold mb-2 text-black">วันที่/เวลา</h4>
    //           <p className="text-lg text-gray-700 mb-4 text-black">{formatDate(createdAt)}</p>
    //         </div>

    //         {/* Buttons */}
    //         <div className="mt-6 flex flex-col gap-4">
    //           <button
    //             onClick={() => handleSubmit1(id)}
    //             className="w-full p-2 text-white rounded"
    //             style={{ backgroundColor: "#33539B" }}
    //           >
    //             ลบคำร้อง
    //           </button>
    //           <button
    //              onClick={() => handleSubmit2(id)}
    //             className="w-full p-2 text-white rounded"
    //             style={{ backgroundColor: "#1976D2" }}
    //           >
    //             ติดต่อเจ้าของโครงงาน/บล็อก
    //           </button>
    //           <button
    //             onClick={() => handleSubmit3(projectId)}
    //             className="w-full p-2 text-white rounded"
    //             style={{ backgroundColor: "#9B3933" }}
    //           >
    //             ลบโครงงาน/บล็อก
    //           </button>
    //         </div>
    //       </div>
    //     </div>
    //   </main>
    // </div>
  );
};

export default Detail;
