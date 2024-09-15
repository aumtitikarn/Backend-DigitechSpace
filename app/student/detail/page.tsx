"use client";

import React from "react";
import { useSearchParams } from "next/navigation"; // Ensure you import this if you want to use it
import Header from "../../component/Header";

const Detail: React.FC = () => {
  const searchParams = useSearchParams();
  const username = searchParams.get("username");
  const housenum = searchParams.get("housenum");
  const phonenumber = searchParams.get("phonenumber");
  const email = searchParams.get("email");
  const district = searchParams.get("district");
  const fullname = searchParams.get("fullname");
  const namebank = searchParams.get("namebank");
  const nationajid = searchParams.get("nationajid");
  const numberbankacc = searchParams.get("numberbankacc");
  const province = searchParams.get("province");
  const subdistrict = searchParams.get("subdistrict");
  const firstname = searchParams.get("firstname");
  const lastname = searchParams.get("lastname");

  return (
    <div className="flex flex-col min-h-screen bg-[#FBFBFB] overflow-hidden">
      <Header />
      <main className="flex-grow">
        <div className="lg:mx-60 mt-10 mb-5">
          <div className="flex items-center justify-center lg:mb-10 mb-10">
            <div className="rounded-full bg-gray-400 h-20 w-20 flex items-center justify-center">
              <svg
                className="h-10 w-10 text-gray-200"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
          </div>
          <div className="w-full mt-2 lg:w-2/3 mx-auto">
            <h2 className="text-xl font-bold mb-2">Username: {username}</h2>
            <p className="text-lg text-gray-700 mb-2">ชื่อ-นามสกุล: {fullname}</p>
            <p className="text-lg text-gray-700 mb-2">อีเมล: {email}</p>
            <p className="text-lg text-gray-700 mb-2">เบอร์โทรศัพท์: {phonenumber}</p>
            <p className="text-lg text-gray-700 mb-2">ชื่อ: {firstname}</p>
            <p className="text-lg text-gray-700 mb-2">นามสกุล: {lastname}</p>
            <p className="text-lg text-gray-700 mb-2">ธนาคาร: {namebank}</p>
            <p className="text-lg text-gray-700 mb-2">เลขที่บัตรประชาชน: {nationajid}</p>
            <p className="text-lg text-gray-700 mb-2">เลขที่บัญชีธนาคาร: {numberbankacc}</p>
            <p className="text-lg text-gray-700 mb-2">ที่อยู่: {housenum} </p>
            <p className="text-lg text-gray-700 mb-2">ตำบล: {subdistrict}</p>
            <p className="text-lg text-gray-700 mb-2">อำเภอ: {district}</p>
            <p className="text-lg text-gray-700 mb-2">จังหวัด: {province}</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Detail;
