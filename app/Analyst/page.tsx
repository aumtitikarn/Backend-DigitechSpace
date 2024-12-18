"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Header from "../component/Header";
import Sidebar from "../component/Header"
import Link from "next/link";
import { Doughnut, Line, Pie, Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart } from 'chart.js';
import {
  Chart as ChartJS,
  ChartData,
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
import { useRouter } from 'next/navigation';

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

interface Term {
  _id: string;
  term: string;
  count: number;
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
  net: number;
};
interface ChartDataType {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
  }[];
}

const Page = () => {
  Chart.register(ChartDataLabels);

  const router = useRouter();

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCategory1, setSelectedCategory1] = useState("");

  const [selectedMonth, setSelectedMonth] = useState("All");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());

  const [purchaseHistory, setPurchaseHistory] = useState<Purchase[]>([]);
  const [error, setError] = useState<null | string>(null);

  const [roleData, setRoleData] = useState<RoleDataType>({
    labels: [],
    datasets: [],
  });

  const [rawSalesData, setRawSalesData] = useState<Sale[]>([]);; // State สำหรับเก็บข้อมูลดิบที่ดึงมาจาก API
  const [totalSales, setTotalSales] = useState(0);
  const [totalCommission, setTotalCommission] = useState(0);

  useEffect(() => {
    async function fetchTotalSales() {
      if (!selectedMonth || !selectedYear) return;

      try {
        const response = await fetch(`/api/getmoney?month=${selectedMonth}&year=${selectedYear}`, {
          method: 'GET',
        });
        const data = await response.json();

        // ตรวจสอบข้อมูลที่ fetch มา
        // console.log("Fetched data:", data);

        setTotalSales(data.totalSales || '0');  // ต้องเป็น array ของ string
        setTotalCommission(data.totalCommission || '0');  // ต้องเป็น array ของตัวเลข
      } catch (error) {
        console.error("Error fetching favorites data:", error);
      }
    }

    fetchTotalSales();
  }, [selectedMonth, selectedYear]);


  // useEffect(() => {
  //   async function fetchTotalSales() {
  //     try {
  //       const response = await fetch('/api/getmoney', {
  //         method: 'GET',
  //       });
  //       const data = await response.json();

  //       console.log("Sales data from API: ", data.transactions);  // ตรวจสอบข้อมูล
  //       setRawSalesData(data.transactions || []);
  //     } catch (error) {
  //       console.error("Error fetching total sales and commission:", error);
  //     }
  //   }

  //   fetchTotalSales();
  // }, []);

  // useEffect(() => {
  //   if (rawSalesData.length > 0) {
  //     const filteredData = rawSalesData.filter((sale) => {
  //       if (!sale.createdAt) return false;  // เพิ่มการตรวจสอบ

  //       const saleDate = new Date(sale.createdAt);
  //       const saleMonth = (saleDate.getMonth() + 1).toString().padStart(2, '0');
  //       const saleYear = saleDate.getFullYear().toString();

  //       const matchMonth = selectedMonth === 'All' || saleMonth === selectedMonth;
  //       const matchYear = selectedYear === 'All' || saleYear === selectedYear;

  //       return matchMonth && matchYear;
  //     });

  //     // คำนวณเฉพาะเมื่อ filteredData มีค่า
  //     if (filteredData.length > 0) {
  //       const totalSalesFiltered = filteredData.reduce((acc, sale) => acc + (sale.net || 0), 0);
  //       const totalCommissionFiltered = totalSalesFiltered * 0.2;

  //       setTotalSales(totalSalesFiltered);
  //       setTotalCommission(totalCommissionFiltered);
  //     }
  //   }
  // }, [rawSalesData, selectedMonth, selectedYear]);



  const [projectNames, setProjectNames] = useState<string[]>([]);
  const [projectCounts, setProjectCounts] = useState<number[]>([]);

  useEffect(() => {
    async function fetchFavoritesData() {
      if (!selectedMonth || !selectedYear) return;

      try {
        const response = await fetch(`/api/getfav?month=${selectedMonth}&year=${selectedYear}`, {
          method: 'GET',
        });
        const data = await response.json();

        // ตรวจสอบข้อมูลที่ fetch มา
        // console.log("Fetched data:", data);

        setProjectNames(data.projectNames || []);  // ต้องเป็น array ของ string
        setProjectCounts(data.projectCounts || []);  // ต้องเป็น array ของตัวเลข
      } catch (error) {
        console.error("Error fetching favorites data:", error);
      }
    }

    fetchFavoritesData();
  }, [selectedMonth, selectedYear]);

  const generateColors = (count: number): string[] => {
    const colors = [
      'rgb(24, 64, 152, 0.5)',
      'rgb(19, 48, 112, 0.5)'
    ];
    return Array.from({ length: count }, (_, i) => colors[i % colors.length]);
  };

  const generateColors2 = (count: number): string[] => {
    const colors = [
      'rgb(24, 64, 152, 0.5)',
      'rgb(19, 48, 112, 0.5)',
      'rgb(24, 64, 152, 0.5)',
      'rgb(19, 48, 112, 0.5)',
    ];
    return Array.from({ length: count }, (_, i) => colors[i % colors.length]);
  };


  const datafav = {
    labels: projectNames,
    datasets: [
      {
        label: 'โปรเจกต์',
        data: projectCounts,
        backgroundColor: generateColors(projectCounts.length),
        borderColor: generateColors(projectCounts.length).map(color => color.replace('0.5', '1')), // เปลี่ยนความโปร่งใส
        borderWidth: 1,
      },
    ],
  };

  // const datafav = {
  //   labels: projectNames,  // ใช้ projectNames เป็น labels
  //   datasets: [
  //     {
  //       label: 'โปรเจกต์',  // ชื่อชุดข้อมูล
  //       data: projectCounts,  // ใช้ projectCounts เป็นข้อมูล (ตรวจสอบว่าเป็น array ของตัวเลข)
  //       backgroundColor: 'rgba(53, 83, 155, 0.5)',
  //       borderColor: 'rgba(53, 83, 155, 1)',
  //       borderWidth: 1,
  //     },
  //   ],
  // };

  const [terms, setTerms] = useState<Term[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);

  useEffect(() => {
    async function fetchTerms() {
      try {
        const response = await fetch(`/api/getsearch?month=${selectedMonth}&year=${selectedYear}`, {
          method: 'GET',
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data: { terms: Term[]; count: number } = await response.json();

        // console.log("ข้อมูลตาราง", data);

        // Set the terms and the total count
        setTerms(data.terms); // จะได้แค่ 10 รายการ
        setTotalCount(data.count); // Set total count from the API

      } catch (error) {
        console.error("Error fetching search terms:", error);
      }
    }

    fetchTerms();
  }, [selectedMonth, selectedYear]);

  const [loading, setLoading] = useState(true);  // เพิ่ม state สำหรับ loading
  // const [error, setError] = useState(null);
  const [chartData, setChartData] = useState<ChartData<'bar'>>({
    labels: [],  // Initially an empty array
    datasets: [{
      label: 'Price',
      data: [],
      backgroundColor: ['rgb(24, 64, 152, 0.5)',
        'rgb(19, 48, 112, 0.5)',
        'rgb(24, 64, 152, 0.5)',
        'rgb(19, 48, 112, 0.5)',],
      borderColor: ['rgb(24, 64, 152, 0.5)',
        'rgb(19, 48, 112, 0.5)',
        'rgb(24, 64, 152, 0.5)',
        'rgb(19, 48, 112, 0.5)',],
      borderWidth: 1,
    }]
  });

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
          // console.log("กราฟ", salesData)
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
        // console.log(data); // ตรวจสอบข้อมูลที่ได้รับ
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
      if (!selectedMonth || !selectedYear) return; // เพิ่มการตรวจสอบ

      try {
        const result = await axios.get(`/api/getanalyst?month=${selectedMonth}&year=${selectedYear}`);

        if (!result.data) return;

        const normalRoles = result.data.normalUsers?.map((user: UserType) => user.roleai) || [];
        const studentRoles = result.data.studentUsers?.map((user: UserType) => user.roleai) || [];

        const roles = ['student', 'developer', 'professor', 'designer', 'executive', 'researcher', 'teacher', 'other'];
        const normalCounts = roles.map(role => normalRoles.filter((r: string) => r === role).length);
        const studentCounts = roles.map(role => studentRoles.filter((r: string) => r === role).length);

        // อัพเดท state ด้วยข้อมูลใหม่

        setRoleData({
          labels: roles,
          datasets: [
            {
              label: 'Normal User',
              data: normalCounts,
              backgroundColor: '#133070',
            },
            {
              label: 'Student User',
              data: studentCounts,
              backgroundColor: '#ff9f00',
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching role data:", error);
      }
    };

    fetchData();
  }, [selectedMonth, selectedYear]);// ใส่ dependency array ที่ว่างเพื่อให้ทำงานเพียงครั้งเดียว

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


  console.log()

  const currentYear = new Date().getFullYear();
  const years = ['All', ...Array.from({ length: 5 }, (_, i) => (currentYear - i).toString())];

  const filteredPurchaseHistory = useMemo(() => {
    if (!Array.isArray(purchaseHistory)) return [];

    return purchaseHistory.filter((purchase) => {
      const purchaseDate = new Date(purchase.createdAt);
      const purchaseMonth = (purchaseDate.getMonth() + 1).toString().padStart(2, '0');
      const purchaseYear = purchaseDate.getFullYear().toString();

      const matchMonth = selectedMonth === 'All' || purchaseMonth === selectedMonth;
      const matchYear = selectedYear === 'All' || purchaseYear === selectedYear;

      return matchMonth && matchYear;
    });
  }, [purchaseHistory, selectedMonth, selectedYear]);

  // Update chart data when filtered history changes
  const chartOptions = {
    scales: {
      x: { // สำหรับ Chart.js เวอร์ชันใหม่กว่า (3.x หรือ 4.x)
        ticks: {
          display: false // ซ่อนตัวเลขด้านล่าง (แกน x)
        },
        grid: {
          display: true // แสดงเส้นกริด (สามารถปรับเป็น false ได้หากต้องการลบ)
        }
      },
      y: {
        ticks: {
          beginAtZero: true // เริ่มแกน y จาก 0
        }
      }
    }
  };

  useEffect(() => {
    if (!filteredPurchaseHistory) return;

    const categories = filteredPurchaseHistory.map((salesData) => salesData.category);
    const prices = filteredPurchaseHistory.map((salesData) => salesData.price || 0);

    const newChartData = {
      labels: categories,
      datasets: [{
        label: 'Price',
        data: prices,
        backgroundColor: ['rgb(24, 64, 152, 0.5)',
          'rgb(19, 48, 112, 0.5)',
          'rgb(24, 64, 152, 0.5)',
          'rgb(19, 48, 112, 0.5)',],
        borderColor: ['rgb(24, 64, 152, 0.5)',
          'rgb(19, 48, 112, 0.5)',
          'rgb(24, 64, 152, 0.5)',
          'rgb(19, 48, 112, 0.5)',],
        borderWidth: 1,
      }]
    };

    // Only update if the data has actually changed
    if (JSON.stringify(chartData) !== JSON.stringify(newChartData)) {
      setChartData(newChartData);
    }
  }, [filteredPurchaseHistory, chartData]);


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

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FBFBFB] overflow-hidden">
      <Header />
      <main>
        <div className="flex flex-col items-center w-full" style={{ backgroundColor: "#FBFBFB" }}>
          <div className="w-full max-w-screen-lg p-4">
            <div className="flex flex-col">

              <p
                className="mt-10 text-black"
                style={{ fontSize: "24px", fontWeight: "bold" }}
              >
                สรุปผล
              </p>

              <div className="flex flex-row w-full mt-3">
                <p
                  style={{ fontSize: "24px", fontWeight: "bold", color: "#33539B" }}
                >
                  ประจำเดือน
                </p>
                {/* Category Dropdown */}

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

                <>
                  {chartData.datasets?.length > 0 &&
                    chartData.datasets[0]?.data?.some((value) => {
                      if (Array.isArray(value)) {
                        return value.some((v) => v > 0); // ตรวจสอบในกรณีที่ value เป็น array
                      }
                      return (value ?? 0) > 0; // ตรวจสอบในกรณีที่ value เป็นตัวเลขเดี่ยว
                    }) ? (
                    <div className="flex flex-col justify-center w-96 h-28 m-5 rounded-md bg-white drop-shadow-md">
                      <div className="flex flex-row justify-center m-2">
                        <p className="font-semibold text-black">ยอดขายทั้งหมด</p>
                      </div>
                      <div className="flex flex-row justify-center m-2">
                        <p className="font-semibold text-black">
                          {totalSales !== undefined ? totalSales.toLocaleString() : 'กำลังโหลด...'} ฿
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col justify-center w-96 h-28 m-5 rounded-md bg-white drop-shadow-md">
                      <div className="flex flex-row justify-center m-2">
                        <p className="font-semibold text-black">ยอดขายทั้งหมด</p>
                      </div>
                      <div className="flex flex-row justify-center m-2">
                        <p className="font-semibold text-black">
                          0 ฿
                        </p>
                      </div>
                    </div>
                  )}

                  {chartData.datasets?.length > 0 &&
                    chartData.datasets[0]?.data?.some((value) => {
                      if (Array.isArray(value)) {
                        return value.some((v) => v > 0); // ตรวจสอบในกรณีที่ value เป็น array
                      }
                      return (value ?? 0) > 0; // ตรวจสอบในกรณีที่ value เป็นตัวเลขเดี่ยว
                    }) ? (
                    <div className="flex flex-col justify-center w-96 h-28 m-5 rounded-md bg-white drop-shadow-md">
                      <div className="flex flex-row justify-center m-2">
                        <p className="font-semibold text-black">กำไรของเว็บไซต์</p>
                      </div>
                      <div className="flex flex-row justify-center m-2">
                        <p className="font-semibold text-black">
                          {totalCommission !== undefined ? totalCommission.toLocaleString() : 'กำลังโหลด...'} ฿
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col justify-center w-96 h-28 m-5 rounded-md bg-white drop-shadow-md">
                      <div className="flex flex-row justify-center m-2">
                        <p className="font-semibold text-black">กำไรของเว็บไซต์</p>
                      </div>
                      <div className="flex flex-row justify-center m-2">
                        <p className="font-semibold text-black">
                          0 ฿
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="flex flex-col justify-center w-96 h-28 m-5 bg-white rounded-md drop-shadow-md">
                    <div className="flex flex-row justify-center m-2">
                      <p className="font-semibold text-black">จำนวนสมาชิก</p>
                    </div>
                    <div className="flex flex-row justify-center m-2">
                      <p className="font-semibold text-black">
                        {totalUserCount !== undefined ? totalUserCount.toLocaleString() : 'Loading...'}
                      </p>
                    </div>
                  </div>
                </>

              </div>

              <div className="flex flex-col w-full mt-5">
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#33539B' }}>
                  จำนวนที่ขายได้แต่ละหมวดหมู่
                </p>

                {chartData.datasets?.length > 0 ? (
                  <Bar
                    data={chartData}
                    width={200}
                    height={100}
                    options={{
                      indexAxis: 'y',
                      scales: {
                        x: {
                          ticks: {
                            display: false,
                          },
                          grid: {
                            display: false,
                          },
                        },
                        y: {
                          beginAtZero: true,
                          ticks: {
                            font: {
                              size: 15,
                            },
                            autoSkip: true,
                          },
                        },
                      },
                      layout: {
                        padding: {
                          top: 10,
                          right: 30,
                          bottom: 10,
                          left: 10,
                        },
                      },
                      plugins: {
                        legend: {
                          display: true,
                          position: 'top',
                        },
                        datalabels: {
                          display: true,
                          align: 'end',
                          anchor: 'end',
                          color: '#000',
                          font: {
                            size: 15,
                          },
                          formatter: (value) => {
                            if (value === undefined || value === null) {
                              return null;
                            }
                            return value === 0 ? null : value.toLocaleString();
                          },
                        },
                      },
                    }}
                  />
                ) : (
                  <p className="text-center text-gray-500">กราฟไม่มีข้อมูล</p>
                )}
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
                  data={roleData}
                  width={200}
                  height={100}
                  options={{
                    scales: {
                      y: { // แกน x
                        ticks: {
                          display: false,
                        },
                        grid: {
                          display: false,
                        },
                      },
                      x: { // แกน y
                        beginAtZero: true,
                        ticks: {
                          autoSkip: true,
                          font: {
                            size: 15,
                          },
                        },
                      },
                    },
                    plugins: {
                      legend: {
                        display: true,
                        position: 'top',
                      },
                      datalabels: {
                        display: true,
                        align: 'end',
                        anchor: 'end',
                        color: '#000',
                        font: {
                          size: 15,
                        },
                        // กำหนดประเภท 'value' เป็น 'number'
                        formatter: (value) => {
                          if (value === undefined || value === null) {
                            return null;
                          }
                          return value === 0 ? null : value.toLocaleString();
                        },
                      },
                    },
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
                  options={{
                    indexAxis: 'y',
                    scales: {
                      x: {
                        ticks: {
                          display: false,
                        },
                        grid: {
                          display: false,
                        },
                      },
                      y: {
                        beginAtZero: true,
                        ticks: {
                          font: {
                            size: 15,
                          },
                          autoSkip: true,
                        },
                      },
                    },
                    layout: {
                      padding: {
                        top: 10,
                        right: 30,
                        bottom: 10,
                        left: 10,
                      },
                    },
                    plugins: {
                      legend: {
                        display: true,
                        position: 'top',
                      },
                      datalabels: {
                        display: true,
                        align: 'end',
                        anchor: 'end',
                        color: '#000',
                        font: {
                          size: 15,
                        },
                        // กำหนดประเภท 'value' เป็น 'number'
                        formatter: (value) => {
                          if (value === undefined || value === null) {
                            return null; // or handle as needed
                          }
                          return value === 0 ? null : value.toLocaleString();
                        },
                      },
                    },
                  }}
                />

              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Page;
