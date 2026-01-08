import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toggle } from "@/components/ui/toggle";
import { Save, Copy, Eye, EyeOff } from "lucide-react";
import { useState as useStateHook } from "react";

export default function Settings() {
  const [profile, setProfile] = useState({
    companyName: "My Company",
    email: "admin@example.com",
    phone: "+1 (555) 000-0000",
    website: "https://example.com",
  });

  const [apiKey, setApiKey] = useState("sk_live_1234567890abcdef");
  const [showApiKey, setShowApiKey] = useState(false);
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    weeklyReport: true,
    productUpdates: false,
    securityAlerts: true,
  });

  const [copied, setCopied] = useState(false);

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <DashboardLayout
      title="Settings"
      subtitle="Manage your account and preferences"
    >
      <div className="space-y-6">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="api">API Keys</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6 mt-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Profile Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Company Name</label>
                  <Input
                    value={profile.companyName}
                    onChange={(e) =>
                      setProfile({ ...profile, companyName: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <Input
                    type="email"
                    value={profile.email}
                    onChange={(e) =>
                      setProfile({ ...profile, email: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone</label>
                  <Input
                    value={profile.phone}
                    onChange={(e) =>
                      setProfile({ ...profile, phone: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Website</label>
                  <Input
                    value={profile.website}
                    onChange={(e) =>
                      setProfile({ ...profile, website: e.target.value })
                    }
                  />
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* API Keys Tab */}
          <TabsContent value="api" className="space-y-6 mt-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">API Keys</h3>
              <p className="text-gray-600 text-sm mb-4">
                Use your API key to authenticate requests to the OTobook API.
              </p>

              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1">
                    {showApiKey ? (
                      <code className="bg-white p-2 rounded border border-gray-300 flex-1 font-mono text-sm">
                        {apiKey}
                      </code>
                    ) : (
                      <code className="bg-white p-2 rounded border border-gray-300 flex-1 font-mono text-sm">
                        {"•".repeat(apiKey.length)}
                      </code>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="ml-2"
                  >
                    {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyApiKey}
                    className="ml-2"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <h4 className="font-semibold">API Usage</h4>
                <div className="text-sm text-gray-600">
                  <p>Requests this month: <span className="font-bold">18,450</span></p>
                  <p>Rate limit: <span className="font-bold">100,000</span> per month</p>
                </div>
              </div>

              <Button variant="outline" className="text-red-600">
                Regenerate API Key
              </Button>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6 mt-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Notification Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium">Email Alerts</p>
                    <p className="text-sm text-gray-600">
                      Get notified about important events
                    </p>
                  </div>
                  <Toggle
                    pressed={notifications.emailAlerts}
                    onPressedChange={(pressed) =>
                      setNotifications({
                        ...notifications,
                        emailAlerts: pressed,
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium">Weekly Reports</p>
                    <p className="text-sm text-gray-600">
                      Receive weekly usage reports
                    </p>
                  </div>
                  <Toggle
                    pressed={notifications.weeklyReport}
                    onPressedChange={(pressed) =>
                      setNotifications({
                        ...notifications,
                        weeklyReport: pressed,
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium">Product Updates</p>
                    <p className="text-sm text-gray-600">
                      Learn about new features and improvements
                    </p>
                  </div>
                  <Toggle
                    pressed={notifications.productUpdates}
                    onPressedChange={(pressed) =>
                      setNotifications({
                        ...notifications,
                        productUpdates: pressed,
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium">Security Alerts</p>
                    <p className="text-sm text-gray-600">
                      Notifications about security events
                    </p>
                  </div>
                  <Toggle
                    pressed={notifications.securityAlerts}
                    onPressedChange={(pressed) =>
                      setNotifications({
                        ...notifications,
                        securityAlerts: pressed,
                      })
                    }
                  />
                </div>
              </div>

              <Button className="mt-6 bg-blue-600 hover:bg-blue-700">
                <Save className="w-4 h-4 mr-2" />
                Save Preferences
              </Button>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6 mt-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Security Settings</h3>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">Two-Factor Authentication</h4>
                  <p className="text-gray-600 text-sm mb-4">
                    Add an extra layer of security to your account
                  </p>
                  <Button>Enable 2FA</Button>
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-semibold mb-3">Active Sessions</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium">Chrome on macOS</p>
                        <p className="text-xs text-gray-600">
                          Last active: 5 minutes ago
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Sign Out
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium">Safari on iPhone</p>
                        <p className="text-xs text-gray-600">
                          Last active: 2 hours ago
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Sign Out
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-semibold mb-3">Password</h4>
                  <p className="text-gray-600 text-sm mb-4">
                    Change your password regularly to keep your account secure
                  </p>
                  <Button>Change Password</Button>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
