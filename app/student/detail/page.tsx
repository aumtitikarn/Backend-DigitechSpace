"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation"; // Ensure you import this if you want to use it
import Header from "../../component/Header";
import Link from "next/link";

interface Project {
  id: number;
  name: string;
  creator: string;
  report: string;
}

const projects: Project[] = [
  { id: 1, name: '@somjai', report: 'สมใจ ใจดี', creator: '0640398458' },
  { id: 2, name: '@somjai', report: 'สมใจ ใจดี', creator: '0640398458' },
  { id: 3, name: '@somjai', report: 'สมใจ ใจดี', creator: '0640398458' },
  { id: 4, name: '@somjai', report: 'สมใจ ใจดี', creator: '0640398458' },
  { id: 5, name: '@somjai', report: 'สมใจ ใจดี', creator: '0640398458' },
  { id: 6, name: '@somjai', report: 'สมใจ ใจดี', creator: '0640398458' },
  { id: 7, name: '@somjai', report: 'สมใจ ใจดี ', creator: '0640398458' },
  { id: 8, name: '@somjai', report: 'สมใจ ใจดี', creator: '0640398458' },
];

const Detail: React.FC = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const project = projects.find((p) => p.id === Number(id));

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FBFBFB]">
    <Header />
    <div className="lg:mx-10 lg:mt-10 lg:mb-10 mt-10 mb-10 mx-1 ">
        <div className=" flex items-center justify-center lg:mb-10  mb-10 ">
          <div className="rounded-full bg-gray-400 h-20 w-20 flex items-center justify-center">
            <svg className="h-10 w-10 text-gray-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
          </div>

          <div className="ml-10">
          <h2 className="text-xl font-bold mb-2">Username: {project.name}</h2>
          <p className="text-lg text-gray-700 mb-1">อีเมล: a@gamil.com</p>
          <p className="text-lg text-gray-700 mb-1">ชื่อ-นามสกุล: {project.report}</p>
          <p className="text-lg text-gray-700 mb-1">เบอร์โทรศัพท์: {project.creator}</p>
        </div>
      </div>
    </div>
  );
};

export default Detail;
