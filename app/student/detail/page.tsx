"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import Header from "../../component/Header";
import { MdAccountCircle } from "react-icons/md";

interface UserDetails {
  username?: string | null;
  housenum?: string | null;
  phonenumber?: string | null;
  email?: string | null;
  district?: string | null;
  fullname?: string | null;
  namebank?: string | null;
  nationajid?: string | null;
  numberbankacc?: string | null;
  province?: string | null;
  subdistrict?: string | null;
  firstname?: string | null;
  lastname?: string | null;
  postalnumber?: string | null;
}

const Detail: React.FC = () => {
  const searchParams = useSearchParams();
  const userDetails: UserDetails = {
    username: searchParams.get("username"),
    housenum: searchParams.get("housenum"),
    phonenumber: searchParams.get("phonenumber"),
    email: searchParams.get("email"),
    district: searchParams.get("district"),
    fullname: searchParams.get("fullname"),
    namebank: searchParams.get("namebank"),
    nationajid: searchParams.get("nationajid"),
    numberbankacc: searchParams.get("numberbankacc"),
    province: searchParams.get("province"),
    subdistrict: searchParams.get("subdistrict"),
    firstname: searchParams.get("firstname"),
    lastname: searchParams.get("lastname"),
    postalnumber: searchParams.get("postalnumber"),
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FBFBFB] overflow-hidden text-black">
      <Header />
      <main className="flex-grow">
        <div className="flex flex-col items-center justify-center my-10 w-full px-4">
          <div className="flex flex-col lg:flex-row w-full max-w-[1430px] space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="w-full lg:w-[40%] h-auto flex-shrink-0 rounded-2xl border border-[#D0D8E9] bg-white shadow-[0px_0px_60.1px_-16px_#D9DDE5]">
              <div className="p-10">
                <div className="flex items-center space-x-4 p-4">
                  <MdAccountCircle className="text-[100px] text-gray-600" />
                  <div className="flex flex-col">
                    <span className="text-[28px] font-bold text-[#213766E5]">
                      {userDetails.username || "N/A"}
                    </span>
                    <span className="text-[20px] text-[#6C7996E5]">
                      {userDetails.email || "N/A"}
                    </span>
                  </div>
                </div>
                <div className="w-full">
                  <p className="text-[#6C7996A6] text-[16px] mb-1">ชื่อ - นามสกุล</p>
                  <div className="w-full h-[50px] px-4 flex items-center rounded-[9px] border border-[rgba(208,216,233,0.41)] bg-[#F5F5F6] text-[#5D76AD]">
                    {userDetails.fullname || "N/A"}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mt-3">
                  <div className="w-full sm:w-1/2">
                    <p className="text-[#6C7996A6] text-[16px] mb-1">เลขที่บัตรประชาชน</p>
                    <div className="w-full h-[50px] px-4 flex items-center rounded-[9px] border border-[rgba(208,216,233,0.41)] bg-[#F5F5F6] text-[#5D76AD]">
                      {userDetails.nationajid || "N/A"}
                    </div>
                  </div>
                  <div className="w-full sm:w-1/2">
                    <p className="text-[#6C7996A6] text-[16px] mb-1">หมายเลขโทรศัพท์</p>
                    <div className="w-full h-[50px] px-4 flex items-center rounded-[9px] border border-[rgba(208,216,233,0.41)] bg-[#F5F5F6] text-[#5D76AD]">
                      {userDetails.phonenumber || "N/A"}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mt-3">
                  <div className="w-full sm:w-1/2">
                    <p className="text-[#6C7996A6] text-[16px] mb-1">ธนาคาร</p>
                    <div className="w-full h-[50px] px-4 flex items-center rounded-[9px] border border-[rgba(208,216,233,0.41)] bg-[#F5F5F6] text-[#5D76AD]">
                      {userDetails.namebank || "N/A"}
                    </div>
                  </div>
                  <div className="w-full sm:w-1/2">
                    <p className="text-[#6C7996A6] text-[16px] mb-1">เลขบัญชีธนาคาร</p>
                    <div className="w-full h-[50px] px-4 flex items-center rounded-[9px] border border-[rgba(208,216,233,0.41)] bg-[#F5F5F6] text-[#5D76AD]">
                      {userDetails.numberbankacc || "N/A"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full lg:w-[60%] h-auto flex-shrink-0 rounded-2xl border border-[#D0D8E9] bg-white shadow-[0px_0px_60.1px_-16px_#D9DDE5]">
              <div className="p-10">
                <p className="text-[28px] font-bold text-[#213766E5] mt-8">ที่อยู่</p>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mt-3">
                  <div className="w-full sm:w-[40%]">
                    <p className="text-[#6C7996A6] text-[16px] mb-1">บ้านเลขที่, ซอย, หมู่</p>
                    <div className="w-full h-[50px] px-4 flex items-center rounded-[9px] border border-[rgba(208,216,233,0.41)] bg-[#F5F5F6] text-[#5D76AD]">
                      {userDetails.housenum || "N/A"}
                    </div>
                  </div>
                  <div className="w-full sm:w-[60%]">
                    <p className="text-[#6C7996A6] text-[16px] mb-1">ตำบล</p>
                    <div className="w-full h-[50px] px-4 flex items-center rounded-[9px] border border-[rgba(208,216,233,0.41)] bg-[#F5F5F6] text-[#5D76AD]">
                      {userDetails.subdistrict || "N/A"}
                    </div>
                  </div>
                </div>
                <div className="w-full mt-3">
                  <p className="text-[#6C7996A6] text-[16px] mb-1">อำเภอ</p>
                  <div className="w-full h-[50px] px-4 flex items-center rounded-[9px] border border-[rgba(208,216,233,0.41)] bg-[#F5F5F6] text-[#5D76AD]">
                    {userDetails.district || "N/A"}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mt-3">
                  <div className="w-full sm:w-1/2">
                    <p className="text-[#6C7996A6] text-[16px] mb-1">จังหวัด</p>
                    <div className="w-full h-[50px] px-4 flex items-center rounded-[9px] border border-[rgba(208,216,233,0.41)] bg-[#F5F5F6] text-[#5D76AD]">
                      {userDetails.province || "N/A"}
                    </div>
                  </div>
                  <div className="w-full sm:w-1/2">
                    <p className="text-[#6C7996A6] text-[16px] mb-1">รหัสไปรษณีย์</p>
                    <div className="w-full h-[50px] px-4 flex items-center rounded-[9px] border border-[rgba(208,216,233,0.41)] bg-[#F5F5F6] text-[#5D76AD]">
                      {userDetails.postalnumber || "N/A"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Detail;
