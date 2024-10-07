"use client";

import Header from "../component/Header";
import React, { useState, useRef, useEffect } from 'react';
import Link from "next/link";
import Pagination from "../component/Pagination";
import Swal from 'sweetalert2';

interface Project {
  _id: string; // เปลี่ยนจาก number เป็น string เพื่อให้ตรงกับ MongoDB's _id
  username: string;
  name: string;
  phonenumber: string;
  email: string;
  district: string;
  fullname: string;
  namebank: string;
  nationajid: string;
  numberbankacc: string;
  province: string;
  subdistrict: string;
  firstname: string;
  lastname: string;
  housenum: string;
  postalnumber: string;
  line: string;
  facebook: string;
}

const UserStudent: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 5;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = projects.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(projects.length / itemsPerPage);
  const [emailContent, setEmailContent] = useState('');
  const [isSending, setIsSending] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      adjustHeight();
    }
  }, [emailContent]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEmailContent(e.target.value);
    adjustHeight();
  };

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const sendEmail = async () => {
    if (projects.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่พบรายชื่อผู้ใช้',
      });
      return;
    }
  
    setIsSending(true);
  
    try {
      const emails = projects.map(project => project.email);
      const response = await fetch('/api/sendemailall', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emails: emails,
          subject: "Digitech Space",
          emailContent: emailContent,
        }),
      });
  
      if (response.ok) {
        const result = await response.json();
        Swal.fire({
          icon: 'success',
          title: 'สำเร็จ',
          text: result.message,
        });
        setEmailContent('');
      } else {
        const errorData = await response.json();
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: `เกิดข้อผิดพลาดในการส่งอีเมล: ${errorData.message}`,
        });
      }
    } catch (error) {
      console.error('Error sending email:', error);
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'เกิดข้อผิดพลาดในการส่งอีเมล',
      });
    } finally {
      setIsSending(false);
    }
  };

  // ฟังก์ชันสำหรับดึงข้อมูลจาก API
  const getPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/studetuser", {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }

      const data = await response.json();
      console.log("Fetched Data:", data); // ตรวจสอบข้อมูลที่ได้มา

      // ตรวจสอบโครงสร้างข้อมูลและจัดการข้อมูลให้ถูกต้อง
      if (data && Array.isArray(data.studentusers)) {
        const formattedProjects = data.studentusers.map((user: any) => ({
          username: user.username,
          name: user.name,
          phonenumber: user.phonenumber,
          email: user.email,
          district: user.SellInfo?.district || "", // อ้างอิงจาก SellInfo
          fullname: user.SellInfo?.fullname || "",
          namebank: user.SellInfo?.namebank || "",
          nationajid: user.SellInfo?.nationalid || "",
          numberbankacc: user.SellInfo?.numberbankacc || "",
          postalnumber: user.SellInfo?.postalnumber || "",
          province: user.SellInfo?.province || "",
          subdistrict: user.SellInfo?.subdistrict || "",
          firstname: user.firstname,
          lastname: user.lastname,
          facebook: user.facebook,
          line: user.line,
          housenum: user.SellInfo?.housenum || "",
        }));
        setProjects(formattedProjects);
      } else {
        console.error("Data format is incorrect:", data);
        setError("Data format is incorrect");
      }
    } catch (error) {
      console.error("Error loading projects:", error);
      setError("Error loading projects");
    } finally {
      setLoading(false);
    }
  };

  // ใช้ useEffect เพื่อดึงข้อมูลเมื่อ component โหลด
  useEffect(() => {
    getPosts();
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FBFBFB] overflow-hidden">
      <Header />
      <main className="flex-grow">
        <div className="lg:mx-64 lg:mt-10 lg:mb-10 mt-10 mb-10 mx-5">
          <h2 className="text-xl font-bold mb-4 text-black">รายชื่อของนักศึกษา</h2>
          <div className="w-full h-full flex flex-col">
            <table className="min-w-full border-collapse border border-gray-400">
              <thead>
                <tr>
                  <th className="border border-gray-400 p-2 text-black">#</th>
                  <th className="border border-gray-400 p-2 lg:text-lg text-black">Username</th>
                  <th className="border border-gray-400 p-2 lg:text-lg text-black">ชื่อ-นามสกุล</th>
                  <th className="border border-gray-400 p-2 lg:text-lg text-black">เบอร์โทรศัพท์</th>
                </tr>
              </thead>
              <tbody>
  {currentItems.map((project, index) => (
    <tr key={project.username}> {/* ใช้ username เป็น key */}
      <td className="border border-gray-400 p-2 text-center text-sm lg:text-lg text-black" >{index + 1}.</td>
      <td className="border border-gray-400 p-2 text-sm truncate max-w-xs lg:text-lg text-black">
        <Link href={{
          pathname: `/student/detail`,
          query: {
            username: project.username,
            housenum: project.housenum,
            phonenumber: project.phonenumber,
            email: project.email,
            district: project.district,
            fullname: project.fullname,
            namebank: project.namebank,
            postalnumber: project.postalnumber,
            nationajid: project.nationajid,
            numberbankacc: project.numberbankacc,
            province: project.province,
            subdistrict: project.subdistrict,
            firstname: project.firstname,
            lastname: project.lastname,
            facebook: project.facebook,
            line: project.line,
          },
        }}>
          {project.username}
        </Link>
      </td>
      <td className="border border-gray-400 p-2 text-sm truncate max-w-xs lg:text-lg text-black">{project.name}</td>
      <td className="border border-gray-400 p-2 text-sm truncate max-w-xs lg:text-lg text-black">{project.phonenumber}</td>
    </tr>
  ))}
</tbody>

            </table>
          </div>
          <p className="text-sm mt-2 text-black">
            *หากอยากดูข้อมูลเพิ่มเติมให้คลิกที่ตารางคนนั้น
          </p>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
          <div className="mt-6 w-auto lg:w-[1000px] h-auto p-4 flex-shrink-0 rounded-2xl border border-[#D0D8E9] bg-white shadow-[0px_0px_60.1px_-16px_#D9DDE5]">
          <div className="w-full mt-3">
                  <p className="text-[#6C7996A6] text-[16px] mb-3 font-semibold">
                    ส่งอีเมลหาผู้ใช้ทั้งหมด
                  </p>
                  <textarea
                    ref={textareaRef}
                    className="w-full min-h-[50px] px-4 py-2 flex items-center rounded-[9px] border border-[rgba(208,216,233,0.41)] bg-[#F5F5F6] text-[#5D76AD] focus:outline-none focus:ring-2 focus:ring-[#5D76AD] resize-none overflow-hidden"
                    placeholder="ข้อความอีเมล"
                    value={emailContent}
                    onChange={handleChange}
                  />
                  <button 
                    className="mt-5 w-auto lg:w-full py-3 flex-shrink-0 rounded-[10px] bg-[#5D76AD] text-white font-semibold flex items-center justify-center hover:bg-[#4A5F8C] transition-colors duration-300"
                    onClick={sendEmail}
                    disabled={isSending}
                  >
                    {isSending ? 'กำลังส่ง...' : 'ส่งอีเมล'}
                  </button>
                </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserStudent;
