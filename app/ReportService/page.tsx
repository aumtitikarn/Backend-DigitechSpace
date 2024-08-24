"use client";

import React, { useEffect, useState } from "react";
import Link from 'next/link';
import Header from "../component/Header";

function page() {

    const [postData,setPostData] = useState<PostData[]>([]);
    console.log(postData);

    const getPosts = async ()=> {

        try{
          const res = await fetch("http://localhost:3000/api/getreportservice",{
            method:"GET",
            cache:"no-store"
          })
    
          if(!res.ok){
            throw new Error("Failed of fetch posts")
          }
    
          const data = await res.json();
          console.log("Fetched Data: ", data); // Log the data to inspect its structure
          setPostData(data.postservice);
          console.log(data); // Check the structure here
          setPostData(data.postservice); // Make sure data.posts exists
    
        } catch(error) {
          console.log("Error loading posts: ",error);
        }
      }
    
      useEffect(()=>{
        getPosts();
      },[]);

      interface PostData {
        _id: string;
        report: string;
        email: string;
        // Add any other properties that are in your post data
      }

    interface Project1 {
        id: number;
        name: string;
        report1: string;
        email1: string;
    }

    const projects: Project1[] = [
        { id: 1, name: 'สมใจ ใจดี', report1: 'มีคำไม่สุภาพ หรือ คำหยาบคาย', email1: 'a1@gmail.com' },
        { id: 2, name: 'สมใจ', report1: 'ไฟล์ไม่ทำงานตามที่ควรจะเป็น', email1: 'a1@gmail.com' },
        { id: 3, name: 'สมหมาย', report1: 'มีคำไม่สุภาพ หรือ คำหยาบคาย', email1: 'a1@gmail.com' },
        { id: 4, name: 'ใจดี', report1: 'มีคำไม่สุภาพ หรือ คำหยาบคาย', email1: 'a1@gmail.com' },
        { id: 5, name: 'ใจ ใจ', report1: 'ไฟล์ไม่ทำงานตามที่ควรจะเป็น', email1: 'a1@gmail.com' },
        { id: 6, name: 'ดี', report1: 'มีคำไม่สุภาพ หรือ คำหยาบคาย', email1: 'a1@gmail.com' },
        { id: 7, name: 'สม', report1: 'มีคำไม่สุภาพ หรือ คำหยาบคาย', email1: 'a1@gmail.com' },
        { id: 8, name: 'ใจใจดี', report1: 'ไฟล์ไม่ทำงานตามที่ควรจะเป็น', email1: 'a1@gmail.com' },
    ];

    return (
        <div className="bg-[#FBFBFB]">
            <Header />
            <div className="flex flex-col md:flex-row w-full max-w-auto justify-center p-4 mx-auto text-black bg-[#FBFBFB]" style={{ backgroundColor: "#FBFBFB" }}>
                <div className="flex flex-col w-full md:w-2/3 lg:w-full justify-center p-4">
                    <div className="flex flex-col justify-center m-5">
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mt-5 mb-5">
                            คำร้องปัญหาของผู้ใช้
                        </h1>
                    </div>
                    <div className="h-full bg-[#FBFBFB]">
                        <table className="w-full border-2 mt-10 mb-10">
                            <thead>
                                <tr>
                                    <th className="w-1/12 border-2 text-center h-12">#</th>
                                    <th className="w-3/12 border-2 text-center h-12">ผู้ส่งคำร้อง</th>
                                    <th className="w-5/12 border-2 text-center h-12">ปัญหา</th>
                                    <th className="w-3/12 border-2 text-center h-12">อีเมล</th>
                                </tr>
                            </thead>
                            <tbody>
                                {projects.map((project) => (
                                    <tr key={project.id}>
                                        <td className="border-2 text-center h-14">
                                            <Link href={`/ReportService/detail?id=${project.id}`}>{project.id}</Link>
                                        </td>
                                        <td className="border-2 text-center h-14">
                                            <Link href="/ReportService/detail">{project.name}</Link>
                                        </td>
                                        <td className="border-2 text-center h-14">
                                            <Link href="/ReportService/detail">{project.report1}</Link>
                                        </td>
                                        <td className="border-2 text-center h-14">
                                            <Link href="/ReportService/detail">{project.email1}</Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

        <div className="w-full h-full flex flex-col">
          <table className="min-w-full border-collapse border border-gray-400">
            <thead>
              <tr>
                <th className="border border-gray-400 p-2">#</th>
                <th className="border border-gray-400 p-2 lg:text-lg">ผู้ส่งคำร้อง</th>
                <th className="border border-gray-400 p-2 lg:text-lg">ปัญหา</th>
                <th className="border border-gray-400 p-2 lg:text-lg">อีเมล</th>
              </tr>
            </thead>
            <tbody>
            {postData && postData.length > 0 ? (
                    postData.map(val => (
                <tr key={val._id}>
                  <td className="border border-gray-400 p-2 text-center text-sm lg:text-lg">ยังไม่มี.</td>
                  <td className="border border-gray-400 p-2 text-sm truncate max-w-xs lg:text-lg">
                    <Link href={`ReportService/detail/${val._id}`}>
                      ยังไม่มี
                    </Link>
                  </td>
                  <td className="border border-gray-400 p-2 text-sm truncate max-w-xs lg:text-lg">{val.report}</td>
                  <td className="border border-gray-400 p-2 text-sm truncate max-w-xs lg:text-lg">{val.email}</td>
                </tr>
              ))):(<p>you don't have</p>)}
            </tbody>
          </table>
        </div>
        <p className="text-sm mt-2">
          *หากอยากดูข้อมูลเพิ่มเติมให้คลิกที่ตารางคนนั้น
        </p>
                    {/* Uncomment this section if you intend to use the requests form */}
                    {/* 
                    <form
                        className="flex flex-col space-y-4"
                        onSubmit={e => {
                            e.preventDefault();
                            const user = e.target.user.value;
                            const issue = e.target.issue.value;
                            const email = e.target.email.value;

                            addRequest(user, issue, email);

                            e.target.reset();
                        }}
                    >
                        <input
                            className="w-full border-2 p-2"
                            name="user"
                            placeholder="ผู้ส่งคำร้อง"
                            required
                        />
                        <input
                            className="w-full border-2 p-2"
                            name="issue"
                            placeholder="ปัญหา"
                            required
                        />
                        <input
                            className="w-full border-2 p-2"
                            name="email"
                            type="email"
                            placeholder="อีเมล"
                            required
                        />
                        <button className="w-full bg-blue-500 text-white p-2" type="submit">
                            ส่งคำร้อง
                        </button>
                    </form> 
                    */}
                </div>
            </div>
        </div>
    )
}

export default page;
