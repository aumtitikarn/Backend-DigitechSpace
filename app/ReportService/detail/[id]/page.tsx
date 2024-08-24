"use client";

import React, { useEffect, useState } from "react";
import Header from "../../../component/Header";
import { redirect,useRouter } from "next/navigation";
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function Blog ({ params }) {

  const { id } = params;

  const router = useRouter();

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupInput, setPopupInput] = useState("");

  const [postData, setPostData] = useState<PostData[]>([]);

  const [email, setEmail] = useState("");
  const [report, setReport] = useState("");

  interface PostData {
    _id: string;
    report: string;
    email: string;
    // Add any other properties that are in your post data
  }

  const getPostById = async (id: string) => {
    try {
        const res = await fetch(`http://localhost:3000/api/getreportservice/${id}`, {
            method: "GET",
            cache: "no-store",
        });

        if (!res.ok) {
            throw new Error("Failed to fetch a post");
        }

        const data = await res.json();
        console.log("Edit post: ", data);

        const post = data.post;
        setPostData(post);
        setEmail(post.email);
        setReport(post.report);
    } catch (error) {
        console.log(error);
    }
};

useEffect(() => {
    getPostById(id);
}, [])

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

  const handleSubmit2 = () => {
    alert(`Input 1: ${input1}, Input 2: ${input2}`);
    setInput1("");
    setInput2("");
  };


  return (
    <main style={{backgroundColor:"#FBFBFB"}}>
    <Header/>
    
<div className="flex flex-col md:flex-row w-full max-w-auto justify-center p-4 bg text-black" style={{backgroundColor:"#FBFBFB"}}>
  <div className="flex flex-col md:flex-col w-full max-w-auto justify-center" >
    <div className="flex flex-col justify-center">
      <h1 className="text-lg font-bold mt-5 mb-5 text-black" style={{fontSize:"36px"}}>คำร้องปัญหาของผู้ใช้</h1>
    </div>
    <p className="mt-2 text-lg">
    โดย {postData.email}
    </p>
    <div className="flex flex-col md:flex-coljustify-center w-full mt-6">
      <h1 className="text-lg font-bold mt-4" style={{fontSize:"24px"}}>ปัญหา</h1>
      <p className="mt-2 text-lg">
      เว็บบัค {postData.report}
      </p>

      <h1 className="text-lg font-bold mt-4" style={{fontSize:"24px"}}>อีเมล</h1>
      <p className="mt-2 text-lg">
      a1@gmail.com {postData.email}
      </p>

      <div className="mt-4">
        <button
          onClick={handleSubmit}
          className="w-full p-2 text-white rounded mt-6"
          style={{backgroundColor:"#33539B"}}
        >
          ลบคำร้อง
        </button>
        <button
          onClick={handleSubmit1}
          className="w-full p-2 text-white rounded mt-4"
          style={{backgroundColor:"#1976D2"}}
        >
          ติดต่อเจ้าของโครงงาน/บล็อก
        </button>
        <button
          onClick={handleSubmit2}
          className="w-full p-2 text-white rounded mt-4"
          style={{backgroundColor:"#9B3933"}}
        >
          ลบโครงงาน/บล็อก
        </button>
      </div>
    </div>
  </div>
</div>
    
<div className="flex flex-col space-y-4">
            <div className="w-full h-48 p-2">s</div>
        </div>
</main>
  )
}

export default Blog