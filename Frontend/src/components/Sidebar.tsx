import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Users,
  BookOpen,
  Settings,
  LogOut,
  Menu,
  X,
  BarChart3,
  Code2,
  Bot,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const location = useLocation();

  const menuItems = [
    {
      label: "Dashboard",
      icon: Home,
      href: "/dashboard",
    },
    {
      label: "User Management",
      icon: Users,
      href: "/dashboard/users",
    },
    {
      label: "OCR Documentation",
      icon: Code2,
      href: "/documentation/ocr",
    },
    {
      label: "RPA Framework",
      icon: Bot,
      href: "/documentation/rpa",
    },
    {
      label: "Analytics",
      icon: BarChart3,
      href: "/dashboard/analytics",
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/dashboard/settings",
    },
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 lg:hidden p-4 flex justify-between items-center shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-blue-600">OTOBOOK</h1>
          <p className="text-xs text-gray-500">Dashboard</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setOpen(!open)}
          className="hover:bg-gray-100"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-screen bg-white border-r border-gray-200 transition-all duration-300 z-40 pt-20 lg:pt-0 flex flex-col",
          open ? "w-64" : "w-0 lg:w-64"
        )}
      >
        <div className="p-6 hidden lg:block border-b border-gray-200">
          <h1 className="text-2xl font-bold text-blue-600">OTOBOOK</h1>
          <p className="text-xs text-gray-500 mt-2">Professional Dashboard</p>
        </div>

        <nav className="space-y-1 px-3 py-6 flex-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    setOpen(false);
                  }
                }}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 font-medium",
                  active
                    ? "bg-blue-50 text-blue-700 border-l-4 border-l-blue-600"
                    : "text-gray-700 hover:bg-gray-50"
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="hidden lg:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-gray-200">
          <Button
            variant="outline"
            className="w-full justify-start text-gray-700 hover:bg-red-50 hover:text-red-700 hover:border-red-200"
            onClick={() => {
              localStorage.removeItem("authToken");
              window.location.href = "/";
            }}
          >
            <LogOut className="w-5 h-5 mr-2" />
            <span className="hidden lg:inline">Logout</span>
          </Button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
};
