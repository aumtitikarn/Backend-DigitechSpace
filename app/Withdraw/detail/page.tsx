"use client";

import Header from "../../component/Header";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

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
        alert("Project ID is missing");
        return;
    }

    const confirmed = confirm("Are you sure you want to mark this project as completed?");
    if (!confirmed) return;

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
            alert(`Failed to mark project as completed: ${data.msg || "Unknown error"}`);
           
            return;
        }

        // บันทึกข้อความแจ้งเตือน
        const notificationMessage = "Your withdrawal request has been successful."; 

        // ส่งข้อความแจ้งเตือนไปยัง API
        const notificationResponse = await fetch('/api/notification', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, notificationValue: notificationMessage }), // ส่ง email และ notificationMessage
        });

        // ตรวจสอบผลลัพธ์จากการส่งข้อความแจ้งเตือน
        if (!notificationResponse.ok) {
            const notificationData = await notificationResponse.json();
            console.error("Failed to send notification:", notificationData);
        }

        alert("Project marked as completed successfully");
        // Send notification to user

    } catch (error) {
        console.error("Error marking project as completed:", error);
        alert("An error occurred while marking the project as completed.");
        
    }
};


const handleDelete = async (id: string | null, email: string) => {
  if (!id) {
      alert("Project ID is missing");
      return;
  }

  const confirmed = confirm("Are you sure you want to mark this project as failed?");
  if (!confirmed) return;

  try {
      const response = await fetch(`/api/withdrawals/${id}`, {
          method: "PATCH",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "failed" }),
      });

      if (response.ok) {
          // บันทึกข้อความแจ้งเตือน
          const notificationMessage = "Your withdrawal request was unsuccessful due to inconsistent information."; // เปลี่ยนข้อความตามที่เหมาะสม

          const notificationResponse = await fetch('/api/notification', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ email, notificationValue: notificationMessage }), // ส่ง email และ notificationMessage
          });

          if (!notificationResponse.ok) {
              const notificationData = await notificationResponse.json();
              console.error("Failed to send notification:", notificationData);
              alert("Failed to send notification. Please try again.");
          } else {
              alert("Notification sent successfully.");
          }

          alert("Project marked as failed successfully");

      } else {
          const data = await response.json();
          alert(`Failed to mark project as failed: ${data.error || "Unknown error"}`);
      }
  } catch (error) {
      console.error("Error marking project as failed:", error);
      alert("An error occurred while marking the project as failed.");
  }
};

const handleSubmit2 = async (id: string | null) => {
  if (!id) {
    alert("Blog ID is missing");
    return;
  }

  const email = withdrawalDetails?.receipt.email;
  const fullname = userBankInfo?.fullname;

  if (!email || !fullname) {
    alert("Email or Author is missing");
    return;
  }

  const confirmed = confirm("Are you sure?");
  if (!confirmed) return;

  try {
    const response = await fetch(`/api/withdrawals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
        email,
        fullname
      }),
    });

    if (response.ok) {
      alert("Email sent successfully!");
    } else {
      // Log status and message for debugging
      const errorData = await response.json();
      console.error("Error details:", errorData);
      alert(`Failed to send email: ${errorData.msg || response.statusText}`);
    }
  } catch (error) {
    console.error("Error contacting project owner:", error);
    alert("An error occurred while contacting the project owner.");
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
        <div className="lg:mx-64 lg:mt-10 lg:mb-10 mt-10 mb-10 mx-5">
          <div className="flex flex-col justify-center w-full lg:w-2/3 mx-auto">
            <h1 className="text-lg font-bold mt-5 mb-5 text-black" style={{ fontSize: "36px" }}>คำร้องขอถอนเงิน</h1>
            <p className="mt-2 text-lg">โดย {withdrawalDetails?.receipt.fullname || ""}</p>

            <h1 className="text-xl font-bold mt-4" style={{ fontSize: "24px" }}>จำนวนเงิน</h1>
            <p className="mt-2 text-lg">{withdrawalDetails?.withdrawn || 0} บาท</p>

            <h1 className="text-xl font-bold mt-4" style={{ fontSize: "24px" }}>ช่องทางการรับเงิน</h1>
            <p className="mt-2 text-lg">ชื่อธนาคาร: {userBankInfo?.namebank || "ไม่พบข้อมูลธนาคาร"}</p>
            <p className="mt-2 text-lg">เลขบัญชี: {userBankInfo?.numberbankacc || "ไม่พบเลขบัญชี"}</p>
            <p className="mt-2 text-lg">ชื่อ: {userBankInfo?.fullname || "ไม่พบชื่อจริง"}</p>

            <h1 className="text-xl font-bold mt-4" style={{ fontSize: "24px" }}>ข้อมูลผู้ขาย</h1>
            <p className="mt-2 text-lg">ชื่อ: {userBankInfo?.firstname || "ไม่พบชื่อจริง"}</p>
            <p className="mt-2 text-lg">นามสกุล: {userBankInfo?.lastname || "ไม่พบนามสกุล"}</p>
            <p className="mt-2 text-lg">ชื่อผู้ใช้: {userBankInfo?.username || "ไม่พบชื่อผู้ใช้"}</p>
            <p className="mt-2 text-lg">เบอร์โทร: {userBankInfo?.phonenumber || "ไม่พบเบอร์โทร"}</p>
            <p className="mt-2 text-lg">อีเมล: {withdrawalDetails?.receipt.email || "ไม่พบอีเมล"}</p>

            <div className="mt-6 flex flex-col gap-4">
              <button
                onClick={() => handleComplete(id, withdrawalDetails?.receipt.email)}
                className="w-full p-2 text-white rounded"
                style={{ backgroundColor: "#33539B" }}
              >
                เสร็จสิ้น
              </button>
              <button
  onClick={() => handleSubmit2(id)}
  className="w-full p-2 text-white rounded"
  style={{ backgroundColor: "#1976D2" }}
>
  ติดต่อผู้ถอน
</button>

              <button
                onClick={() =>
                  handleDelete(id, withdrawalDetails?.receipt.email)
                }
                className="w-full p-2 text-white rounded"
                style={{ backgroundColor: "#FF3D00" }}
              >
                ไม่อนุมัติ
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Detail;
