"use client";

import Header from "../../component/Header";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Swal from 'sweetalert2';

const Detail: React.FC = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [withdrawalDetails, setWithdrawalDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userBankInfo, setUserBankInfo] = useState<{
    namebank: string;
    numberbankacc: string;
    fullname: string;
    phonenumber: string;
    firstname: string;
    lastname: string;
    username: string;
  } | null>(null);

  useEffect(() => {
    const fetchWithdrawalDetails = async () => {
      if (!id) return;

      try {
        const response = await fetch(`/api/withdrawals/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch withdrawal details");
        }
        const data = await response.json();
        setWithdrawalDetails(data.post);

        const email = data.post.receipt.email;
        console.log("Fetching user data for email:", email);

        const userResponse = await fetch(`/api/studetuser?email=${email}`);
        if (userResponse.ok) {
          const userData = await userResponse.json();
          console.log("User data fetched:", userData);

          if (userData.studentusers && userData.studentusers.length > 0) {
            const user = userData.studentusers[0];
            setUserBankInfo({
              namebank: user.SellInfo?.namebank || "ไม่พบข้อมูลธนาคาร",
              numberbankacc: user.SellInfo?.numberbankacc || "ไม่พบเลขบัญชี",
              fullname: user.SellInfo?.fullname || "ไม่พบชื่อจริง",
              phonenumber: user.SellInfo?.phonenumber || "ไม่พบเบอร์โทร",
              firstname: user.firstname || "ไม่พบชื่อ",
              lastname: user.lastname || "ไม่พบนามสกุล",
              username: user.username || "ไม่พบชื่อผู้ใช้",
            });
          } else {
            setError("ไม่พบข้อมูลผู้ใช้");
          }
        } else {
          throw new Error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("เกิดข้อผิดพลาดในการโหลดข้อมูล");
      } finally {
        setLoading(false);
      }
    };

    fetchWithdrawalDetails();
  }, [id]);

  const handleComplete = async (id: string | null, email: string) => {
    if (!id) {
      await Swal.fire({
        icon: 'error',
        title: 'ข้อผิดพลาด',
        text: 'ไม่พบรหัสโครงการ',
      });
      return;
    }
  
    const result = await Swal.fire({
      title: 'คุณแน่ใจหรือไม่?',
      text: "คุณโอนเงินให้ผู้ถอนแล้วใช่หรือไม่?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ใช่, ทำเครื่องหมาย',
      cancelButtonText: 'ยกเลิก'
    });
  
    if (result.isConfirmed) {
      try {
        const response = await fetch(`/api/withdrawals/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "completed" }),
        });
  
        if (!response.ok) {
          const data = await response.json();
          await Swal.fire({
            icon: 'error',
            title: 'เกิดข้อผิดพลาด',
            text: ` ${data.msg || "ข้อผิดพลาดที่ไม่ทราบสาเหตุ"}`,
          });
          return;
        }
  
        const notificationMessage = "คำขอถอนเงินของคุณสำเร็จแล้ว";
  
        const notificationResponse = await fetch("/api/notification", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, notificationValue: notificationMessage }),
        });
  
        if (!notificationResponse.ok) {
          const notificationData = await notificationResponse.json();
          console.error("ไม่สามารถส่งการแจ้งเตือนได้:", notificationData);
        }
  
        await Swal.fire({
          icon: 'success',
          title: 'สำเร็จ',
          text: 'ทำเครื่องหมายโครงการว่าเสร็จสมบูรณ์เรียบร้อยแล้ว',
        });
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการทำเครื่องหมายโครงการว่าเสร็จสมบูรณ์:", error);
        await Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: 'เกิดข้อผิดพลาดในขณะทำเครื่องหมายโครงการว่าเสร็จสมบูรณ์',
        });
      }
    }
  };
  
  const handleDelete = async (id: string | null, email: string) => {
    if (!id) {
      await Swal.fire({
        icon: 'error',
        title: 'ข้อผิดพลาด',
        text: 'ไม่พบรหัสโครงการ',
      });
      return;
    }
  
    const result = await Swal.fire({
      title: 'คุณแน่ใจหรือไม่?',
      text: "คุณไม่อนุมัติคำร้องนี้ใช่หรือไม่?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ใช่, ทำเครื่องหมาย',
      cancelButtonText: 'ยกเลิก'
    });
  
    if (result.isConfirmed) {
      try {
        const response = await fetch(`/api/withdrawals/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "failed" }),
        });
  
        if (response.ok) {
          const notificationMessage = "คำขอถอนเงินของคุณไม่สำเร็จเนื่องจากข้อมูลไม่ตรงกัน";
  
          const notificationResponse = await fetch("/api/notification", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email,
              notificationValue: notificationMessage,
            }),
          });
  
          if (!notificationResponse.ok) {
            const notificationData = await notificationResponse.json();
            console.error("ไม่สามารถส่งการแจ้งเตือนได้:", notificationData);
            await Swal.fire({
              icon: 'error',
              title: 'เกิดข้อผิดพลาด',
              text: 'ไม่สามารถส่งการแจ้งเตือนได้ โปรดลองอีกครั้ง',
            });
          } else {
            await Swal.fire({
              icon: 'success',
              title: 'สำเร็จ',
              text: 'ส่งการแจ้งเตือนเรียบร้อยแล้ว',
            });
          }
  
          await Swal.fire({
            icon: 'success',
            title: 'สำเร็จ',
            text: 'ทำเครื่องหมายโครงการว่าล้มเหลวเรียบร้อยแล้ว',
          });
        } else {
          const data = await response.json();
          await Swal.fire({
            icon: 'error',
            title: 'เกิดข้อผิดพลาด',
            text: `ไม่สามารถทำเครื่องหมายโครงการว่าล้มเหลวได้: ${data.error || "ข้อผิดพลาดที่ไม่ทราบสาเหตุ"}`,
          });
        }
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการทำเครื่องหมายโครงการว่าล้มเหลว:", error);
        await Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: 'เกิดข้อผิดพลาดในขณะทำเครื่องหมายโครงการว่าล้มเหลว',
        });
      }
    }
  };
  
  const handleSubmit2 = async (id: string | null) => {
    if (!id) {
      await Swal.fire({
        icon: 'error',
        title: 'ข้อผิดพลาด',
        text: 'ไม่พบรหัสบล็อก',
      });
      return;
    }
  
    const email = withdrawalDetails?.receipt.email;
    const fullname = userBankInfo?.fullname;
  
    if (!email || !fullname) {
      await Swal.fire({
        icon: 'error',
        title: 'ข้อผิดพลาด',
        text: 'ไม่พบอีเมลหรือชื่อผู้เขียน',
      });
      return;
    }
  
    const result = await Swal.fire({
      title: 'คุณแน่ใจหรือไม่?',
      text: "คุณต้องการติดต่อผู้ถอนใช่หรือไม่?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ใช่, ดำเนินการ',
      cancelButtonText: 'ยกเลิก'
    });
  
    if (result.isConfirmed) {
      try {
        const response = await fetch(`/api/withdrawals`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id,
            email,
            fullname,
          }),
        });
  
        if (response.ok) {
          await Swal.fire({
            icon: 'success',
            title: 'สำเร็จ',
            text: 'ส่งอีเมลเรียบร้อยแล้ว!',
          });
        } else {
          const errorData = await response.json();
          console.error("รายละเอียดข้อผิดพลาด:", errorData);
          await Swal.fire({
            icon: 'error',
            title: 'เกิดข้อผิดพลาด',
            text: `ไม่สามารถส่งอีเมลได้: ${errorData.msg || response.statusText}`,
          });
        }
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการติดต่อเจ้าของโครงการ:", error);
        await Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: 'เกิดข้อผิดพลาดในขณะติดต่อเจ้าของโครงการ',
        });
      }
    }
  };
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FBFBFB] overflow-hidden">
      <Header />
      <main className="flex-grow">
      <div className="flex items-center justify-center  my-10">
          <div className="w-auto lg:w-[878px] h-auto flex-shrink-0 rounded-2xl border border-[#D0D8E9] bg-white shadow-[0px_0px_60.1px_-16px_#D9DDE5]">
            <div className="p-10">
              <p className="font-bold  text-[#213766E5] text-[35px] text-center">
                คำร้องขอถอนเงิน
              </p>
              <p className="text-[#6C7996] mt-5 font-semibold text-center">
              จำนวนเงิน
              </p>
              <p className="text-[#5D76AD] mt-5 font-bold text-center text-[30px]">
              {(withdrawalDetails?.withdrawn || 0).toLocaleString('th-TH')} THB
              </p>
              <div className="my-10 w-full border-t-2 border-dashed border-[#9CB1E0] opacity-34"></div>
              <p className="text-[#6C7996] mt-5 font-semibold text-center">
              จาก
              </p>
              <div className="font-semibold mt-2 w-full h-auto p-3  rounded-[9px] border border-[rgba(208,216,233,0.41)] bg-[#F5F5F6] text-[#5D76AD]">
              <p className="text-center">{userBankInfo?.fullname || "ไม่พบชื่อจริง"}</p>
              </div>
              <p className="text-[#6C7996] mt-10 font-semibold text-center">
              ธนาคาร
              </p>
              <div className="font-semibold mt-2 w-full h-auto p-3  rounded-[9px] border border-[rgba(208,216,233,0.41)] bg-[#F5F5F6] text-[#5D76AD]">
              <p className="text-center">{userBankInfo?.namebank || "ไม่พบข้อมูลธนาคาร"}</p>
              </div>
              <p className="text-[#6C7996] mt-10 font-semibold text-center">
              เลขบัญชี
              </p>
              <div className="font-semibold mt-2 w-full h-auto p-3  rounded-[9px] border border-[rgba(208,216,233,0.41)] bg-[#F5F5F6] text-[#5D76AD]">
              <p className="text-center">{userBankInfo?.numberbankacc || "ไม่พบเลขบัญชี"}</p>
              </div>
              <div className="flex justify-center mt-10">
                      <div className="flex item-center space-x-[30px]">
                        <button
                          onClick={() =>
                            handleDelete(id, withdrawalDetails?.receipt.email)
                          }
                          className="w-[172px] h-[66px] flex-shrink-0 rounded-[10px] border border-[#B7CCFC] bg-white text-[#213766E5] font-semibold flex items-center justify-center hover:bg-[#F0F5FF] transition-colors duration-300"
                        >
                         <p className="text-[#5D76AD]">ไม่อนุมัติ</p>
                        </button>
                        <button
                          onClick={() => handleComplete(id, withdrawalDetails?.receipt.email)}
                          className="w-[172px] h-[66px] flex-shrink-0 rounded-[10px] bg-[#5D76AD] text-white font-semibold flex items-center justify-center hover:bg-[#4A5F8C] transition-colors duration-300"
                        >
                          เสร็จสิ้น
                        </button>
                      </div>
                    </div>
                    <div className="text-center mt-5">
                    <u className="text-[#80A1EB] hover:text-[#B7CCFC]" onClick={() => handleSubmit2(id)}>ติดต่อผู้ถอน</u>
                    </div>
                  </div>
            </div>  
          </div>
      </main>
    </div>
  );
};

export default Detail;
