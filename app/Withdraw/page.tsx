"use client";

import Header from "../component/Header";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Pagination from "../component/Pagination";

interface WithdrawData {
  _id: string;
  userId: string;
  withdrawn: number;
  net: number;
  status: string;
  receipt: {
    fullname: string;
    date: string;
    gross: number;
    withdrawable: number;
    servicefee: number;
    email: string;
  };
  date: string;
}

interface Project {
  email: string;
  namebank: string;
  numberbankacc: string;
  fullname: string;
  phonenumber: string;
  firstname:  string;
  lastname:  string;
  username:   string;

}

const Withdraw: React.FC = () => {
  const [withdraws, setWithdraws] = useState<WithdrawData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/studetuser", {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }

      const data = await response.json();
      console.log("Fetched Student Users:", data);

      if (data && Array.isArray(data.studentusers)) {
        const formattedProjects = data.studentusers.map((user: any) => ({
          email: user.email,
          firstname: user.firstname ,
          lastname: user.lastname ,
          username:  user.username ,
          namebank: user.SellInfo?.namebank || "",
          numberbankacc: user.SellInfo?.numberbankacc || "",
          fullname:  user.SellInfo?.fullname || "",
          phonenumber:  user.SellInfo?.phonenumber|| "",
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

  const fetchWithdraws = async () => {
    try {
      const response = await fetch("/api/withdrawals", {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch withdrawals");
      }

      const data = await response.json();
      console.log("Fetched Withdrawals:", data);

      if (Array.isArray(data.withdrawals)) {
        setWithdraws(data.withdrawals);
      } else {
        console.error("Data is not an array");
      }
    } catch (error) {
      console.error("Error fetching withdrawals:", error);
    }
  };

  useEffect(() => {
    getPosts();
    fetchWithdraws();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = withdraws.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(withdraws.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const findProjectByEmail = (email: string) => {
    return projects.find((project) => project.email === email);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FBFBFB] overflow-hidden">
      <Header />
      <main className="flex-grow">
        <div className="lg:mx-64 lg:mt-10 lg:mb-10 mt-10 mb-10 mx-5">
          <h2 className="text-xl font-bold mb-4">คำร้องขอถอนเงิน</h2>
          <div className="w-full h-full flex flex-col">
            <table className="min-w-full border-collapse border border-gray-400">
              <thead>
                <tr>
                  <th className="border border-gray-400 p-2">#</th>
                  <th className="border border-gray-400 p-2 lg:text-lg">
                    ผู้ส่งคำร้อง
                  </th>
                  <th className="border border-gray-400 p-2 lg:text-lg">
                    จำนวนเงิน(บาท)
                  </th>
                  <th className="border border-gray-400 p-2 lg:text-lg">
                    วันที่ส่งคำร้อง
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((withdraw, index) => {
                  const matchedProject = findProjectByEmail(
                    withdraw.receipt.email
                  );

                  return (
                    <tr key={withdraw._id}>
                      <td className="border border-gray-400 p-2 text-center text-sm lg:text-lg">
                        {index + indexOfFirstItem + 1}.
                      </td>
                      <td className="border border-gray-400 p-2 text-sm truncate max-w-xs lg:text-lg">
                        {matchedProject ? (
                          <Link
                            href={`/Withdraw/detail?id=${withdraw._id}`}
                          >
                            {withdraw.receipt.fullname}
                          </Link>
                        ) : (
                          withdraw.receipt.email
                        )}
                      </td>
                      <td className="border border-gray-400 p-2 text-sm truncate max-w-xs lg:text-lg">
                        {withdraw.withdrawn}
                      </td>
                      <td className="border border-gray-400 p-2 text-sm truncate max-w-xs lg:text-lg">
                        {new Date(withdraw.date).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
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

export default Withdraw;
