import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Toggle sidebar on mobile
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.querySelector('aside');
      const menuButton = document.querySelector('[data-menu-button]');
      
      if (
        sidebarOpen && 
        sidebar && 
        menuButton &&
        !sidebar.contains(event.target as Node) && 
        !menuButton.contains(event.target as Node)
      ) {
        setSidebarOpen(false);
      }
    };

    // Close sidebar on window resize (if screen becomes larger)
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('click', handleClickOutside);
      window.addEventListener('resize', handleResize);
    };
  }, [sidebarOpen]);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Regular sidebar (hidden on mobile) */}
      <Sidebar />
      
      {/* Mobile sidebar (shown when toggled) */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-gray-600 bg-opacity-75" />
          <div className="fixed inset-0 flex z-40">
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
              <Sidebar />
            </div>
            <div className="flex-shrink-0 w-14" aria-hidden="true" />
          </div>
        </div>
      )}
      
      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        <Header onToggleSidebar={toggleSidebar} />
        
        <main className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
