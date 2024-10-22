"use client";

import React, { useState, useRef, useEffect } from "react";
import Header from "../component/Header";
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";
import Swal from "sweetalert2";
import { useSession } from "next-auth/react";

const Button: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "default" | "outline";
    size?: "default" | "icon";
  }
> = ({ children, variant = "default", size = "default", ...props }) => {
  const baseStyle = "font-bold rounded focus:outline-none focus:shadow-outline";
  const variantStyle =
    variant === "outline"
      ? "bg-white text-gray-800 border border-gray-400 hover:bg-gray-100"
      : "bg-blue-500 hover:bg-blue-700 text-white";
  const sizeStyle = size === "icon" ? "p-2" : "py-2 px-4";

  return (
    <button className={`${baseStyle} ${variantStyle} ${sizeStyle}`} {...props}>
      {children}
    </button>
  );
};

const PolicyEditor: React.FC = () => {
  const thaiEditorRef = useRef<HTMLDivElement>(null);
  const englishEditorRef = useRef<HTMLDivElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [thaiPolicy, setThaiPolicy] = useState("");
  const [englishPolicy, setEnglishPolicy] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const thaiResponse = await fetch(
          "/api/policy/get?type=privacy-policy-thai"
        );
        const englishResponse = await fetch(
          "/api/policy/get?type=privacy-policy-english"
        );

        if (thaiResponse.ok && englishResponse.ok) {
          const thaiData = await thaiResponse.json();
          const englishData = await englishResponse.json();
          setThaiPolicy(thaiData.policy);
          setEnglishPolicy(englishData.policy);
        } else {
          console.error("Failed to fetch policies");
        }
      } catch (error) {
        console.error("Error fetching policies:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPolicies();
  }, []);

  useEffect(() => {
    if (thaiEditorRef.current && englishEditorRef.current && !isLoading) {
      thaiEditorRef.current.innerHTML = thaiPolicy;
      englishEditorRef.current.innerHTML = englishPolicy;
    }
  }, [thaiPolicy, englishPolicy, isLoading]);

  const applyStyle = (
    command: string,
    value: string | undefined = undefined
  ) => {
    document.execCommand(command, false, value);
    const activeElement = document.activeElement;
    if (
      activeElement instanceof HTMLElement &&
      (activeElement === thaiEditorRef.current ||
        activeElement === englishEditorRef.current)
    ) {
      activeElement.focus();
    }
  };

  const savePolicies = async () => {
    if (thaiEditorRef.current && englishEditorRef.current) {
      setIsSaving(true);
      try {
        const thaiResponse = await fetch("/api/policy", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            policy: thaiEditorRef.current.innerHTML,
            type: "privacy-policy-thai",
            creator: session?.user?.name,
          }),
        });

        const englishResponse = await fetch("/api/policy", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            policy: englishEditorRef.current.innerHTML,
            type: "privacy-policy-english",
            creator: session?.user?.name,
          }),
        });

        if (!thaiResponse.ok || !englishResponse.ok) {
          throw new Error("Failed to save policies");
        }

        Swal.fire({
          icon: "success",
          title: "สำเร็จ!",
          text: "บันทึกนโยบายทั้งสองภาษาเรียบร้อยแล้ว",
          confirmButtonText: "ตกลง",
        });
      } catch (error) {
        console.error("Error saving policies:", error);

        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด!",
          text: "ไม่สามารถบันทึกนโยบายได้ กรุณาลองใหม่อีกครั้ง",
          confirmButtonText: "ตกลง",
        });
      } finally {
        setIsSaving(false);
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FBFBFB] text-black">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="lg:mx-64 lg:mt-10 lg:mb-10 mt-10 mb-10 mx-5">
          <h1 className="text-xl font-bold mb-4 text-black">นโยบายส่วนบุคคล</h1>
          {isLoading ? (
            <div className="w-full h-64 flex items-center justify-center">
              <p>กำลังโหลดนโยบาย...</p>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <h2 className="text-lg font-semibold mb-2">ภาษาไทย</h2>
                <div className="mb-4 flex space-x-2">
                  <Button
                    onClick={() => applyStyle("bold")}
                    variant="outline"
                    size="icon"
                  >
                    <Bold className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => applyStyle("italic")}
                    variant="outline"
                    size="icon"
                  >
                    <Italic className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => applyStyle("underline")}
                    variant="outline"
                    size="icon"
                  >
                    <Underline className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => applyStyle("justifyLeft")}
                    variant="outline"
                    size="icon"
                  >
                    <AlignLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => applyStyle("justifyCenter")}
                    variant="outline"
                    size="icon"
                  >
                    <AlignCenter className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => applyStyle("justifyRight")}
                    variant="outline"
                    size="icon"
                  >
                    <AlignRight className="h-4 w-4" />
                  </Button>
                </div>
                <div
                  ref={thaiEditorRef}
                  className="w-full min-h-[200px] px-4 py-2 rounded-[9px] border border-[rgba(208,216,233,0.41)] text-black focus:outline-none focus:ring-2 focus:ring-[#5D76AD] resize-none overflow-hidden"
                  contentEditable
                  data-placeholder="กรุณากรอกนโยบายภาษาไทย"
                />
              </div>
              <div className="mb-4">
                <h2 className="text-lg font-semibold mb-2">ภาษาอังกฤษ</h2>
                <div className="mb-4 flex space-x-2">
                  <Button
                    onClick={() => applyStyle("bold")}
                    variant="outline"
                    size="icon"
                  >
                    <Bold className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => applyStyle("italic")}
                    variant="outline"
                    size="icon"
                  >
                    <Italic className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => applyStyle("underline")}
                    variant="outline"
                    size="icon"
                  >
                    <Underline className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => applyStyle("justifyLeft")}
                    variant="outline"
                    size="icon"
                  >
                    <AlignLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => applyStyle("justifyCenter")}
                    variant="outline"
                    size="icon"
                  >
                    <AlignCenter className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => applyStyle("justifyRight")}
                    variant="outline"
                    size="icon"
                  >
                    <AlignRight className="h-4 w-4" />
                  </Button>
                </div>
                <div
                  ref={englishEditorRef}
                  className="w-full min-h-[200px] px-4 py-2 rounded-[9px] border border-[rgba(208,216,233,0.41)] text-black focus:outline-none focus:ring-2 focus:ring-[#5D76AD] resize-none overflow-hidden"
                  contentEditable
                  data-placeholder="กรุณากรอกนโยบายภาษาอังกฤษ"
                />
              </div>
            </>
          )}
          <button
            onClick={savePolicies}
            disabled={isSaving || isLoading}
            className="mt-5 w-full lg:w-full py-3 flex-shrink-0 rounded-[10px] bg-[#5D76AD] text-white font-semibold flex items-center justify-center hover:bg-[#4A5F8C] transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSaving ? "กำลังบันทึก..." : "บันทึกนโยบายส่วนบุคคล"}
          </button>
        </div>
      </main>
    </div>
  );
};

export default PolicyEditor;
