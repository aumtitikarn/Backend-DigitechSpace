"use client";

import React, { useState } from "react";
import Link from 'next/link';
import Header from "../component/Header";

function page() {
    interface Project1 {
        id: number;
        name: string;
        report: string;
        email: string;
    }

    const projects: Project1[] = [
        { id: 1, name: 'สมใจ ใจดี', report: 'มีคำไม่สุภาพ หรือ คำหยาบคาย', email: 'a1@gmail.com' },
        { id: 2, name: 'สมใจ', report: 'ไฟล์ไม่ทำงานตามที่ควรจะเป็น', email: 'a1@gmail.com' },
        { id: 3, name: 'สมหมาย', report: 'มีคำไม่สุภาพ หรือ คำหยาบคาย', email: 'a1@gmail.com' },
        { id: 4, name: 'ใจดี', report: 'มีคำไม่สุภาพ หรือ คำหยาบคาย', email: 'a1@gmail.com' },
        { id: 5, name: 'ใจ ใจ', report: 'ไฟล์ไม่ทำงานตามที่ควรจะเป็น', email: 'a1@gmail.com' },
        { id: 6, name: 'ดี', report: 'มีคำไม่สุภาพ หรือ คำหยาบคาย', email: 'a1@gmail.com' },
        { id: 7, name: 'สม', report: 'มีคำไม่สุภาพ หรือ คำหยาบคาย', email: 'a1@gmail.com' },
        { id: 8, name: 'ใจใจดี', report: 'ไฟล์ไม่ทำงานตามที่ควรจะเป็น', email: 'a1@gmail.com' },
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
                                            <Link href="/ReportService/detail">{project.report}</Link>
                                        </td>
                                        <td className="border-2 text-center h-14">
                                            <Link href="/ReportService/detail">{project.email}</Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
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
