"use client";

import Header from "../../component/Header";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Swal from 'sweetalert2';

interface BlogPost {
  _id: string;
  email: string;
  report: string;
  username: string;
  createdAt: string;
  title: string;
}

const Detail: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [postSers, setPostSers] = useState<BlogPost[]>([]);

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
        const res = await fetch(`/api/getreportservice/${id}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          });

        const response = await fetch("/api/getreportservice/delete", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        });
  
        if (response.ok && res.ok) {
          Swal.fire('Deleted!', 'Report deleted successfully', 'success');
          router.push("/ReportService");
        } else {
          const data = await response.json();
          const errorMessage = data.msg || 'Unknown error occurred';
          Swal.fire('Error', `Failed to delete report: ${errorMessage}`, 'error');
        }
      } catch (error) {
        console.error("Error deleting report:", error);
        Swal.fire('Error', 'An error occurred while deleting the report.', 'error');
      }
    }
  };

  useEffect(() => {
    const fetchBlogs = async () => {
      if (!id) return;

      try {
        const response = await fetch(`/api/getreportservice/${id}`, {
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
            setPostSers(data.post);
        } else if (data.post) {
            setPostSers([data.post]);
        } else {
            setPostSers([]);
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
              {postSers.length > 0 ? (
                postSers.map((ser) => (
                  <div className=" mb-5" key={ser._id}>
                    <div className="text-center">
                      <p className="font-bold mb-2 text-[#213766E5] text-[35px]">
                        รายงานปัญหา
                      </p>
                      <h3 className="text-[16px]  mb-2 text-[#5D76AD]">
                        โดย คุณ {ser.username || ""}
                      </h3>
                    </div>
                    <div className="mt-10">
                      <p className="mt-5 text-[#6C7996A6] text-[16px] mb-1">
                        ปัญหา
                      </p>
                      <div className="mt-3 w-full h-auto p-3 flex items-center rounded-[9px] border border-[rgba(208,216,233,0.41)] bg-[#F5F5F6] text-[#5D76AD]">
                        {ser.report || ""}
                      </div>
                      <p className="mt-5 text-[#6C7996A6] text-[16px] mb-1">
                        อีเมล
                      </p>
                      <div className="mt-3 w-full h-auto p-3 flex items-center rounded-[9px] border border-[rgba(208,216,233,0.41)] bg-[#F5F5F6] text-[#5D76AD]">
                        {ser.email || ""}
                      </div>
                      <p className="mt-5 text-[#6C7996A6] text-[16px] mb-1">
                        วันที่/เวลา
                      </p>
                      <div className="mt-3 w-full h-auto p-3 flex items-center rounded-[9px] border border-[rgba(208,216,233,0.41)] bg-[#F5F5F6] text-[#5D76AD]">
                        {formatDate(ser.createdAt)}
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
                      </div>
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
