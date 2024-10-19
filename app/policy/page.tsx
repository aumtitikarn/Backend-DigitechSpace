"use client";

import React, { useState, useRef, useEffect } from 'react';
import Header from "../component/Header";
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import Swal from 'sweetalert2';

const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'outline';
  size?: 'default' | 'icon';
}> = ({ children, variant = 'default', size = 'default', ...props }) => {
  const baseStyle = "font-bold rounded focus:outline-none focus:shadow-outline";
  const variantStyle = variant === 'outline'
    ? "bg-white text-gray-800 border border-gray-400 hover:bg-gray-100"
    : "bg-blue-500 hover:bg-blue-700 text-white";
  const sizeStyle = size === 'icon' ? "p-2" : "py-2 px-4";
  
  return (
    <button 
      className={`${baseStyle} ${variantStyle} ${sizeStyle}`}
      {...props}
    >
      {children}
    </button>
  );
};

const PolicyEditor: React.FC = () => {
    const editorRef = useRef<HTMLDivElement>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [policy, setPolicy] = useState('');
    const [isLoading, setIsLoading] = useState(true);
  
    useEffect(() => {
      const fetchPolicy = async () => {
        try {
          const response = await fetch('/api/policy/get?type=privacy-policy');
          if (response.ok) {
            const data = await response.json();
            setPolicy(data.policy);
          } else {
            console.error('Failed to fetch policy');
          }
        } catch (error) {
          console.error('Error fetching policy:', error);
        } finally {
          setIsLoading(false);
        }
      };
  
      fetchPolicy();
    }, []);
  
    useEffect(() => {
      if (editorRef.current && !isLoading) {
        editorRef.current.innerHTML = policy;
      }
    }, [policy, isLoading]);
  
    const applyStyle = (command: string, value: string | undefined = undefined) => {
      document.execCommand(command, false, value);
      editorRef.current?.focus();
    };
  
    const savePolicy = async () => {
      if (editorRef.current) {
        setIsSaving(true);
        try {
          const response = await fetch('/api/policy', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              policy: editorRef.current.innerHTML,
              type: 'privacy-policy'
            }),
          });
  
          if (!response.ok) {
            throw new Error('Failed to save policy');
          }
  
          const result = await response.json();
          console.log('Policy saved/updated successfully:', result);
          
          Swal.fire({
            icon: 'success',
            title: 'สำเร็จ!',
            text: 'บันทึกนโยบายเรียบร้อยแล้ว',
            confirmButtonText: 'ตกลง'
          });
        } catch (error) {
          console.error('Error saving policy:', error);
          
          Swal.fire({
            icon: 'error',
            title: 'เกิดข้อผิดพลาด!',
            text: 'ไม่สามารถบันทึกนโยบายได้ กรุณาลองใหม่อีกครั้ง',
            confirmButtonText: 'ตกลง'
          });
        } finally {
          setIsSaving(false);
        }
      }
    };
  
  
    return (
      <div className="flex flex-col min-h-screen bg-[#FBFBFB]">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="lg:mx-64 lg:mt-10 lg:mb-10 mt-10 mb-10 mx-5">
            <h1 className="text-xl font-bold mb-4 text-black">นโยบายส่วนบุคคล</h1>
            <div className="mb-4 flex space-x-2">
              <Button onClick={() => applyStyle('bold')} variant="outline" size="icon">
                <Bold className="h-4 w-4" />
              </Button>
              <Button onClick={() => applyStyle('italic')} variant="outline" size="icon">
                <Italic className="h-4 w-4" />
              </Button>
              <Button onClick={() => applyStyle('underline')} variant="outline" size="icon">
                <Underline className="h-4 w-4" />
              </Button>
              <Button onClick={() => applyStyle('justifyLeft')} variant="outline" size="icon">
                <AlignLeft className="h-4 w-4" />
              </Button>
              <Button onClick={() => applyStyle('justifyCenter')} variant="outline" size="icon">
                <AlignCenter className="h-4 w-4" />
              </Button>
              <Button onClick={() => applyStyle('justifyRight')} variant="outline" size="icon">
                <AlignRight className="h-4 w-4" />
              </Button>
            </div>
            {isLoading ? (
            <div className="w-full h-64 flex items-center justify-center">
              <p>กำลังโหลดนโยบาย...</p>
            </div>
          ) : (
            <div
              ref={editorRef}
              className="w-full min-h-[200px] px-4 py-2 rounded-[9px] border border-[rgba(208,216,233,0.41)] text-black focus:outline-none focus:ring-2 focus:ring-[#5D76AD] resize-none overflow-hidden"
              contentEditable
            />
          )}
          <button
            onClick={savePolicy}
            disabled={isSaving || isLoading}
            className="mt-5 w-full lg:w-full py-3 flex-shrink-0 rounded-[10px] bg-[#5D76AD] text-white font-semibold flex items-center justify-center hover:bg-[#4A5F8C] transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSaving ? 'กำลังบันทึก...' : 'บันทึกนโยบายส่วนบุคคล'}
          </button>
          </div>
        </main>
      </div>
    );
  };

export default PolicyEditor;