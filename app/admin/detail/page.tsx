"use client";

import React, { useState, useRef, useEffect, Suspense } from 'react';
import { useSearchParams } from "next/navigation"; // Ensure you import this if you want to use it
import Header from "../../component/Header";
import Link from "next/link";
import { MdAccountCircle } from "react-icons/md";
import Image from "next/image";
import Swal from 'sweetalert2';
// Loading Component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);
const getProxyUrl = (url: string) => `/api/proxy?url=${encodeURIComponent(url)}`;

const isValidHttpUrl = (string: string) => {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
};

const getImageSource = (imageUrl: string | null) => {
  if (imageUrl && imageUrl.length > 0) {
    if (isValidHttpUrl(imageUrl)) {
      return getProxyUrl(imageUrl);
    } else {
      return `/api/imagesprofile/${imageUrl}`;
    }
  }
  return null;
};

const DetailContent = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const name = searchParams.get("name");
  const email = searchParams.get("email");
  const numberphone = searchParams.get("numberphone");
  const imageUrl = searchParams.get("imageUrl");
  const facebook = searchParams.get("facebook");
  const line = searchParams.get("line");
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
    if (!email) {
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่พบอีเมลของผู้ใช้',
      });
      return;
    }

    setIsSending(true);

    try {
      const response = await fetch('/api/sendemail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          subject: "Digitech Space",
          emailContent: emailContent,
        }),
      });

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'สำเร็จ',
          text: 'ส่งอีเมลสำเร็จ',
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

  // Get the image source using the utility function
  const imageSource = getImageSource(imageUrl);

  return (
    <div className="flex flex-col min-h-screen bg-[#FBFBFB] overflow-hidden">
      <Header />
      <main className="flex-grow">
        <div className="lg:mx-60 mt-10 mb-5">
          <div className=" flex  justify-center lg:mb-10  mb-10 ">
            <div className="w-auto lg:w-[878px] h-auto flex-shrink-0 rounded-2xl border border-[#D0D8E9] bg-white shadow-[0px_0px_60.1px_-16px_#D9DDE5]">
              <div className="p-10">
                <div className="flex justify-center">
                {imageSource ? (
                  <Image
                    width={95}
                    height={95}
                    src={imageSource}
                    alt="Profile Image"
                    unoptimized={true}
                    style={{
                      objectFit: "cover",
                      borderRadius: "50%",
                      width: "95px",
                      height: "95px",
                      margin: "15px",
                    }}
                  />
                ) : (
                  <MdAccountCircle
                    className="text-[100px] text-gray-600"
                    style={{ width: "95px", height: "95px", margin: "15px" }}
                  />
                )}
                </div>
                <div className="flex flex-col">
                  <span className="mt-3 text-center text-[28px] font-bold text-[#213766E5] text-center">
                    {name || "N/A"}
                  </span>
                  <span className="text-center text-[20px] text-[#6C7996E5]">
                    {email || "N/A"}
                  </span>
                </div>
                <div className="w-full mt-10">
                  <p className="text-[#6C7996A6] text-[16px] mb-1 font-semibold">
                    หมายเลขโทรศัพท์
                  </p>
                  <div className="w-full h-[50px] px-4 flex items-center rounded-[9px] border border-[rgba(208,216,233,0.41)] bg-[#F5F5F6] text-[#5D76AD]">
                    <p className="font-semibold"> {numberphone || "N/A"}</p>
                  </div>
                  <p className="mt-3 text-[#6C7996A6] text-[16px] mb-1 font-semibold">
                    Facebook
                  </p>
                  <div className="w-full h-[50px] px-4 flex items-center rounded-[9px] border border-[rgba(208,216,233,0.41)] bg-[#F5F5F6] text-[#5D76AD]">
                    <p className="font-semibold"> {facebook || "N/A"}</p>
                  </div>
                  <p className="mt-3 text-[#6C7996A6] text-[16px] mb-1 font-semibold">
                    Line
                  </p>
                  <div className="w-full h-[50px] px-4 flex items-center rounded-[9px] border border-[rgba(208,216,233,0.41)] bg-[#F5F5F6] text-[#5D76AD]">
                    <p className="font-semibold"> {line || "N/A"}</p>
                  </div>
                  <div className="my-10 w-full border-t-2 border-dashed border-[#9CB1E0] opacity-34"></div>
                  <div className="w-full ">
                  <p className="text-[#6C7996A6] text-[16px] mb-1 font-semibold">
                    ส่งอีเมลหาแอดมิน
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
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const Detail: React.FC = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <DetailContent />
    </Suspense>
  );
};

export default Detail;

