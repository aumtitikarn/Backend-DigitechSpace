"use client";

import Header from "../component/Header";
import React, { useState } from 'react';
import Link from 'next/link';
import Pagination from '../component/Pagination';

interface Project {
  id: number;
  Username: string;
  name: string;
  phon: string;
  Email: string;
  idcard: string;
  bank:string;
  banknumber:string;
  Address:string;
  subdis:string;
  district:string;
  province:string;
  postal:string;
 
}

const projects: Project[] = [
  { id: 1, Username: '@somjai', name: 'สมใจ ใจดี', phon: '0640398458',Email:'phorn@gmail.com', idcard:'1234123454321',
    bank:'กสิกรไทย',banknumber:'1234567890',Address:'333/17 ถนนป็อปปูล่า',subdis:'บ้านใหม่จริง',district:'ปากเกร็ดติ',province:'นนทบุรี', postal:'1120' },
  { id: 2,Username: '@somjai', name: 'สมใจ ใจดี', phon: '0640398458',Email:'phorn01@gmail.com', idcard:'1234123454321',
    bank:'กสิกรไทย',banknumber:'1234567890',Address:'333/17 ถนนป็อปปูล่า',subdis:'บ้านเก่า',district:'ปากเกร็ด',province:'นนทบุรี', postal:'1120' },
  { id: 3, Username: '@somjai', name: 'สมใจ ใจดี', phon: '0640398458',Email:'phorn12@gmail.com', idcard:'1234123454321',
    bank:'กสิกรไทย',banknumber:'1234567890',Address:'333/17 ถนนป็อปปูล่า',subdis:'บ้านใหม่',district:'ปากเกร็ดจิ',province:'นนทบุรี', postal:'1120'  },
  { id: 4,Username: '@somjai', name: 'สมใจ ใจดี', phon: '0640398458',Email:'phorn14@gmail.com', idcard:'1234123454321',
    bank:'กสิกรไทย',banknumber:'1234567890',Address:'333/17 ถนนป็อปปูล่า',subdis:'บ้านเก่า',district:'ปากเกร็ด',province:'นนทบุรี', postal:'1120'  },
  { id: 5,Username: '@somjai', name: 'สมใจ ใจดี', phon: '0640398458',Email:'phorn04@gmail.com', idcard:'1234123454321',
    bank:'กสิกรไทย',banknumber:'1234567890',Address:'333/17 ถนนป็อปปูล่า',subdis:'บ้านใหม่ไหน',district:'ปากเกร็ด',province:'นนทบุรี', postal:'1120'  },
  { id: 6,Username: '@somjai', name: 'สมใจ ใจดี', phon: '0640398458',Email:'phorn40@gmail.com', idcard:'1234123454321',
    bank:'กสิกรไทย',banknumber:'1234567890',Address:'333/17 ถนนป็อปปูล่า',subdis:'บ้านใหม่',district:'ปากเกร็ด',province:'นนทบุรี', postal:'1120'  },
  { id: 7, Username: '@somjai', name: 'สมใจ ใจดี', phon: '0640398458',Email:'phorn5@gmail.com', idcard:'1234123454321',
    bank:'กสิกรไทย',banknumber:'1234567890',Address:'333/17 ถนนป็อปปูล่า',subdis:'บ้านใหม่',district:'ปากเกร็ด',province:'นนทบุรี', postal:'1120'  },
  { id: 8, Username: '@somjai', name: 'สมใจ ใจดี', phon: '0640398458',Email:'phorn3@gmail.com', idcard:'1234123454321',
    bank:'กสิกรไทย',banknumber:'1234567890',Address:'333/17 ถนนป็อปปูล่า',subdis:'บ้านใหม่',district:'ปากเกร็ด',province:'นนทบุรี', postal:'1120'  },
];

const userstudent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = projects.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(projects.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FBFBFB] overflow-hidden">
      <Header />
      <main className="flex-grow">
        <div className="lg:mx-64 lg:mt-10 lg:mb-10 mt-10 mb-10 mx-5">
        <h2 className="text-xl font-bold mb-4 ">รายชื่อของนักศึกษา</h2>
        <div className="w-full h-full flex flex-col">
          <table className="min-w-full border-collapse border border-gray-400">
            <thead>
              <tr>
                <th className="border border-gray-400 p-2">#</th>
                <th className="border border-gray-400 p-2 lg:text-lg">Username</th>
                <th className="border border-gray-400 p-2 lg:text-lg">ชื่อ-นามสกุล</th>
                <th className="border border-gray-400 p-2 lg:text-lg">เบอร์โทรศัพท์</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((project) => (
                <tr key={project.id}>
                  <td className="border border-gray-400 p-2 text-center text-sm lg:text-lg">{project.id}.</td>
                  <td className="border border-gray-400 p-2 text-sm truncate max-w-xs lg:text-lg">
                  <Link  href={{
    pathname: `/student/detail`,
    query: {
      id: project.id,
      Username: project.Username,
      name: project.name,
      phon: project.phon,
      Email: project.Email,
      idcard: project.idcard,
      bank:project.bank,
      banknumber:project.banknumber,
      Address:project.Address,
      subdis:project.subdis,
      district:project.district,
      province:project.province,
      postal:project.postal,
    },
  }}>
  {project.Username}
</Link>
                  </td>
                  <td className="border border-gray-400 p-2 text-sm truncate max-w-xs lg:text-lg">{project.name}</td>
                  <td className="border border-gray-400 p-2 text-sm truncate max-w-xs lg:text-lg">{project.phon}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm mt-2">
          *หากอยากดูข้อมูลเพิ่มเติมให้คลิกที่ตารางคนนั้น
        </p>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
      </main>
    </div>
  );
};

export default userstudent;
