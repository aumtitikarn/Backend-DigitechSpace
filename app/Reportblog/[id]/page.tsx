"use client";

import Header from "../../component/Header";
import React from 'react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import { useParams } from 'next/navigation';

const Detail: React.FC = (params) => {

    const router = useRouter();
    const routeParams = useParams<Params>(); // Use the Params type
    const { id } = routeParams; // Now this will correctly infer the type

  const searchParams = useSearchParams();
//   const id = searchParams.get("id");
//   const blogname = searchParams.get("blogname");
//   const username = searchParams.get("username");
//   const report = searchParams.get("report");
//   const selectedReason = searchParams.get("selectedReason");
//   const createdAt = searchParams.get("createdAt");

  const [userEmail, setUserEmail] = useState('');

  const [blogemail, setBlogemail] = useState("");

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
  
  const handleSubmit2 = async (id: string) => {

    const confirmed = confirm("Are you sure?");
    if (!confirmed) return;

    try {
      // Fetch the blog post details from MongoDB using the blog ID
      const response = await fetch(`/api/getreportblog/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const post = await response.json();
        console.log(post)

        setBlogemail(post.blogEmail);

        console.log("getsetemail :", blogemail);
        const { blogEmail } = post;
        console.log("getemail2 :", blogEmail)

        // Dynamically create the mailto link
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
  

  const handleSubmit3 = () => {
    alert("ลบโครงงาน/บล็อก");
    // Add your specific logic here
  };

  interface BlogPost {
    _id: string;
    blogname: string;
    report: string;
    author?: string;
    selectedReason: string;
    createdAt: string;
    title: string;
    // Add other fields as necessary
  }

  const [postBlogs, setPostBlogs] = useState<BlogPost[]>([]);
  const [postBlog, setPostBlog] = useState([]);

  useEffect(() => {
    if (id) {
      fetchBlogs(id);
    }
  }, [id]);

  const fetchBlogs = async (id: string) => {
    console.log("Fetching blogs with id:", id);
    try {
      const response = await fetch(`/api/getreportblog/${id}`, {
        method: "GET",
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error(`Error fetching blogs: ${errorData.message}`);
        return;
      }
  
      const post = await response.json();
      console.log("Fetched post:", post);
      console.log("หัวเรื่อง :",post.blogname)
  
      // ตรวจสอบโครงสร้างข้อมูลที่ได้
      if (Array.isArray(post)) {
        setPostBlogs(post); // หาก API ส่งกลับเป็นอาร์เรย์
      } else {
        setPostBlogs([post]); // หาก API ส่งกลับเป็นวัตถุเดียว
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };

  

  const handleDelete = async (id: string | null) => {
    console.log("ID passed to delete:", id); // Add this line to debug
  
    const confirmed = confirm("Are you sure?");
    if (confirmed) {
      try {
        const res = await fetch(`/api/getreportblog/${id}`, {
          method: "DELETE",
        });
  
        if (res.ok) {
          setPostBlog((prevPostBlogs) => prevPostBlogs.filter((postBlog) => postBlog._id !== id));
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
      {postBlogs.length > 0 ? (
        postBlogs.map((blog) => (
          <div className="lg:mx-60 mt-10 mb-5" key={blog._id}>
            <div className="w-full mt-2 lg:w-2/3 mx-auto">
              <h2 className="text-xl font-bold mb-10">รายงานบล็อก {blog.blogname || blog.title || ""}</h2>
              <h3 className="text-lg text-gray-700 mb-4">โดย คุณ {blog.author || ""}</h3>
              <h4 className="text-xl font-bold mb-4">คำร้อง</h4>
              <p className="text-lg text-gray-700 mb-4">{blog.report || ""}</p>
              <h4 className="text-xl font-bold mb-4">ข้อความเพิ่มเติม</h4>
              <p className="text-lg text-gray-700 mb-4">{blog.selectedReason || ""}</p>
              <h4 className="text-xl font-bold mb-4">วันที่/เวลา</h4>
              <p className="text-lg text-gray-700 mb-4">{formatDate(blog.createdAt)}</p>
            </div>
            <div className="mt-6 flex flex-col gap-4 lg:w-2/3 mx-auto">
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
                onClick={() => handleDelete(id)} // Use blog._id here
                className="w-full p-2 text-white rounded"
                style={{ backgroundColor: "#9B3933" }}
              >
                ลบโครงงาน/บล็อก
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>No blogs available</p>
      )}
      </main>
    </div>
  );
};

export default Detail;
