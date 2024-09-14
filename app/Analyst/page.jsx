"use client";

import React, { useEffect,useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Header from "../component/Header"
import Link from "next/link";
import { Doughnut, Line, Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,  // Register ArcElement for Doughnut chart
  PointElement, // Register PointElement for Line chart
  LineElement,  // Register LineElement for Line chart
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import axios from 'axios'; // เพิ่มการ import axios

// Register the necessary components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const page = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCategory1, setSelectedCategory1] = useState("");

  const [roleData, setRoleData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // เรียก API เพื่อนำข้อมูล role
        const result = await axios.get('/api/getanalyst');
        console.log('API Result:', result.data);
        const normalRoles = result.data.normalUsers.map(user => user.roleai);
        const studentRoles = result.data.studentUsers.map(user => user.roleai);

        // นับจำนวน role แต่ละประเภท
        const roles = ['student', 'other', 'developer'];
        const normalCounts = roles.map(role => normalRoles.filter(r => r === role).length);
        const studentCounts = roles.map(role => studentRoles.filter(r => r === role).length);

        // อัพเดท state ด้วยข้อมูลใหม่
        setRoleData({
          labels: roles,
          datasets: [
            {
              label: 'Normal User',
              data: normalCounts,
              backgroundColor: '#33539B',
            },
            {
              label: 'Student User',
              data: studentCounts,
              backgroundColor: '#33539B',
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching role data:", error);
      }
    };

    fetchData();  // เรียกฟังก์ชันเพื่อดึงข้อมูลเมื่อ component ถูก mount
  }, []);  // ใส่ dependency array ที่ว่างเพื่อให้ทำงานเพียงครั้งเดียว

  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    redirect("/auth/signin");
    return null;
  }

  const data1 = {
    labels: ['Program', 'Model/3D', 'Website', 'Datasets', 'Photo/Art', 'MoblieApp', 'AI', 'IOT', 'Document', 'Other'],
    datasets: [
      {
        label: 'Dataset',
        backgroundColor: '#33539B',
        hoverBackgroundColor: '#273E74',
        data: [30000, 15000, 10000, 8000, 6000, 3000, 2000, 1500, 1000, 1000]
      }
    ]
  };

  const data2 = {
    labels: ['Program', 'Model/3D', 'Website', 'Datasets', 'Photo/Art', 'MoblieApp', 'AI', 'IOT', 'Document', 'Other'],
    datasets: [
      {
        label: 'Dataset',
        backgroundColor: '#33539B',
        hoverBackgroundColor: '#273E74',
        data: [100, 90, 85, 75, 65, 50, 45, 45, 30, 25]
      }
    ]
  };

  const data3 = {
    labels: ['นักเรียน', 'ศาสตราจารย์', 'นักพัฒนา', 'ดีไซเนอร์', 'ครู', 'นักวิจัย', 'อื่น'],
    datasets: [
      {
        label: 'Dataset',
        backgroundColor: '#33539B',
        hoverBackgroundColor: '#273E74',
        data: [100, 85, 75, 65, 50, 25, 20, 10]
      }
    ]
  };

  return (
    <main>
      <Header />
      <div className="flex flex-col items-center w-full" style={{ backgroundColor: "#FBFBFB" }}>
        <div className="w-full max-w-screen-lg p-4">
          <div className="flex flex-col">

            <p
              className="mt-3"
              style={{ fontSize: "24px", fontWeight: "bold" }}
            >
              สรุปผล
            </p>

            <div className="flex flex-row w-full mt-10">
              <p
                style={{ fontSize: "24px", fontWeight: "bold", color: "#33539B" }}
              >
                ประจำเดือน
              </p>
              {/* Category Dropdown */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-auto p-2 mb-4 ml-5 border border-gray-300 rounded text-black"
              >
                <option value="" disabled>Select Category</option>
                <option value="Document">Document</option>
                <option value="Model/3D">Model/3D</option>
                <option value="Website">Website</option>
                <option value="MobileApp">MobileApp</option>
                <option value="Datasets">Datasets</option>
                <option value="AI">AI</option>
                <option value="IOT">IOT</option>
                <option value="Program">Program</option>
                <option value="Photo/Art">Photo/Art</option>
                <option value="Other">Other</option>
              </select>

              <select
                value={selectedCategory1}
                onChange={(e) => setSelectedCategory1(e.target.value)}
                className="w-auto p-2 mb-4 ml-5 border border-gray-300 rounded text-black"
              >
                <option value="" disabled>Select Category</option>
                <option value="Document">Document</option>
                <option value="Model/3D">Model/3D</option>
                <option value="Website">Website</option>
                <option value="MobileApp">MobileApp</option>
                <option value="Datasets">Datasets</option>
                <option value="AI">AI</option>
                <option value="IOT">IOT</option>
                <option value="Program">Program</option>
                <option value="Photo/Art">Photo/Art</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="flex flex-row w-full mt-5">
              <div className="flex flex-col justify-center w-96 h-28 m-5 rounded-md bg-white drop-shadow-md">
                <div className="flex flex-row justify-center m-2">
                  <p className="font-semibold text-black">
                    ยอดขายทั้งหมด
                  </p>
                </div>
                <div className="flex flex-row justify-center m-2">
                  <p className="font-semibold text-black">
                    25K
                  </p>
                </div>
              </div>

              <div className="flex flex-col justify-center w-96 h-28 m-5 rounded-md bg-white drop-shadow-md">
                <div className="flex flex-row justify-center m-2">
                  <p className="font-semibold text-black">
                    กำไรของเว็บไซต์
                  </p>
                </div>
                <div className="flex flex-row justify-center m-2">
                  <p className="font-semibold text-black">
                    15K
                  </p>
                </div>
              </div>

              <div className="flex flex-col justify-center w-96 h-28 m-5 bg-white rounded-md drop-shadow-md">
                <div className="flex flex-row justify-center m-2">
                  <p className="font-semibold text-black">
                    จำนวนผู้เข้าชม
                  </p>
                </div>
                <div className="flex flex-row justify-center m-2">
                  <p className="font-semibold text-black">
                    5K
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col w-full mt-5">
              <p
                style={{ fontSize: "24px", fontWeight: "bold", color: "#33539B" }}
              >
                จำนวนที่ขายได้แต่ละหมวดหมู่
              </p>

              <Bar
                data={data1}
                width={200}
                height={100}
                options={{ indexAxis: 'y' }}  // Set indexAxis to 'y' for horizontal bars
              />

            </div>

            <div className="flex flex-col w-full mt-5">
              <p
                style={{ fontSize: "24px", fontWeight: "bold", color: "#33539B" }}
              >
                อันดับการค้นหา
              </p>

              <table className="border-2 mt-10 mb-10" style={{ width: "992px" }}>
                <thead>
                  <tr style={{ backgroundColor: "#33539B", color: "#ffff" }}>
                    <th className="w-1/12 text-center h-12">อันดับ</th>
                    <th className="w-4/12 h-12 text-start">คำค้นหา</th>
                  </tr>
                </thead>
                <tbody className="text-black">
                  <tr>
                    <td className="text-center h-14">1</td>
                    <td className="h-14">ทำเว็บไซต์</td>
                  </tr>
                  <tr>
                    <td className="text-center h-14">2</td>
                    <td className="h-14">ออกแบบบ้าน</td>
                  </tr>
                  <tr>
                    <td className="text-center h-14">3</td>
                    <td className="h-14">แอพขายของ</td>
                  </tr>
                  <tr>
                    <td className="text-center h-14">4</td>
                    <td className="h-14">NFT</td>
                  </tr>
                  <tr>
                    <td className="text-center h-14">5</td>
                    <td className="h-14">Blockchain</td>
                  </tr>
                </tbody>
              </table>

            </div>

            <div className="flex flex-col w-full mt-5">
              <p
                style={{ fontSize: "24px", fontWeight: "bold", color: "#33539B" }}
              >
                บทบาทของผู้ใช้
              </p>
              <Bar
                data={roleData}  // ใช้ข้อมูลจาก state roleData
                width={200}
                height={100}
                options={{
                  maintainAspectRatio: true,
                }}
              />
            </div>

            <div className="flex flex-col w-full mt-5 ">
              <p
                style={{ fontSize: "24px", fontWeight: "bold", color: "#33539B" }}
              >
                ความชอบของผู้ใช้
              </p>

              <Bar
                data={data2}
                width={200}
                height={100}
                options={{ indexAxis: 'y' }}  // Set indexAxis to 'y' for horizontal bars
              />

            </div>

          </div>
        </div>
      </div>
    </main>
  );
}

export default page;
