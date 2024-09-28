"use client";

import Header from "../../component/Header";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Swal from 'sweetalert2';

interface BlogPost {
  _id: string;
  blogname: string;
  report: string;
  author: string;
  selectedReason: string;
  createdAt: string;
  title: string;
}

const Detail: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [postBlogs, setPostBlogs] = useState<BlogPost[]>([]);

  const formatDate = (timestamp: string | null) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const handleSubmit1 = async () => {
    if (!id) {
      Swal.fire('Error', 'Report ID is missing', 'error');
      return;
    }
  
    const result = await Swal.fire({
      title: 'คุณต้องการลบคำร้องนี้ใช่หรือไม่?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });
  
    if (result.isConfirmed) {
      try {
        const response = await fetch("/api/getreportblog/delet", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        });
  
        if (response.ok) {
          Swal.fire('Deleted!', 'Report deleted successfully', 'success');
          router.push("/Reportblog");
        } else {
          const data = await response.json();
          Swal.fire('Error', `Failed to delete report: ${data.msg}`, 'error');
        }
      } catch (error) {
        console.error("Error deleting report:", error);
        Swal.fire('Error', 'An error occurred while deleting the report.', 'error');
      }
    }
  };
  const handleSubmit2 = async () => {
    const result = await Swal.fire({
      title: 'ยืนยัน',
      text: "คุณต้องการติดต่อเจ้าของบล็อกหรือไม่?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ใช่',
      cancelButtonText: 'ไม่'
    });
  
    if (result.isConfirmed) {
      try {
        const response = await fetch(`/api/getreportblog/${id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
  
        if (response.ok) {
          const data = await response.json();
          const { blogEmail } = data.post;
          if (blogEmail) {
            const mailtoLink = `mailto:${blogEmail}?subject=Notification from DigitechSpace&body=`;
            window.location.href = mailtoLink;
          } else {
            Swal.fire('ข้อผิดพลาด', 'ไม่พบอีเมลของเจ้าของบล็อก', 'error');
          }
        } else {
          Swal.fire('ข้อผิดพลาด', 'ไม่สามารถดึงข้อมูลบล็อกได้', 'error');
        }
      } catch (error) {
        console.error("Error fetching blog details:", error);
        Swal.fire('ข้อผิดพลาด', 'เกิดข้อผิดพลาดในการดึงข้อมูลบล็อก', 'error');
      }
    }
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: 'คุณต้องการลบบล็อกนี้ใช่หรือไม่?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });
  
    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/getreportblog/${id}`, {
          method: "DELETE",
        });
  
        if (res.ok) {
          Swal.fire('Deleted!', 'โครงงานและบล็อกถูกลบเรียบร้อยแล้ว', 'success');
          router.push("/Reportblog");
        } else {
          const data = await res.json();
          Swal.fire('Error', `${data.message || "ลบไม่สำเร็จ"}`, 'error');
        }
      } catch (error) {
        console.error("Error deleting post:", error);
        Swal.fire('Error', 'มีข้อผิดพลาดในการลบโครงงาน/บล็อก', 'error');
      }
    }
  };
  useEffect(() => {
    const fetchBlogs = async () => {
      if (!id) return;

      try {
        const response = await fetch(`/api/getreportblog/${id}`, {
          method: "GET",
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error(`Error fetching blogs: ${errorData.message}`);
          return;
        }

        const data = await response.json();
        console.log("Fetched post:", data.post);

        if (Array.isArray(data.post)) {
          setPostBlogs(data.post);
        } else if (data.post) {
          setPostBlogs([data.post]);
        } else {
          setPostBlogs([]);
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    fetchBlogs();
  }, [id]);

  return (
    <div className="flex flex-col min-h-screen bg-[#FBFBFB] overflow-hidden text-black">
      <Header />
      <main className="flex-grow">
        <div className="flex items-center justify-center  my-10">
          <div className="w-auto lg:w-[878px] h-auto flex-shrink-0 rounded-2xl border border-[#D0D8E9] bg-white shadow-[0px_0px_60.1px_-16px_#D9DDE5]">
            <div className="p-10">
              {postBlogs.length > 0 ? (
                postBlogs.map((blog) => (
                  <div className=" mb-5" key={blog._id}>
                    <div className="text-center">
                      <p className="font-bold mb-2 text-[#213766E5] text-[35px]">
                        รายงานบล็อก
                      </p>
                      <h3 className="text-[18px] text-gray-700 mb-2 text-[#5D76AD] font-semibold">
                        {blog.blogname || ""}
                      </h3>
                      <h3 className="text-[16px] text-gray-700 mb-2 text-[#5D76AD]">
                        โดย คุณ {blog.author || ""}
                      </h3>
                    </div>
                    <div className="mt-10">
                      <p className="text-[#6C7996A6] text-[16px] mb-1">
                        เหตุผลที่รายงาน
                      </p>
                      <div className="mt-3 w-full h-[50px] px-4 flex items-center rounded-[9px] border border-[rgba(208,216,233,0.41)] bg-[#F5F5F6] text-[#5D76AD]">
                        {blog.selectedReason || "ไม่ระบุเหตุผล"}
                      </div>
                      <p className="mt-5 text-[#6C7996A6] text-[16px] mb-1">
                        ข้อความเพิ่มเติม
                      </p>
                      <div className="mt-3 w-full h-[50px] px-4 flex items-center rounded-[9px] border border-[rgba(208,216,233,0.41)] bg-[#F5F5F6] text-[#5D76AD]">
                        {blog.report || ""}
                      </div>
                      <p className="mt-5 text-[#6C7996A6] text-[16px] mb-1">
                        วันที่/เวลา
                      </p>
                      <div className="mt-3 w-full h-[50px] px-4 flex items-center rounded-[9px] border border-[rgba(208,216,233,0.41)] bg-[#F5F5F6] text-[#5D76AD]">
                        {formatDate(blog.createdAt)}
                      </div>
                    </div>
                    <div className="flex justify-center mt-10">
                      <div className="flex item-center space-x-[30px]">
                        <button
                          onClick={handleSubmit1}
                          className="w-[172px] h-[66px] flex-shrink-0 rounded-[10px] border border-[#B7CCFC] bg-white text-[#213766E5] font-semibold flex items-center justify-center hover:bg-[#F0F5FF] transition-colors duration-300"
                        >
                         <p className="text-[#5D76AD]">ลบคำร้อง</p>
                        </button>
                        <button
                          onClick={handleDelete}
                          className="w-[172px] h-[66px] flex-shrink-0 rounded-[10px] bg-[#5D76AD] text-white font-semibold flex items-center justify-center hover:bg-[#4A5F8C] transition-colors duration-300"
                        >
                          ลบบล็อก
                        </button>
                      </div>
                    </div>
                    <div className="text-center mt-5">
                    <u className="text-[#80A1EB] hover:text-[#B7CCFC]" onClick={handleSubmit2}>ติดต่อเจ้าของบล็อก</u>
                    </div>
                  </div>
                ))
              ) : (
                <p>No blogs available</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Detail;
