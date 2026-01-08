import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export const DashboardLayout = ({
  children,
  title,
  subtitle,
}: DashboardLayoutProps) => {
  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-0 lg:ml-64 mt-16 lg:mt-0">
        <div className="p-6 lg:p-8">
          {title && (
            <div className="mb-8 pb-6 border-b border-gray-200">
              <h1 className="text-4xl font-bold text-gray-900">{title}</h1>
              {subtitle && (
                <p className="text-gray-600 mt-2 text-base">{subtitle}</p>
              )}
            </div>
          )}
          {children}
        </div>
      </main>
    </div>
  );
};
