'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FaUserCircle } from 'react-icons/fa';
import { TiThMenu } from 'react-icons/ti';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
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
          <button className="text-white text-2xl" onClick={toggleMenu}>
            &times;
          </button>
          <ul className="mt-8">
            <li className="mb-4">
              <Link href="/ApproveSell" className="hover:text-gray-300" onClick={toggleMenu}>
                Approvesell
              </Link>
            </li>
            <li className="mb-4">
            <Link href="/Reportproject" className="hover:text-gray-300" onClick={toggleMenu}>
               Reportproject
              </Link>
              </li>
              <li className="mb-4">
              <Link href="/Reportblog" className="hover:text-gray-300" onClick={toggleMenu}>
               Reportblog
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
