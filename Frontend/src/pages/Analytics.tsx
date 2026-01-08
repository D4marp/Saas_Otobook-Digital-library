import { Card } from "@/components/ui/card";
import { DashboardLayout } from "@/components/DashboardLayout";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const analyticsData = [
  { date: "Jan 1", ocr: 450, rpa: 240 },
  { date: "Jan 8", ocr: 520, rpa: 280 },
  { date: "Jan 15", ocr: 480, rpa: 320 },
  { date: "Jan 22", ocr: 650, rpa: 290 },
  { date: "Jan 29", ocr: 720, rpa: 410 },
  { date: "Feb 5", ocr: 890, rpa: 520 },
  { date: "Feb 12", ocr: 1050, rpa: 680 },
];

const usageData = [
  { name: "Web OCR", value: 4200, color: "#3b82f6" },
  { name: "Mobile OCR", value: 2800, color: "#8b5cf6" },
  { name: "RPA Tasks", value: 3500, color: "#f97316" },
  { name: "API Calls", value: 5600, color: "#06b6d4" },
];

export default function Analytics() {
  return (
    <DashboardLayout
      title="Analytics"
      subtitle="Monitor your OCR and RPA performance"
    >
      <div className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4">
            <p className="text-sm text-gray-600">Total OCR Requests</p>
            <p className="text-3xl font-bold mt-2">18,450</p>
            <p className="text-xs text-green-600 mt-2">+12% from last month</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-gray-600">RPA Automations Run</p>
            <p className="text-3xl font-bold mt-2">2,580</p>
            <p className="text-xs text-green-600 mt-2">+28% from last month</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-gray-600">API Success Rate</p>
            <p className="text-3xl font-bold mt-2">99.8%</p>
            <p className="text-xs text-green-600 mt-2">+0.2% from last month</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-gray-600">Active Users</p>
            <p className="text-3xl font-bold mt-2">342</p>
            <p className="text-xs text-green-600 mt-2">+5% from last month</p>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Trend Chart */}
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">Usage Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analyticsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="ocr" stroke="#3b82f6" name="OCR Requests" />
                <Line type="monotone" dataKey="rpa" stroke="#f97316" name="RPA Tasks" />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Usage Breakdown */}
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">Usage Breakdown</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={usageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Detailed Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">Top Services</h3>
            <div className="space-y-3">
              {usageData.map((item) => (
                <div key={item.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{item.name}</span>
                    <span className="font-bold">{item.value}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${(item.value / 5600) * 100}%`,
                        backgroundColor: item.color,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">Response Times</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Average Response</p>
                <p className="text-2xl font-bold">245ms</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">P95 Response</p>
                <p className="text-2xl font-bold">892ms</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">P99 Response</p>
                <p className="text-2xl font-bold">1,230ms</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">System Health</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>CPU Usage</span>
                  <span>42%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: "42%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Memory Usage</span>
                  <span>68%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "68%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Disk Usage</span>
                  <span>35%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: "35%" }}></div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
