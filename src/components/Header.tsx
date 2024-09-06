'use client';

import { FiMenu, FiPower } from 'react-icons/fi';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { signOut } from 'next-auth/react'

interface HeaderProps {
  toggleSidebar: () => void;
  selectedTab: string;
}

const Header = ({ toggleSidebar, selectedTab }: HeaderProps) => {
  return (
    <header className="flex items-center justify-between p-4 border-b border-gray-300 bg-background">
      <div className="flex items-center">
        <button
          className="text-2xl mr-4 lg:hidden focus:outline-none"
          onClick={toggleSidebar}
        >
          <FiMenu />
        </button>
        <span className="text-xl font-semibold text-secondary">{selectedTab}</span>
      </div>

      <div className="flex items-center space-x-4">
        <button
          className="text-xl cursor-pointer"
          onClick={() => signOut()} 
        >
          <FiPower />
        </button>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>JS</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};

export default Header;
