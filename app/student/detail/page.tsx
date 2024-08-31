"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation"; // Ensure you import this if you want to use it
import Header from "../../component/Header";
import Link from "next/link";



const Detail: React.FC = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const Username = searchParams.get("Username");
  const name = searchParams.get("name");
  const Email = searchParams.get("Email");
  const phon = searchParams.get("phon");
  const idcard = searchParams.get("idcard");
  const bank = searchParams.get("bank");
  const banknumber = searchParams.get("banknumber");
  const Address = searchParams.get("Address");
  const subdis = searchParams.get("subdis");
  const district = searchParams.get("district");
  const province = searchParams.get("province");
  const postal = searchParams.get("postal");
  return (
    <div className="flex flex-col min-h-screen bg-[#FBFBFB] overflow-hidden">
    <Header />
    <main className="flex-grow">
      <div className="lg:mx-60 mt-10 mb-5">
        <div className=" flex items-center justify-center lg:mb-10  mb-10 ">
          <div className="rounded-full bg-gray-400 h-20 w-20 flex items-center justify-center">
            <svg className="h-10 w-10 text-gray-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
          </div>
          <div className="w-full mt-2 lg:w-2/3 mx-auto">
          <h2 className="text-xl font-bold mb-2">Username: {Username}</h2>
          <p className="text-lg text-gray-700 mb-2 ">ชื่อ-นามสกุล: {name}</p>
          <p className="text-lg text-gray-700 mb-2 ">อีเมล: {Email}</p>
          <p className="text-lg text-gray-700 mb-2 ">เบอร์โทรศัพท์: {phon}</p>
          <p className="text-lg text-gray-700 mb-2">เลขที่บัตรประชาชน: {idcard}</p>
          <p className="text-lg text-gray-700 mb-2">ธนาคาร: {bank}</p>
          <p className="text-lg text-gray-700 mb-2 ">เลขที่บัญชีธนาคาร: {banknumber}</p>
          <p className="text-lg text-gray-700 mb-2 ">ที่อยู่: {Address}</p>
          <p className="text-lg text-gray-700 mb-2 ">ตำบล: {subdis}</p>
          <p className="text-lg text-gray-700 mb-2 ">อำเภอ: {district}</p>
          <p className="text-lg text-gray-700 mb-2 ">จังหวัด: {province}</p>
          <p className="text-lg text-gray-700 mb-2 ">รหัสไปรษณีย์: {postal}</p>
        </div>
      </div>
      </main>
    </div>
  );
};

export default Detail;
