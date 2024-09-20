"use client"; // This makes the component client-side

import Header from "../../component/Header"; // Adjust the import path
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router'; // Ensure we're using the router for client-side routing

function page () {
//   const searchParams = useSearchParams();
//   const blogname = searchParams.get("blogname");
//   const username = searchParams.get("username");
//   const report = searchParams.get("report");
//   const selectedReason = searchParams.get("selectedReason");
//   const createdAt = searchParams.get("createdAt");

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

const searchParams = useSearchParams();
const id = searchParams.get("id"); // Extract the 'id' from the query parameters

const [blog, setBlog] = useState<any>(null); // Store the blog data

useEffect(() => {
  if (id) {
    fetch(`/api/getreportblog/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setBlog(data.blogData); // Set the fetched blog data
      })
      .catch((err) => console.error(err));
  }
}, [id]);
  // Extract the blog data
  const blogname = blog?.blogname || ""; // Check if blog exists
  const username = blog?.author || ""; // Assuming 'author' contains username
  const report = blog?.report || "";
  const selectedReason = blog?.selectedReason || "";
  const createdAt = blog?.createdAt || "";

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
        window.location.reload();
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

  const handleDelete = async () => {
    const confirmed = confirm("Are you sure?");

    if (confirmed && id) {
      const res = await fetch(`http://localhost:3000/api/posts/${id}`, {
        method: "DELETE"
      });

      if (res.ok) {
        window.location.reload();
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FBFBFB] overflow-hidden text-black">
      <Header />
      <main className="flex-grow">
        <div className="lg:mx-60 mt-10 mb-5">
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

          {/* Buttons */}
          <div className="mt-6 flex flex-col gap-4 lg:w-2/3 mx-auto">
            <button onClick={() => handleSubmit1(id)} className="w-full p-2 text-white rounded" style={{ backgroundColor: "#33539B" }}>ลบคำร้อง</button>
            <button onClick={() => handleSubmit2(id)} className="w-full p-2 text-white rounded" style={{ backgroundColor: "#1976D2" }}>ติดต่อเจ้าของโครงงาน/บล็อก</button>
            <button onClick={handleDelete} className="w-full p-2 text-white rounded" style={{ backgroundColor: "#9B3933" }}>ลบโครงงาน/บล็อก</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default page;
