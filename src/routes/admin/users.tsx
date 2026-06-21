import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Plus, Search, Eye, Edit, Snowflake, Trash2 } from "lucide-react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { toast } from "sonner";
import { useUsers } from "../../admin/hooks/useUsers";
import { toggleUserFreeze } from "../../admin/utils/toggleUserFreeze";
import { deleteUserAndData } from "../../admin/utils/deleteUserAndData";
import { AddUserModal } from "../../admin/components/AddUserModal";

export const Route = createFileRoute("/admin/users")({
  component: AdminUsersPage,
});

function AdminUsersPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const { users, loading } = useUsers();

  const handleToggleFreeze = async (user: any) => {
    try {
      await toggleUserFreeze(user.id, user.fullName, user.status);
      toast.success(`User ${user.status === "active" ? "frozen" : "unfrozen"} successfully!`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update user status!");
    }
  };

  const handleDeleteUser = async (user: any) => {
    if (!window.confirm(`Are you sure you want to delete ${user.fullName} and all their data?`)) {
      return;
    }

    try {
      await deleteUserAndData(user.id, user.fullName);
      toast.success("User deleted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete user!");
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "active" && user.status === "active") ||
      (filter === "frozen" && user.status === "frozen");
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">User Management</h1>
          <p className="text-blue-300/60 text-sm">Manage all Nexus Bank users</p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-600 hover:to-violet-700 text-white gap-2"
        >
          <Plus size={18} />
          Add New User
        </Button>
      </div>

      <AddUserModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />

      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="flex gap-3 flex-1">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300/50" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-[#070B14] border-[rgba(255,255,255,0.1)] text-white placeholder:text-blue-300/50"
            />
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px] bg-[#070B14] border-[rgba(255,255,255,0.1)] text-white">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent className="bg-[#0D1625] border-[rgba(255,255,255,0.1)] text-white">
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="frozen">Frozen</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="glass-card border-0 overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-12 text-center text-[#8A9BB5]">Loading users...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="py-12 text-center text-[#8A9BB5]">No users found</div>
          ) : (
            <table className="w-full">
              <thead className="bg-[#070B14]">
                <tr>
                  <th className="text-left py-4 px-6 text-blue-300/60 text-xs font-medium uppercase">
                    #
                  </th>
                  <th className="text-left py-4 px-6 text-blue-300/60 text-xs font-medium uppercase">
                    User
                  </th>
                  <th className="text-left py-4 px-6 text-blue-300/60 text-xs font-medium uppercase">
                    Status
                  </th>
                  <th className="text-left py-4 px-6 text-blue-300/60 text-xs font-medium uppercase">
                    Checking
                  </th>
                  <th className="text-left py-4 px-6 text-blue-300/60 text-xs font-medium uppercase">
                    Savings
                  </th>
                  <th className="text-left py-4 px-6 text-blue-300/60 text-xs font-medium uppercase">
                    Created
                  </th>
                  <th className="text-left py-4 px-6 text-blue-300/60 text-xs font-medium uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <tr
                    key={user.id}
                    className="border-t border-[rgba(255,255,255,0.05)] hover:bg-white/5 cursor-pointer"
                    onClick={(e) => {
                      // Prevent click if clicking on action buttons
                      if (!(e.target as HTMLElement).closest("button")) {
                        navigate({ to: `/admin/users/${user.id}` });
                      }
                    }}
                  >
                    <td className="py-4 px-6 text-blue-300/60 font-mono text-sm">{index + 1}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-r from-cyan-500 to-violet-600 flex items-center justify-center text-white font-semibold text-sm">
                          {user.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-white font-medium">{user.fullName}</p>
                          <p className="text-blue-300/60 text-sm">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.status === "active"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-white font-mono text-sm">
                      ${(user.checkingBalance || 0).toLocaleString()}
                    </td>
                    <td className="py-4 px-6 text-white font-mono text-sm">
                      ${(user.savingsBalance || 0).toLocaleString()}
                    </td>
                    <td className="py-4 px-6 text-blue-300/60 text-sm">
                      {user.createdAt?.toLocaleDateString?.() || "-"}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-blue-300 hover:text-white hover:bg-blue-500/10"
                          onClick={() => navigate({ to: `/admin/users/${user.id}` })}
                        >
                          <Eye size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-blue-300 hover:text-white hover:bg-blue-500/10"
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-blue-300 hover:text-white hover:bg-blue-500/10"
                          onClick={() => handleToggleFreeze(user)}
                        >
                          <Snowflake size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          onClick={() => handleDeleteUser(user)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </div>
  );
}
