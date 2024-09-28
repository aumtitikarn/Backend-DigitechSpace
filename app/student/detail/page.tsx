"use client";

import React from "react";
import { useSearchParams } from "next/navigation"; // Ensure you import this if you want to use it
import Header from "../../component/Header";
import { MdAccountCircle } from "react-icons/md";

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
  const postalnumber = searchParams.get("postalnumber");
  return (
    <div className="flex flex-col min-h-screen bg-[#FBFBFB] overflow-hidden text-black">
      <Header />
      <main className="flex-grow">
        <div className="flex flex-col items-center justify-center my-10 w-full px-4">
          <div className="flex flex-col lg:flex-row w-full max-w-[1430px] space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="w-full lg:w-[40%] h-auto flex-shrink-0 rounded-2xl border border-[#D0D8E9] bg-white shadow-[0px_0px_60.1px_-16px_#D9DDE5]">
              <div className="p-10">
                {/* เนื้อหาของกล่องซ้าย */}
                <div className="flex items-center space-x-4 p-4">
                  <MdAccountCircle className="text-[100px] text-gray-600" />
                  <div className="flex flex-col">
                    <span className="text-[28px] font-bold text-[#213766E5]">
                      {username}
                    </span>
                    <span className="text-[20px] text-[#6C7996E5]">
                      {email}
                    </span>
                  </div>
                </div>
                <div className="w-full">
                  <p className="text-[#6C7996A6] text-[16px] mb-1">ชื่อ - นามสกุล</p>
                  <div className="w-full h-[50px] px-4 flex items-center rounded-[9px] border border-[rgba(208,216,233,0.41)] bg-[#F5F5F6] text-[#5D76AD]">
                    {fullname}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mt-3">
                  <div className="w-full sm:w-1/2">
                    <p className="text-[#6C7996A6] text-[16px] mb-1">เลขที่บัตรประชาชน</p>
                    <div className="w-full h-[50px] px-4 flex items-center rounded-[9px] border border-[rgba(208,216,233,0.41)] bg-[#F5F5F6] text-[#5D76AD]">
                     {nationajid}
                    </div>
                  </div>
                  <div className="w-full sm:w-1/2">
                    <p className="text-[#6C7996A6] text-[16px] mb-1">หมายเลขโทรศัพท์</p>
                    <div className="w-full h-[50px] px-4 flex items-center rounded-[9px] border border-[rgba(208,216,233,0.41)] bg-[#F5F5F6] text-[#5D76AD]">
                      {phonenumber}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mt-3">
                  <div className="w-full sm:w-1/2">
                    <p className="text-[#6C7996A6] text-[16px] mb-1">ธนาคาร</p>
                    <div className="w-full h-[50px] px-4 flex items-center rounded-[9px] border border-[rgba(208,216,233,0.41)] bg-[#F5F5F6] text-[#5D76AD]">
                     {namebank}
                    </div>
                  </div>
                  <div className="w-full sm:w-1/2">
                    <p className="text-[#6C7996A6] text-[16px] mb-1">เลขบัญชีธนาคาร</p>
                    <div className="w-full h-[50px] px-4 flex items-center rounded-[9px] border border-[rgba(208,216,233,0.41)] bg-[#F5F5F6] text-[#5D76AD]">
                      {numberbankacc}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full lg:w-[60%] h-auto flex-shrink-0 rounded-2xl border border-[#D0D8E9] bg-white shadow-[0px_0px_60.1px_-16px_#D9DDE5]">
              <div className="p-10">
                {/* เนื้อหาของกล่องขวา */}
                <p className="text-[28px] font-bold text-[#213766E5] mt-8">
                  ที่อยู่
                </p>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mt-3">
                  <div className="w-full sm:w-[40%]">
                    <p className="text-[#6C7996A6] text-[16px] mb-1">บ้านเลขที่, ซอย, หมู่</p>
                    <div className="w-full h-[50px] px-4 flex items-center rounded-[9px] border border-[rgba(208,216,233,0.41)] bg-[#F5F5F6] text-[#5D76AD]">
                      {housenum}
                    </div>
                  </div>
                  <div className="w-full sm:w-[60%]">
                    <p className="text-[#6C7996A6] text-[16px] mb-1">ตำบล</p>
                    <div className="w-full h-[50px] px-4 flex items-center rounded-[9px] border border-[rgba(208,216,233,0.41)] bg-[#F5F5F6] text-[#5D76AD]">
                      {subdistrict}
                    </div>
                  </div>
                </div>
                <div className="w-full mt-3">
                  <p className="text-[#6C7996A6] text-[16px] mb-1">อำเภอ</p>
                  <div className="w-full h-[50px] px-4 flex items-center rounded-[9px] border border-[rgba(208,216,233,0.41)] bg-[#F5F5F6] text-[#5D76AD]">
                    {district}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mt-3">
                  <div className="w-full sm:w-[70%]">
                    <p className="text-[#6C7996A6] text-[16px] mb-1">จังหวัด</p>
                    <div className="w-full h-[50px] px-4 flex items-center rounded-[9px] border border-[rgba(208,216,233,0.41)] bg-[#F5F5F6] text-[#5D76AD]">
                      {province}
                    </div>
                  </div>
                  <div className="w-full sm:w-[30%]">
                    <p className="text-[#6C7996A6] text-[16px] mb-1">รหัสไปรษณีย์</p>
                    <div className="w-full h-[50px] px-4 flex items-center rounded-[9px] border border-[rgba(208,216,233,0.41)] bg-[#F5F5F6] text-[#5D76AD]">
                      {postalnumber}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
    //   <div className="flex flex-col min-h-screen bg-[#FBFBFB] overflow-hidden">
    //     <Header />
    //     <main className="flex-grow">
    //       <div className="lg:mx-60 mt-10 mb-5">
    //         <div className="flex items-center justify-center lg:mb-10 mb-10">
    //           <div className="rounded-full bg-gray-400 h-20 w-20 flex items-center justify-center">
    //             <svg
    //               className="h-10 w-10 text-gray-200"
    //               xmlns="http://www.w3.org/2000/svg"
    //               viewBox="0 0 24 24"
    //               fill="currentColor"
    //             >
    //               <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    //             </svg>
    //           </div>
    //         </div>
    //         <div className="w-full mt-2 lg:w-2/3 mx-auto">
    //           <h2 className="text-xl font-bold text-gray-700 mb-2">Username: {username}</h2>
    //           <p className="text-lg text-gray-700 mb-2">ชื่อ-นามสกุล: {fullname}</p>
    //           <p className="text-lg text-gray-700 mb-2">อีเมล: {email}</p>
    //           <p className="text-lg text-gray-700 mb-2">เบอร์โทรศัพท์: {phonenumber}</p>
    //           <p className="text-lg text-gray-700 mb-2">ชื่อ: {firstname}</p>
    //           <p className="text-lg text-gray-700 mb-2">นามสกุล: {lastname}</p>
    //           <p className="text-lg text-gray-700 mb-2">ธนาคาร: {namebank}</p>
    //           <p className="text-lg text-gray-700 mb-2">เลขที่บัตรประชาชน: {nationajid}</p>
    //           <p className="text-lg text-gray-700 mb-2">เลขที่บัญชีธนาคาร: {numberbankacc}</p>
    //           <p className="text-lg text-gray-700 mb-2">ที่อยู่: {housenum} </p>
    //           <p className="text-lg text-gray-700 mb-2">ตำบล: {subdistrict}</p>
    //           <p className="text-lg text-gray-700 mb-2">อำเภอ: {district}</p>
    //           <p className="text-lg text-gray-700 mb-2">จังหวัด: {province}</p>
    //         </div>
    //       </div>
    //     </main>
    //   </div>
  );
};

export default Detail;
