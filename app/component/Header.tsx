'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FaUserCircle } from 'react-icons/fa';
import { TiThMenu } from 'react-icons/ti';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSubMenuOpen, setIsSubMenuOpen] = useState<number | null>(null); // Track which submenu is open

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSubMenu = (index: number) => {
    setIsSubMenuOpen(isSubMenuOpen === index ? null : index);
  };

  return (
    <header className="bg-[#0B1E48] text-white py-4 px-6">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <TiThMenu className="text-3xl mr-4 cursor-pointer" onClick={toggleMenu} />
        </div>
        <img src="/dgt.png" alt="Logo" className="h-8" />
        <FaUserCircle className="text-3xl cursor-pointer hover:text-gray-300" />
      </div>

      {/* Sliding Menu */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-[#0B1E48] transform ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out z-50`}
      >
        <div className="p-6">
        <div className="container mx-auto flex items-center justify-between">
    {/* Logo on the left */}
    <img src="/dgt.png" alt="Logo" className="h-8" />

    {/* Close button on the right */}
    <button className="text-white text-4xl ml-auto" onClick={toggleMenu}>
      &times;
    </button>
  </div>
          <ul className="mt-8 space-y-4">
            {/* Menu Item 1 */}
            <li>
              <button
                className="flex justify-between items-center w-full hover:text-gray-300"
                onClick={() => toggleSubMenu(1)}
              >
                รายชื่อผู้ใช้
                <span>{isSubMenuOpen === 1 ? '▲' : '▼'}</span>
              </button>
              {isSubMenuOpen === 1 && (
                <ul className="mt-2 ml-4 space-y-2">
                  <li>
                    <Link href="/normal" className="hover:text-gray-300" onClick={toggleMenu}>
                      ผู้ใช้ธรรมดา
                    </Link>
                  </li>
                  <li>
                    <Link href="/student" className="hover:text-gray-300" onClick={toggleMenu}>
                      นักศึกษา
                    </Link>
                  </li>
                  <li>
                    <Link href="/admin" className="hover:text-gray-300" onClick={toggleMenu}>
                      แอดมิน
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* Menu Item 2 */}
            <li>
              <Link href="/ApproveSell" className="hover:text-gray-300" onClick={toggleMenu}>
                อนุมัติการขาย
              </Link>
            </li>

            {/* Menu Item 3 */}
            <li>
              <button
                className="flex justify-between items-center w-full hover:text-gray-300"
                onClick={() => toggleSubMenu(2)}
              >
                รายงานของผู้ใช้
                <span>{isSubMenuOpen === 2 ? '▲' : '▼'}</span>
              </button>
              {isSubMenuOpen === 2 && (
                <ul className="mt-2 ml-4 space-y-2">
                  <li>
                    <Link href="/Reportproject" className="hover:text-gray-300" onClick={toggleMenu}>
                      โครงงาน
                    </Link>
                  </li>
                  <li>
                    <Link href="/Reportblog" className="hover:text-gray-300" onClick={toggleMenu}>
                      บล็อก
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* Menu Item 4 */}
            <li>
              <Link href="/Withdraw" className="hover:text-gray-300" onClick={toggleMenu}>
                คำร้องขอถอนเงิน
              </Link>
            </li>
            <li>
              <Link href="/ReportService" className="hover:text-gray-300" onClick={toggleMenu}>
                คำร้องปัญหาของผู้ใช้
              </Link>
            </li>
            <li>
              <Link href="/Analyst" className="hover:text-gray-300" onClick={toggleMenu}>
                สรุปผล
              </Link>
            </li>

            {/* Add other menu items here */}
          </ul>
        </div>
      </div>

      {/* Overlay to close the menu when clicking outside */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40"
          onClick={toggleMenu}
        ></div>
      )}
    </header>
  );
};

export default Header;
