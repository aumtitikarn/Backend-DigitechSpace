"use client";

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from "../../component/Header";

interface BlogPost {
  _id: string;
}
interface BlogPostArray extends Array<BlogPost> {}

// Loading Component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

// Main Content Component
const DetailContent = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const blogname = searchParams.get("blogname");
  const username = searchParams.get("username");
  const report = searchParams.get("report");
  const selectedReason = searchParams.get("selectedReason");
  const createdAt = searchParams.get("createdAt");

  const [userEmail, setUserEmail] = useState<string>('');
  const [blogemail, setBlogemail] = useState<string>('');
  const [postBlog, setPostBlogs] = useState<BlogPostArray>([]);

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
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        alert("Report deleted successfully");
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

    const confirmed = confirm("Are you sure?");
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/getreportblog/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const blogData = await response.json();
        setBlogemail(blogData.blogEmail);
        const { blogEmail } = blogData;
        const mailtoLink = `mailto:${blogEmail}?subject=Notification form DigitechSpace&body=`;
        window.location.href = mailtoLink;
      } else {
        alert("Failed to fetch blog details.");
      }
    } catch (error) {
      console.error("Error fetching blog details:", error);
      alert("An error occurred while fetching blog details.");
    }
  };

  const handleDelete = async (id: string): Promise<void> => {
    const confirmed = confirm("Are you sure?");

    if (confirmed) {
      try {
        const res = await fetch(`/api/getreportblog/${id}`, {
          method: "DELETE",
        });

        if (res.ok) {
          setPostBlogs((prevPostBlogs) => 
            prevPostBlogs.filter((blog) => blog._id !== id)
          );
          alert("ลบโครงงานและบล็อกเรียบร้อยแล้ว");
        } else {
          const data = await res.json();
          alert(`Error: ${data.message || "ลบไม่สำเร็จ"}`);
        }
      } catch (error) {
        console.error("Error deleting post:", error);
        alert("มีข้อผิดพลาดในการลบโครงงาน/บล็อก");
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FBFBFB] overflow-hidden text-black">
      <Header />
      <main className="flex-grow">
        <div className="lg:mx-60 mt-10 mb-5 mx-20">
          <div className="w-full mt-2 lg:w-2/3 mx-auto">
            <h2 className="text-xl font-bold mb-10">รายงานบล็อก {blogname || ""}</h2>
            <h3 className="text-lg text-gray-700 mb-4">โดย คุณ {username || ""}</h3>
            <h4 className="text-xl font-bold mb-4">คำร้อง</h4>
            <p className="text-lg text-gray-700 mb-4">{report || ""}</p>
            <h4 className="text-xl font-bold mb-4">ข้อความเพิ่มเติม</h4>
            <p className="text-lg text-gray-700 mb-4">{selectedReason || ""}</p>
            <h4 className="text-xl font-bold mb-4">วันที่/เวลา</h4>
            <p className="text-lg text-gray-700 mb-4">{formatDate(createdAt)}</p>
          </div>

          <div className="mt-6 flex flex-col gap-4 lg:w-2/3 mx-auto">
            <button
              onClick={() => handleSubmit1(id)}
              className="w-full p-2 text-white rounded bg-[#33539B] hover:bg-[#264176] transition-colors"
            >
              ลบคำร้อง
            </button>
            <button
              onClick={() => handleSubmit2(id)}
              className="w-full p-2 text-white rounded bg-[#1976D2] hover:bg-[#1565C0] transition-colors"
            >
              ติดต่อเจ้าของโครงงาน/บล็อก
            </button>
            <button
              onClick={() => id && handleDelete(id)}
              className="w-full p-2 text-white rounded bg-[#9B3933] hover:bg-[#7A2C27] transition-colors"
            >
              ลบโครงงาน/บล็อก
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

// Main Detail Component with Suspense
const Detail: React.FC = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <DetailContent />
    </Suspense>
  );
};

export default Detail;