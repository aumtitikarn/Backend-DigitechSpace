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
  facebook: string | null;
  line: string | null;
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
    facebook: searchParams.get("facebook"),
    line: searchParams.get("line"),
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
                  <p className="text-[#6C7996A6] text-[16px] mb-1 font-semibold">
                    ชื่อ - นามสกุล
                  </p>
                  <div className="w-full h-[50px] px-4 flex items-center rounded-[9px] border border-[rgba(208,216,233,0.41)] bg-[#F5F5F6] text-[#5D76AD]">
                    <p className="font-semibold">
                      {" "}
                      {userDetails.fullname || "N/A"}{" "}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mt-3">
                  <div className="w-full sm:w-1/2">
                    <p className="text-[#6C7996A6] text-[16px] mb-1 font-semibold">
                      เลขที่บัตรประชาชน
                    </p>
                    <div className="w-full h-[50px] px-4 flex items-center rounded-[9px] border border-[rgba(208,216,233,0.41)] bg-[#F5F5F6] text-[#5D76AD]">
                      <p className="font-semibold">
                        {" "}
                        {userDetails.nationajid || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="w-full sm:w-1/2">
                    <p className="text-[#6C7996A6] text-[16px] mb-1 font-semibold">
                      หมายเลขโทรศัพท์
                    </p>
                    <div className="w-full h-[50px] px-4 flex items-center rounded-[9px] border border-[rgba(208,216,233,0.41)] bg-[#F5F5F6] text-[#5D76AD]">
                      <p className="font-semibold">
                        {" "}
                        {userDetails.phonenumber || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mt-3">
                  <div className="w-full sm:w-1/2">
                    <p className="text-[#6C7996A6] text-[16px] mb-1 font-semibold">
                      ธนาคาร
                    </p>
                    <div className="w-full h-[50px] px-4 flex items-center rounded-[9px] border border-[rgba(208,216,233,0.41)] bg-[#F5F5F6] text-[#5D76AD]">
                      <p className="font-semibold">
                        {" "}
                        {userDetails.namebank || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="w-full sm:w-1/2">
                    <p className="text-[#6C7996A6] text-[16px] mb-1 font-semibold">
                      เลขบัญชีธนาคาร
                    </p>
                    <div className="w-full h-[50px] px-4 flex items-center rounded-[9px] border border-[rgba(208,216,233,0.41)] bg-[#F5F5F6] text-[#5D76AD]">
                      <p className="font-semibold">
                        {" "}
                        {userDetails.numberbankacc || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="w-full mt-3">
                  <p className="text-[#6C7996A6] text-[16px] mb-1 font-semibold">
                    Facebook
                  </p>
                  <div className="w-full h-[50px] px-4 flex items-center rounded-[9px] border border-[rgba(208,216,233,0.41)] bg-[#F5F5F6] text-[#5D76AD]">
                    <p className="font-semibold">
                      {" "}
                      {userDetails.facebook || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="w-full mt-3">
                  <p className="text-[#6C7996A6] text-[16px] mb-1 font-semibold">
                    Line
                  </p>
                  <div className="w-full h-[50px] px-4 flex items-center rounded-[9px] border border-[rgba(208,216,233,0.41)] bg-[#F5F5F6] text-[#5D76AD]">
                    <p className="font-semibold">
                      {" "}
                      {userDetails.line || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full lg:w-[60%] h-auto flex-shrink-0 rounded-2xl border border-[#D0D8E9] bg-white shadow-[0px_0px_60.1px_-16px_#D9DDE5]">
              <div className="p-10">
                <p className="text-[28px] font-bold text-[#213766E5] mt-8 font-semibold">
                  ที่อยู่
                </p>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mt-3">
                  <div className="w-full sm:w-[40%]">
                    <p className="text-[#6C7996A6] text-[16px] mb-1 font-semibold">
                      บ้านเลขที่, ซอย, หมู่
                    </p>
                    <div className="w-full h-[50px] px-4 flex items-center rounded-[9px] border border-[rgba(208,216,233,0.41)] bg-[#F5F5F6] text-[#5D76AD]">
                      <p className="font-semibold">
                        {" "}
                        {userDetails.housenum || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="w-full sm:w-[60%]">
                    <p className="text-[#6C7996A6] text-[16px] mb-1 font-semibold">
                      ตำบล
                    </p>
                    <div className="w-full h-[50px] px-4 flex items-center rounded-[9px] border border-[rgba(208,216,233,0.41)] bg-[#F5F5F6] text-[#5D76AD]">
                      <p className="font-semibold">
                        {" "}
                        {userDetails.subdistrict || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="w-full mt-3">
                  <p className="text-[#6C7996A6] text-[16px] mb-1 font-semibold">
                    อำเภอ
                  </p>
                  <div className="w-full h-[50px] px-4 flex items-center rounded-[9px] border border-[rgba(208,216,233,0.41)] bg-[#F5F5F6] text-[#5D76AD]">
                    <p className="font-semibold">
                      {" "}
                      {userDetails.district || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mt-3">
                  <div className="w-full sm:w-1/2">
                    <p className="text-[#6C7996A6] text-[16px] mb-1 font-semibold">
                      จังหวัด
                    </p>
                    <div className="w-full h-[50px] px-4 flex items-center rounded-[9px] border border-[rgba(208,216,233,0.41)] bg-[#F5F5F6] text-[#5D76AD]">
                      <p className="font-semibold">
                        {" "}
                        {userDetails.province || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="w-full sm:w-1/2">
                    <p className="text-[#6C7996A6] text-[16px] mb-1 font-semibold">
                      รหัสไปรษณีย์
                    </p>
                    <div className="w-full h-[50px] px-4 flex items-center rounded-[9px] border border-[rgba(208,216,233,0.41)] bg-[#F5F5F6] text-[#5D76AD]">
                      <p className="font-semibold">
                        {" "}
                        {userDetails.postalnumber || "N/A"}
                      </p>
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
