"use client";

import React, { useState } from "react";
import Link from 'next/link';
import Header from "../component/Header";

function page() {

    const [requests, setRequests] = useState([]);

    const addRequest = (user, issue, email) => {
    setRequests(prevRequests => [
      ...prevRequests,
      {
        id: prevRequests.length + 1,
        user,
        issue,
        email
      }
    ]);
  };

  return (
    <main>
        <Header/>
    <div className="flex flex-col md:flex-row w-full max-w-auto justify-center p-4 mx-auto text-black" style={{backgroundColor:"#FBFBFB"}}>
        <div className="flex flex-col w-full md:w-2/3 lg:w-full justify-center p-4">
            <div className="flex flex-col justify-center m-5">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mt-5 mb-5">
                    คำร้องปัญหาของผู้ใช้
                </h1>
            </div>
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
            <tr>
                    <td className="border-2 text-center h-14">1</td>
                    <td className="border-2 text-center h-14">สมใจ ใจดี</td>
                    <td className="border-2 text-center h-14">เว็บบัค </td>
                    <td className="border-2 text-center h-14">a1@gmail.com</td>
            </tr>
            <tr>
                    <td className="border-2 text-center h-14">2</td>
                    <td className="border-2 text-center h-14">สมใจ ใจดี</td>
                    <td className="border-2 text-center h-14">เว็บโหลดช้ามากก </td>
                    <td className="border-2 text-center h-14">a1@gmail.com</td>
            </tr>
            <tr>
                    <td className="border-2 text-center h-14"><Link href="/ReportService/detail">3</Link></td>
                    <td className="border-2 text-center h-14"><Link href="/ReportService/detail">สมใจ ใจดี</Link></td>
                    <td className="border-2 text-center h-14"><Link href="/ReportService/detail">ไม่สามารถเข้าหน้า</Link></td>
                    <td className="border-2 text-center h-14"><Link href="/ReportService/detail">a1@gmail.com</Link></td>
            </tr>
                {requests.map((request, index) => (
                <tr key={index}>
                    <td className="border-2 text-center h-14">{request.id}</td>
                    <td className="border-2 text-center h-14">{request.user}</td>
                    <td className="border-2 text-center h-14">{request.issue}</td>
                    <td className="border-2 text-center h-14">{request.email}</td>
                </tr>
                ))}
            </tbody>
            </table>

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
        </div>
    </div>
    </main>
  )
}

export default page
