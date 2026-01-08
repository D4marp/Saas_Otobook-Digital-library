import { Card } from "@/components/ui/card";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Users, FileText, Code2, Bot, TrendingUp, ArrowUpRight, Clock, Activity } from "lucide-react";

export default function Dashboard() {
  const stats = [
    {
      label: "Total Users",
      value: "1,234",
      change: "+12%",
      icon: Users,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      borderColor: "border-l-4 border-l-blue-600",
    },
    {
      label: "Documents",
      value: "456",
      change: "+8%",
      icon: FileText,
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      borderColor: "border-l-4 border-l-green-600",
    },
    {
      label: "OCR Projects",
      value: "89",
      change: "+5%",
      icon: Code2,
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
      borderColor: "border-l-4 border-l-purple-600",
    },
    {
      label: "RPA Automations",
      value: "45",
      change: "+15%",
      icon: Bot,
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
      borderColor: "border-l-4 border-l-orange-600",
    },
  ];

  const recentActivity = [
    { user: "John Doe", action: "Created OCR project", time: "2 hours ago", type: "create" },
    { user: "Jane Smith", action: "Deployed RPA automation", time: "4 hours ago", type: "deploy" },
    { user: "Mike Johnson", action: "Updated user settings", time: "1 day ago", type: "update" },
    { user: "Sarah Wilson", action: "Completed OCR documentation", time: "2 days ago", type: "complete" },
  ];

  return (
    <DashboardLayout
      title="Dashboard"
      subtitle="Overview of your OTobook SaaS platform"
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className={`${stat.bgColor} ${stat.borderColor} p-6 hover:shadow-md transition-shadow`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <div className="flex items-center gap-1 mt-3">
                    <ArrowUpRight className={`w-4 h-4 ${stat.iconColor}`} />
                    <span className="text-sm font-medium text-gray-600">{stat.change} this month</span>
                  </div>
                </div>
                <div className={`${stat.iconColor} opacity-80`}>
                  <Icon className="w-8 h-8" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
            <Activity className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {recentActivity.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{item.user}</p>
                    <p className="text-sm text-gray-600">{item.action}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <Clock className="w-4 h-4" />
                  <p className="text-sm">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Performance Stats */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Performance</h2>
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">System Uptime</span>
                <span className="text-sm font-bold text-gray-900">99.9%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div className="bg-green-600 h-2 rounded-full transition-all" style={{ width: "99.9%" }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">API Usage</span>
                <span className="text-sm font-bold text-gray-900">68%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: "68%" }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">Storage Used</span>
                <span className="text-sm font-bold text-gray-900">42%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div className="bg-purple-600 h-2 rounded-full transition-all" style={{ width: "42%" }}></div>
              </div>
            </div>
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-600"></div>
                <span className="text-sm text-gray-700">All systems operational</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
