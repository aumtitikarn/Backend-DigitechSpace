import React, { useState, ReactNode } from 'react';
import Image from "next/image";
import Link from 'next/link';
import { 
  X, 
  Menu, 
  Users, 
  ClipboardCheck, 
  FileText, 
  Wallet, 
  HelpCircle, 
  BarChart2,
  UserCircle,
  GraduationCap,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  LucideIcon,
  LogOut,
  Siren,
  FolderKanban
} from 'lucide-react';
import { MdAccountCircle } from "react-icons/md";
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface INavigationItemProps {
  icon: LucideIcon;
  label: string;
  href?: string;
  onItemClick?: () => void;
  isActive?: boolean;
  subItems?: ReactNode;
  id: string;
}

const NavigationItem: React.FC<INavigationItemProps> = ({ 
  icon: Icon, 
  label, 
  href,
  onItemClick, 
  isActive = false, 
  subItems, 
  id 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleItemClick = () => {
    if (onItemClick) {
      onItemClick();
    }
    if (subItems) {
      setIsExpanded(!isExpanded);
    }
  };

  
  const content = (
    <>
      <div className="flex items-center space-x-2">
        <Icon size={20} aria-hidden="true" />
        <span>{label}</span>
      </div>
      {subItems && (
        isExpanded ? (
          <ChevronUp size={16} className="text-gray-400" aria-hidden="true" />
        ) : (
          <ChevronDown size={16} className="text-gray-400" aria-hidden="true" />
        )
      )}
    </>
  );

  if (href) {
    return (
      <li>
        <Link href={href} 
          className={`flex items-center justify-between w-full p-2 hover:bg-gray-700 rounded ${isActive ? 'bg-gray-700' : ''}`}
        >
          {content}
        </Link>
      </li>
    );
  }

  return (
    <li>
      <button 
        onClick={handleItemClick} 
        className={`flex items-center justify-between w-full p-2 hover:bg-gray-700 rounded ${isActive ? 'bg-gray-700' : ''}`}
        aria-expanded={isExpanded}
        aria-controls={subItems ? `${id}-subitems` : undefined}
      >
        {content}
      </button>
      {subItems && isExpanded && (
        <ul id={`${id}-subitems`} className="ml-4 mt-2 space-y-2">
          {subItems}
        </ul>
      )}
    </li>
  );
};

const Sidebar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfileDropdown = () => setIsProfileDropdownOpen(!isProfileDropdownOpen);

  const handleItemClick = (itemId: string) => {
    setActiveItem(itemId);
    // Additional logic can be added here
  };

  const handleSignOut = async () => {
    await signOut({ 
      redirect: true,
      callbackUrl: '/'
    });
  };

  return (
    <div className="bg-[#0B1E48] text-white">
      <header className="flex items-center justify-between">
        <Menu className="text-3xl cursor-pointer ml-[30px]" onClick={toggleMenu} aria-label="Toggle menu" />
        <div className="relative w-[90px] h-[90px]">
          <Image
            src="https://m1r.ai/W8p5i.png"
            alt="Digitech Space logo"
            fill
            sizes="90px"
            className="object-contain"
            priority // Add priority since this is above the fold
            unoptimized 
          />
        </div>
      <div className="relative mr-[30px]">
          <button
            onClick={toggleProfileDropdown}
            className="focus:outline-none"
            aria-haspopup="true"
            aria-expanded={isProfileDropdownOpen}
          >
            <MdAccountCircle className="text-[40px] text-white"/>
          </button>
          {isProfileDropdownOpen && (
            <div className="w-[300px] absolute right-0 mt-2 p-4 bg-white rounded-md shadow-lg  z-10">
              <div className=" text-sm text-gray-700 ">
                <strong className="font-bold">แอดมิน</strong> {session?.user?.name}
              </div>
              <div className="border-t border-gray-200 my-3"></div>
              <button
                onClick={handleSignOut}
                className="block w-full text-left  text-sm text-gray-700 hover:bg-gray-100"
              >
                <LogOut className="inline-block mr-2" size={16} />
                ออกจากระบบ
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Sliding Menu */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-[#0B1E48] transform ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out z-50`}
        aria-hidden={!isMenuOpen}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
          <div className="relative w-[100px] h-[100px]">
          <Image
            src="https://m1r.ai/W8p5i.png"
            alt="Digitech Space logo"
            fill
            sizes="100px"
            className="object-contain"
            priority // Add priority since this is above the fold
            unoptimized 
          />
          </div>
            <X className="text-3xl cursor-pointer" onClick={toggleMenu} aria-label="Close menu" />
          </div>

          <nav>
            <ul className="space-y-4">
              <NavigationItem 
                id="users"
                icon={Users} 
                label="รายชื่อผู้ใช้" 
                onItemClick={() => handleItemClick('users')}
                isActive={activeItem === 'users'}
                subItems={
                  <>
                    <li><Link href="/normal" className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded"><UserCircle size={16} /><span>ผู้ใช้ทั่วไป</span></Link></li>
                    <li><Link href="/student" className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded"><GraduationCap size={16} /><span>นักศึกษา</span></Link></li>
                    <li><Link href="/admin" className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded"><ShieldCheck size={16} /><span>แอดมิน</span></Link></li>
                  </>
                }
              />
              <NavigationItem 
                id="approve-sales"
                icon={ClipboardCheck} 
                label="อนุมัติการขาย" 
                href="/ApproveSell"
                isActive={activeItem === 'approve-sales'}
              />
              <NavigationItem 
                id="project"
                icon={FolderKanban} 
                label="โครงงาน" 
                href="/Project"
                isActive={activeItem === 'approve-sales'}
              />
              <NavigationItem 
                id="user-reports"
                icon={FileText} 
                label="รายงานของผู้ใช้" 
                onItemClick={() => handleItemClick('user-reports')}
                isActive={activeItem === 'user-reports'}
                subItems={
                  <>
                    <li><Link href="/Reportproject" className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded"><FileText size={16} /><span>โครงงาน</span></Link></li>
                    <li><Link href="/Reportblog" className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded"><FileText size={16} /><span>บล็อก</span></Link></li>
                  </>
                }
              />
              <NavigationItem 
                id="withdraw-requests"
                icon={Wallet} 
                label="คำร้องขอถอนเงิน" 
                href="/Withdraw"
                isActive={activeItem === 'withdraw-requests'}
              />
              <NavigationItem 
                id="user-issues"
                icon={HelpCircle} 
                label="คำร้องปัญหาของผู้ใช้" 
                href="/ReportService"
                isActive={activeItem === 'user-issues'}
              />
              <NavigationItem 
                id="policy"
                icon={Siren} 
                label="นโยบายส่วนบุคคล" 
                href="/policy"
                isActive={activeItem === 'policy'}
              />
              <NavigationItem 
                id="summary"
                icon={BarChart2} 
                label="สรุปผล" 
                href="/Analyst"
                isActive={activeItem === 'summary'}
              />
            </ul>
          </nav>
        </div>
      </div>

      {/* Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40"
          onClick={toggleMenu}
          aria-hidden="true"
        ></div>
      )}
    </div>
  );
};

export default Sidebar; 