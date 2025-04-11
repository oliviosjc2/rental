import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface HeaderProps {
  onToggleSidebar: () => void;
}

const Header = ({ onToggleSidebar }: HeaderProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="flex items-center justify-between h-16 px-6 bg-white border-b border-neutral-light">
      <div className="flex items-center md:hidden">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onToggleSidebar} 
          className="text-neutral-dark hover:text-primary"
        >
          <i className="ri-menu-line text-2xl"></i>
        </Button>
        <h1 className="ml-3 text-xl font-semibold text-primary">EquipRent</h1>
      </div>
      
      <div className="flex items-center ml-auto">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <i className="ri-search-line text-neutral-dark"></i>
          </div>
          <Input
            className="w-full pl-10 pr-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm"
            placeholder="Search..."
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="ml-4 relative p-1 text-neutral-dark hover:text-primary"
        >
          <i className="ri-notification-3-line text-xl"></i>
          <span className="absolute top-0 right-0 block w-2 h-2 bg-destructive rounded-full"></span>
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="ml-4 relative p-1 text-neutral-dark hover:text-primary"
        >
          <i className="ri-settings-3-line text-xl"></i>
        </Button>
      </div>
    </header>
  );
};

export default Header;
