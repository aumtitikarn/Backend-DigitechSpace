"use client";

import React, { useEffect, useState } from "react";
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

interface Purchase {
  date: string;
  category: string;
  price: number;
  createdAt: string;
}

type DatasetType = {
  label: string;
  data: number[];  // ใช้ number[] แทน any[]
  backgroundColor: string;
};

// กำหนด type สำหรับ roleData
type RoleDataType = {
  labels: string[];
  datasets: DatasetType[];
};

type UserType = {
  roleai: string;
};

type Sale = {
  createdAt: string;
};


const page = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCategory1, setSelectedCategory1] = useState("");

  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const [purchaseHistory, setPurchaseHistory] = useState<Purchase[]>([]);

  const [roleData, setRoleData] = useState<RoleDataType>({
    labels: [],
    datasets: [],
  });

  const [rawSalesData, setRawSalesData] = useState<Sale[]>([]);; // State สำหรับเก็บข้อมูลดิบที่ดึงมาจาก API
  const [totalSales, setTotalSales] = useState(0);
  const [totalCommission, setTotalCommission] = useState(0);
  
  useEffect(() => {
    async function fetchTotalSales() {
      try {
        const response = await fetch('/api/getmoney', {
          method: 'GET',
        });
        const data = await response.json();
  
        console.log("Sales data from API: ", data.transactions);  // ตรวจสอบข้อมูล
        setRawSalesData(data.transactions || []); 
      } catch (error) {
        console.error("Error fetching total sales and commission:", error);
      }
    }
  
    fetchTotalSales();
  }, []);
  
  useEffect(() => {
    if (rawSalesData.length > 0) {
      const filteredData = rawSalesData.filter((sale) => {
        const saleDate = new Date(sale.createdAt);
        const saleMonth = (saleDate.getMonth() + 1).toString().padStart(2, '0');
        const saleYear = saleDate.getFullYear().toString();
  
        // ตรวจสอบค่าที่กรอง
        console.log(`Sale Month: ${saleMonth}, Sale Year: ${saleYear}`);
        console.log(`Selected Month: ${selectedMonth}, Selected Year: ${selectedYear}`);
  
        const matchMonth = selectedMonth === 'All' || saleMonth === selectedMonth;
        const matchYear = selectedYear === 'All' || saleYear === selectedYear;
  
        return matchMonth && matchYear;
      });
  
      console.log("Filtered Data: ", filteredData);
  
      const totalSalesFiltered = filteredData.reduce((acc, sale) => acc + sale.net, 0);
      const totalCommissionFiltered = totalSalesFiltered * 0.2;
  
      setTotalSales(totalSalesFiltered);
      setTotalCommission(totalCommissionFiltered);
    }
  }, [rawSalesData, selectedMonth, selectedYear]);



  const [projectNames, setProjectNames] = useState([]);
  const [projectCounts, setProjectCounts] = useState([]);

  useEffect(() => {
    async function fetchFavoritesData() {
      try {
        const response = await fetch('/api/getfav', {
          method: 'GET',
        });
        const data = await response.json();

        // สมมติว่าข้อมูลที่ส่งกลับจาก API มี projectNames และ projectCounts
        setProjectNames(data.projectNames);  // กำหนดค่า projectNames
        setProjectCounts(data.projectCounts);  // กำหนดค่า projectCounts
      } catch (error) {
        console.error("Error fetching favorites data:", error);
      }
    }

    fetchFavoritesData();
  }, []);

  const datafav = {
    labels: projectNames,  // ใช้ projectNames เป็น labels
    datasets: [
      {
        label: 'จำนวนโปรเจค',  // ชื่อชุดข้อมูล
        data: projectCounts,  // ใช้ projectCounts เป็นข้อมูล
        backgroundColor: 'rgba(53, 83, 155, 0.5)',
        borderColor: 'rgba(53, 83, 155, 1)',
        borderWidth: 1,
      },
    ],
  };


  const [terms, setTerms] = useState([]);
  const [totalCount, setTotalCount] = useState(0); // State to hold the total count

  useEffect(() => {
    async function fetchTerms() {
      try {
        const response = await fetch('/api/getsearch', {
          method: 'GET',
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log("ข้อมูลตาราง", data);

        // Set the terms and the total count
        setTerms(data.terms); // จะได้แค่ 10 รายการ
        setTotalCount(data.count); // Set total count from the API

      } catch (error) {
        console.error("Error fetching search terms:", error);
      }
    }

    fetchTerms();
  }, []);


  const [loading, setLoading] = useState(true);  // เพิ่ม state สำหรับ loading
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState({});

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetch('/api/getseller');
  //       const salesData = await response.json(); // ต้อง parse JSON ก่อน

  //       if (salesData && Array.isArray(salesData)) {
  //         const categories = salesData.map((data) => data.category);
  //         const prices = salesData.map((data) => data.price);

  //         setChartData({
  //           labels: categories,
  //           datasets: [
  //             {
  //               label: 'Price',
  //               data: prices,
  //               backgroundColor: 'rgba(53, 83, 155, 0.5)',
  //               borderColor: 'rgba(53, 83, 155, 1)',
  //               borderWidth: 1,
  //             },
  //           ],
  //         });
  //       } else {
  //         setError("Invalid data format or no data available");
  //       }
  //     } catch (error) {
  //       setError('Error fetching data');
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/getseller');
        const salesData = await response.json();

        if (salesData && Array.isArray(salesData)) {
          setPurchaseHistory(salesData); // อัปเดต purchaseHistory ถ้า salesData เป็น array
        } else {
          setError("Invalid data format or no data available");
        }
      } catch (error) {
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  const [totalUserCount, setTotalUserCount] = useState(0);

  useEffect(() => {
    async function fetchUserCount() {
      try {
        const response = await fetch(`/api/getanalyst?month=${selectedMonth}&year=${selectedYear}`);
        const data = await response.json();
        console.log(data); // ตรวจสอบข้อมูลที่ได้รับ
        setTotalUserCount(data.totalUserCount); // กำหนดค่าให้กับ state
      } catch (error) {
        console.error("Error fetching user count:", error);
      }
    }
  
    // เรียกฟังก์ชันนี้เมื่อ selectedMonth หรือ selectedYear เปลี่ยนแปลง
    fetchUserCount();
  }, [selectedMonth, selectedYear]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        // เรียก API เพื่อนำข้อมูล role
        const result = await axios.get(`/api/getanalyst?month=${selectedMonth}&year=${selectedYear}`);
        console.log('API Result:', result.data);
        const normalRoles = result.data.normalUsers.map((user: UserType) => user.roleai);
        const studentRoles = result.data.studentUsers.map((user: UserType) => user.roleai);

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
  }, [selectedMonth, selectedYear]);  // ใส่ dependency array ที่ว่างเพื่อให้ทำงานเพียงครั้งเดียว

  const months = [
    { value: 'All', label: "All" },
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];


  const currentYear = new Date().getFullYear();
  const years = ['All', ...Array.from({ length: 5 }, (_, i) => (currentYear - i).toString())];

  const filteredPurchaseHistory = Array.isArray(purchaseHistory) ? purchaseHistory.filter((purchase) => {
    const purchaseDate = new Date(purchase.createdAt);
    const purchaseMonth = (purchaseDate.getMonth() + 1).toString().padStart(2, '0');
    const purchaseYear = purchaseDate.getFullYear().toString();

    // console.log('Valid Date:', purchaseDate);
    // console.log('Purchase Month:', purchaseMonth);
    // console.log('Purchase Year:', purchaseYear);

    // console.log('Checking purchase:', purchaseDate, 'Month:', purchaseMonth, 'Year:', purchaseYear);

    const matchMonth = selectedMonth === 'All' || purchaseMonth === selectedMonth;
    const matchYear = selectedYear === 'All' || purchaseYear === selectedYear;

    return matchMonth && matchYear;
  }) : [];

  useEffect(() => {
    if (filteredPurchaseHistory && filteredPurchaseHistory.length > 0) {
      const categories = filteredPurchaseHistory.map((salesData) => salesData.category);
      const prices = filteredPurchaseHistory.map((salesData) => salesData.price);

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
      setChartData({
        labels: [],
        datasets: [],
      });
    }
  }, [filteredPurchaseHistory]);

  useEffect(() => {
    // console.log('Selected month:', selectedMonth);
    // console.log('Selected year:', selectedYear);
    // console.log('Filtered history:', filteredPurchaseHistory);
  }, [selectedMonth, selectedYear, filteredPurchaseHistory]);

  // useEffect(() => {
  //   const fetchPurchaseHistory = async () => {
  //     try {
  //       const response = await fetch("/api/withdrawal/getHistory");
  //       if (response.ok) {
  //         const data: Purchase[] = await response.json();
  //         setPurchaseHistory(data);
  //       } else {
  //         throw new Error("Failed to fetch purchase history");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching purchase history:", error);
  //     }
  //   };

  //   fetchPurchaseHistory();
  // }, []);

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

              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-auto p-2 mb-4 ml-5 border border-gray-300 rounded text-black"
              >
                <option value="" disabled>เลือกเดือน</option>
                {months.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>

              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-auto p-2 mb-4 ml-5 border border-gray-300 rounded text-black"
              >
                <option value="" disabled>เลือกปี</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
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
                    {totalUserCount !== undefined ? totalUserCount.toLocaleString() : 'Loading...'}
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
                    <th className="w-3/12 h-12 text-start">คำค้นหา</th>
                    <th className="w-1/12 h-12 text-start">จำนวน</th>
                  </tr>
                </thead>
                <tbody className="text-black">
                  {terms.map((term, index) => (
                    <tr key={term._id}>
                      <td className="text-center h-14">{index + 1}</td>
                      <td className="h-14">{term.term}</td>
                      <td className="h-14">{term.count}</td>
                    </tr>
                  ))}
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
                data={datafav}
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
