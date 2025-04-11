import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

// Navigation item types
type NavItem = {
  label: string;
  href: string;
  icon: string;
};

type NavSection = {
  label: string;
  items: NavItem[];
};

// Navigation data structure
const navigation: NavSection[] = [
  {
    label: "Customers",
    items: [
      { label: "Companies", href: "/customers", icon: "ri-building-line" },
      { label: "Contacts", href: "/contacts", icon: "ri-contacts-line" },
    ],
  },
  {
    label: "Equipment",
    items: [
      { label: "Inventory", href: "/equipment", icon: "ri-tools-line" },
      { label: "Categories", href: "/categories", icon: "ri-list-check" },
      { label: "Brands", href: "/brands", icon: "ri-award-line" },
      { label: "Maintenance", href: "/maintenance", icon: "ri-service-line" },
    ],
  },
  {
    label: "Rentals",
    items: [
      { label: "Active Rentals", href: "/rentals", icon: "ri-calendar-check-line" },
      { label: "Rental History", href: "/rentals/history", icon: "ri-file-list-3-line" },
    ],
  },
  {
    label: "Reports",
    items: [
      { label: "Usage Reports", href: "/reports/usage", icon: "ri-bar-chart-2-line" },
      { label: "Financial Reports", href: "/reports/financial", icon: "ri-money-dollar-circle-line" },
    ],
  },
];

const Sidebar = () => {
  const [location] = useLocation();

  // Check if the current location starts with the given path
  const isActive = (path: string) => {
    return location === path || 
           (path !== "/" && location.startsWith(path));
  };

  return (
    <aside className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64 bg-white border-r border-neutral-light">
        <div className="flex items-center justify-center h-16 px-4 border-b border-neutral-light">
          <h1 className="text-xl font-semibold text-primary">EquipRent</h1>
        </div>
        
        <div className="flex flex-col flex-grow px-4 py-4 overflow-y-auto">
          <div className="space-y-1">
            <Link href="/dashboard">
              <div className={cn(
                "flex items-center px-2 py-2 text-sm font-medium rounded-md cursor-pointer",
                isActive("/dashboard") 
                  ? "text-white bg-primary" 
                  : "text-neutral-dark hover:bg-neutral-lightest"
              )}>
                <i className="ri-dashboard-line mr-3 text-lg"></i>
                Dashboard
              </div>
            </Link>
            
            {navigation.map((section, index) => (
              <div key={index} className="mt-4">
                <p className="px-2 text-xs font-semibold text-neutral-dark uppercase tracking-wider">
                  {section.label}
                </p>
                
                {section.items.map((item, itemIndex) => (
                  <Link key={itemIndex} href={item.href}>
                    <div className={cn(
                      "flex items-center px-2 py-2 mt-1 text-sm font-medium rounded-md cursor-pointer",
                      isActive(item.href) 
                        ? "text-white bg-primary" 
                        : "text-neutral-dark hover:bg-neutral-lightest"
                    )}>
                      <i className={`${item.icon} mr-3 text-lg`}></i>
                      {item.label}
                    </div>
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex items-center px-4 py-3 border-t border-neutral-light">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
              <i className="ri-user-line"></i>
            </div>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium">Admin User</p>
            <p className="text-xs text-neutral-dark">Administrator</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
