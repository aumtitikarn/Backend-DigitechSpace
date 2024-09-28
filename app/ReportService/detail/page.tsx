"use client";

import React, { useEffect, useState } from "react";
import Header from "../../component/Header";
import { redirect,useRouter } from "next/navigation";
import Link from 'next/link';
import { useSearchParams } from "next/navigation"; 

function Blog({ params }: { params: { _id: string } }) {
  const { _id } = params;
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupInput, setPopupInput] = useState("");

  const [postData, setPostData] = useState<PostData | null>(null); // Update to handle a single object or null

  const id = searchParams.get("id");
  const report = searchParams.get("report");
  const username = searchParams.get("report");
  interface PostData {
    _id: string;
    report: string;
    email: string;
    username:string;
    // Add any other properties that are in your post data
  }

  const getPostById = async (id: string) => {
    try {
      if (!id) {
        throw new Error("ID is undefined");
      }
      const res = await fetch(`http://localhost:3000/api/getreportservice/${id}`, {
        method: "GET",
        cache: "no-store",
      });
  
      if (!res.ok) {
        throw new Error(`Failed to fetch post: ${res.statusText}`);
      }
  
      const data = await res.json();
      console.log("Fetched post: ", data);
  
      setPostData(data.post); // Assuming data.post is a single PostData object
    } catch (error) {
      console.error("Error fetching post:", error);
    }
  };
  

  useEffect(() => {
    console.log("Fetched ID:", _id);
    getPostById(_id);
  }, [_id]);
  

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const handlePopupSubmit = () => {
    alert(`Popup Input: ${popupInput}`);
    setPopupInput("");
    setIsPopupOpen(false);
  };

  const [input1, setInput1] = useState("");
  const [input2, setInput2] = useState("");

  const handleSubmit = () => {
    alert(`Input 1: ${input1}, Input 2: ${input2}`);
    setInput1("");
    setInput2("");
  };

  const handleSubmit1 = () => {
    alert(`Input 1: ${input1}, Input 2: ${input2}`);
    setInput1("");
    setInput2("");
  };
  const email = searchParams.get("email");
  const handleSubmit2 = () => {
    alert(`Input 1: ${input1}, Input 2: ${input2}`);
    setInput1("");
    setInput2("");
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
          <h1 className="text-lg font-bold mt-5 mb5 text-black" style={{ fontSize: "32px" }}>คำร้องปัญหาของผู้ใช้</h1>
              <p className="mt-4 text-lg">
                โดย   {username}
              </p>
              <div className="flex flex-col w-full ">
                <h1 className="text-lg font-bold mt-4" style={{ fontSize: "24px" }}>ปัญหา</h1>
                <p className="mt-2 text-lg">
                {report}
                </p>
                <h1 className="text-lg font-bold mt-4" style={{ fontSize: "24px" }}>อีเมล</h1>
                <p className="mt-2 text-lg">
                {email}
                </p>
                <div className="mt-10">
                  <button
                    onClick={handleSubmit}
                    className="w-full p-2 text-white rounded mt-6"
                    style={{ backgroundColor: "#33539B" }}
                  >
                    ลบคำร้อง
                  </button>
                  <button
                    onClick={handleSubmit1}
                    className="w-full p-2 text-white rounded mt-4"
                    style={{ backgroundColor: "#1976D2" }}
                  >
                    ติดต่อเจ้าของโครงงาน/บล็อก
                  </button>
                  <button
                    onClick={handleSubmit2}
                    className="w-full p-2 text-white rounded mt-4"
                    style={{ backgroundColor: "#9B3933" }}
                  >
                    ลบโครงงาน/บล็อก
                  </button>
                </div>
              </div>
        </div>
        </div>
      </div>
    </main>
    </div>
  );
  
}

export default Blog