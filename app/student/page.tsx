"use client";

import Header from "../component/Header";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Pagination from "../component/Pagination";

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
          <h2 className="text-xl font-bold mb-4">รายชื่อของนักศึกษา</h2>
          <div className="w-full h-full flex flex-col">
            <table className="min-w-full border-collapse border border-gray-400">
              <thead>
                <tr>
                  <th className="border border-gray-400 p-2">#</th>
                  <th className="border border-gray-400 p-2 lg:text-lg">
                    Username
                  </th>
                  <th className="border border-gray-400 p-2 lg:text-lg">
                    ชื่อ-นามสกุล
                  </th>
                  <th className="border border-gray-400 p-2 lg:text-lg">
                    เบอร์โทรศัพท์
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((project, index) => (
                  <tr key={project.username}>
                    {" "}
                    {/* ใช้ username เป็น key */}
                    <td className="border border-gray-400 p-2 text-center text-sm lg:text-lg">
                      {index + 1}.
                    </td>
                    <td className="border border-gray-400 p-2 text-sm truncate max-w-xs lg:text-lg">
                      <Link
                        href={{
                          pathname: `/student/detail`,
                          query: {
                            username: project.username,
                            housenum: project.housenum,
                            phonenumber: project.phonenumber,
                            email: project.email,
                            district: project.district,
                            fullname: project.fullname,
                            namebank: project.namebank,
                            nationajid: project.nationajid,
                            numberbankacc: project.numberbankacc,
                            province: project.province,
                            subdistrict: project.subdistrict,
                            firstname: project.firstname,
                            lastname: project.lastname,
                            postalnumber: project.postalnumber
                          },
                        }}
                      >
                        {project.username}
                      </Link>
                    </td>
                    <td className="border border-gray-400 p-2 text-sm truncate max-w-xs lg:text-lg">
                      {project.name}
                    </td>
                    <td className="border border-gray-400 p-2 text-sm truncate max-w-xs lg:text-lg">
                      {project.phonenumber}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm mt-2">
            *หากอยากดูข้อมูลเพิ่มเติมให้คลิกที่ตารางคนนั้น
          </p>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </main>
    </div>
  );
};

export default UserStudent;
