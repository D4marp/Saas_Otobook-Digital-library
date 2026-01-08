import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DashboardLayout } from "@/components/DashboardLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Edit2, Trash2, Plus, Search, AlertCircle } from "lucide-react";
import { userAPI } from "@/lib/api";

interface User {
  id: number;
  name: string;
  email: string;
  role: "Admin" | "User" | "Editor";
  status: "Active" | "Inactive";
  created_at: string;
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [stats, setStats] = useState({ total_users: 0, active_users: 0, admin_count: 0 });

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await userAPI.getAllUsers();
      setUsers(response.data.data);
      
      // Fetch stats
      const statsResponse = await userAPI.getUserStats();
      setStats(statsResponse.data.data);
    } catch (err) {
      setError("Failed to fetch users. Make sure backend is running.");
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Admin":
        return "bg-red-100 text-red-800";
      case "Editor":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    return status === "Active"
      ? "bg-green-100 text-green-800"
      : "bg-gray-100 text-gray-800";
  };

  const handleDeleteUser = async (id: number) => {
    try {
      await userAPI.deleteUser(id);
      setUsers(users.filter((user) => user.id !== id));
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  const handleAddUser = async (e: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget);
    try {
      const newUserData = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        password: "temp123",
        company: formData.get("company") as string,
        role: formData.get("role") as string,
      };
      await userAPI.createUser(newUserData);
      fetchUsers();
    } catch (err) {
      console.error("Error adding user:", err);
    }
  };

  return (
    <DashboardLayout
      title="User Management"
      subtitle="Manage platform users and their roles"
    >
      <div className="space-y-6">
        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2 text-red-800">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6">
            <p className="text-gray-600 text-sm">Total Users</p>
            <p className="text-3xl font-bold text-gray-900">{stats.total_users}</p>
          </Card>
          <Card className="p-6">
            <p className="text-gray-600 text-sm">Active Users</p>
            <p className="text-3xl font-bold text-green-600">{stats.active_users}</p>
          </Card>
          <Card className="p-6">
            <p className="text-gray-600 text-sm">Admins</p>
            <p className="text-3xl font-bold text-red-600">{stats.admin_count}</p>
          </Card>
        </div>

        {/* Header with Actions */}
        <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Button onClick={() => fetchUsers()} className="bg-green-600 hover:bg-green-700 mr-2">
            Refresh
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddUser} className="space-y-4">
                <Input name="name" placeholder="Full Name" required />
                <Input name="email" placeholder="Email Address" type="email" required />
                <Input name="company" placeholder="Company Name" />
                <select name="role" className="w-full border border-gray-300 rounded-lg px-3 py-2">
                  <option>User</option>
                  <option>Admin</option>
                  <option>Editor</option>
                </select>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                  Create User
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Loading State */}
        {loading && (
          <Card className="p-8 text-center">
            <p className="text-gray-600">Loading users...</p>
          </Card>
        )}

        {/* Users Table */}
        {!loading && users.length > 0 && (
          <Card>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge className={getRoleColor(user.role)}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(user.status)}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setEditingUser(user)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        )}

        {/* Empty State */}
        {!loading && users.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-gray-500">No users found. Create one to get started!</p>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
