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

  const [totalSales, setTotalSales] = useState(0);
  const [totalCommission, setTotalCommission] = useState(0); // New state for commission

  useEffect(() => {
    async function fetchTotalSales() {
      try {
        const response = await fetch('/api/getmoney', {
          method: 'GET',
        });
        const data = await response.json();
        setTotalSales(data.totalSales); // Total net sales
        setTotalCommission(data.totalCommission); // 20% of net sales
      } catch (error) {
        console.error("Error fetching total sales and commission:", error);
      }
    }

    fetchTotalSales();
  }, []);

  const [loading, setLoading] = useState(true);  // เพิ่ม state สำหรับ loading
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/getseller');
        const salesData = await response.json(); // ต้อง parse JSON ก่อน
        
        if (salesData && Array.isArray(salesData)) {
          const categories = salesData.map((data) => data.category);
          const prices = salesData.map((data) => data.price);

          setChartData({
            labels: categories,
            datasets: [
              {
                label: 'Price',
                data: prices,
                backgroundColor: 'rgba(53, 83, 155, 0.5)',
                borderColor: 'rgba(53, 83, 155, 1)',
                borderWidth: 1,
              },
            ],
          });
        } else {
          setError('Invalid data format or no data available');
        }
      } catch (error) {
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);



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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

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
        {totalSales !== undefined ? totalSales.toLocaleString() : 'กำลังโหลด...'} ฿
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
                  {totalCommission !== undefined ? totalCommission.toLocaleString() : 'กำลังโหลด...'} ฿
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

              <Bar data={chartData} width={200} height={100} options={{ indexAxis: 'y' }} />

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
