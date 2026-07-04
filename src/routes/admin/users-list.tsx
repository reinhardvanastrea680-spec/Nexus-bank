import { useState, useMemo } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Users as UsersIcon, Search, ChevronRight } from "lucide-react";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { useUsers } from "../../admin/hooks/useUsers";

export const Route = createFileRoute("/admin/users-list")({
  component: AdminUsersListPage,
});

const ITEMS_PER_PAGE = 30;

function AdminUsersListPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const { users, loading } = useUsers();

  const filteredUsers = useMemo(() => 
    users.filter((u) => 
      u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
    ), [users, searchTerm]
  );

  const pagedUsers = filteredUsers.slice(0, page * ITEMS_PER_PAGE);
  const hasMore = pagedUsers.length < filteredUsers.length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
          <UsersIcon size={22} className="text-cyan-400" aria-hidden="true" />
          Users
        </h1>
        <p className="text-blue-300/60 text-xs md:text-sm mt-0.5">
          Browse all Nexus Bank users
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300/50" aria-hidden="true" />
        <Input 
          placeholder="Search users by name or email..." 
          value={searchTerm} 
          onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
          aria-label="Search users"
          className="pl-10 bg-[#070B14] border-[rgba(255,255,255,0.1)] text-white placeholder:text-blue-300/50" 
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-xl text-center glass-card">
          <p className="text-2xl font-bold font-mono text-cyan-400">{users.length}</p>
          <p className="text-xs text-blue-300/60 mt-1">Total Users</p>
        </div>
        <div className="p-4 rounded-xl text-center glass-card">
          <p className="text-2xl font-bold font-mono text-violet-400">{filteredUsers.length}</p>
          <p className="text-xs text-blue-300/60 mt-1">Filtered</p>
        </div>
      </div>

      {/* Users List */}
      {loading ? (
        <Card className="glass-card border-0">
          <div className="py-12 text-center text-[#8A9BB5]">Loading users...</div>
        </Card>
      ) : filteredUsers.length === 0 ? (
        <Card className="glass-card border-0">
          <div className="py-12 text-center text-[#8A9BB5]">No users found</div>
        </Card>
      ) : (
        <>
          {/* Desktop Grid */}
          <div className="hidden md:grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
            {pagedUsers.map((user) => (
              <div
                key={user.id}
                onClick={() => navigate({ to: `/admin/users/${user.id}` })}
                className="glass-card p-4 cursor-pointer hover:bg-white/5 transition-all group"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && navigate({ to: `/admin/users/${user.id}` })}
              >
                <div className="flex items-start gap-3">
                  {/* Profile Picture */}
                  <div className="relative flex-shrink-0">
                    {user.profilePhotoURL ? (
                      <img 
                        src={user.profilePhotoURL} 
                        alt={user.fullName}
                        className="w-14 h-14 rounded-full object-cover border-2 border-cyan-500/20"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-gradient-to-r from-cyan-500 to-violet-600 flex items-center justify-center text-white font-bold text-lg border-2 border-cyan-500/20">
                        {user.fullName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-[#0D1625] ${user.status === "active" ? "bg-green-400" : "bg-red-400"}`} />
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold text-sm truncate group-hover:text-cyan-400 transition-colors">
                      {user.fullName}
                    </h3>
                    <p className="text-blue-300/60 text-xs truncate mt-0.5">
                      {user.email}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                        {user.accountTier || "Standard"}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${user.status === "active" ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>
                        {user.status}
                      </span>
                    </div>
                  </div>

                  {/* Arrow Icon */}
                  <ChevronRight size={16} className="text-blue-300/40 group-hover:text-cyan-400 transition-colors flex-shrink-0 mt-1" aria-hidden="true" />
                </div>
              </div>
            ))}
          </div>

          {/* Mobile List */}
          <div className="space-y-2 md:hidden">
            {pagedUsers.map((user) => (
              <div
                key={user.id}
                onClick={() => navigate({ to: `/admin/users/${user.id}` })}
                className="rounded-2xl overflow-hidden"
                style={{ background: "#0F1829", border: "1px solid rgba(255,255,255,0.06)" }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && navigate({ to: `/admin/users/${user.id}` })}
              >
                <div className="flex items-center gap-3 px-4 py-3 cursor-pointer active:bg-white/5">
                  {/* Profile Picture */}
                  <div className="relative flex-shrink-0">
                    {user.profilePhotoURL ? (
                      <img 
                        src={user.profilePhotoURL} 
                        alt={user.fullName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm">
                        {user.fullName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#0F1829] ${user.status === "active" ? "bg-green-400" : "bg-red-400"}`} />
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm truncate">{user.fullName}</p>
                    <p className="text-blue-300/50 text-xs truncate">{user.email}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="px-1.5 py-0.5 rounded text-xs font-medium bg-cyan-500/10 text-cyan-400">
                        {user.accountTier || "Standard"}
                      </span>
                    </div>
                  </div>

                  <ChevronRight size={16} className="text-blue-300/40 flex-shrink-0" aria-hidden="true" />
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {hasMore && (
            <button 
              onClick={() => setPage((p) => p + 1)}
              className="w-full py-3 rounded-xl text-sm font-semibold transition-all"
              style={{ background: "rgba(255,255,255,0.04)", color: "#8A9BB5", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              Load more ({filteredUsers.length - pagedUsers.length} remaining)
            </button>
          )}

          <p className="text-xs text-center text-blue-300/40">
            Showing {pagedUsers.length} of {filteredUsers.length} users
          </p>
        </>
      )}
    </div>
  );
}
