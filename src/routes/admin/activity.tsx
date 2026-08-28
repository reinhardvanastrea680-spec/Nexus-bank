import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Route as AdminRootRoute } from "../admin";
import { ArrowUpDown, Search, Calendar, Download, Eye } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "../../components/ui/dialog";
import { Badge } from "../../components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { useActivityLog } from "../../admin/hooks/useActivityLog";
import { exportToCSV } from "../../utils/exportToCSV";

export const Route = createFileRoute("/admin/activity")({
  component: AdminActivityPage,
  getParentRoute: () => AdminRootRoute,
});

function AdminActivityPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("desc"); // newest first
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const itemsPerPage = 25;
  const { log: logData, loading } = useActivityLog();

  // Filter and sort data
  const handleFilter = () => {
    let data = [...logData];

    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      data = data.filter(
        (item: any) =>
          item.description.toLowerCase().includes(query) ||
          (item.targetUserName && item.targetUserName.toLowerCase().includes(query)),
      );
    }

    // Action type filter
    if (actionFilter !== "all") {
      data = data.filter((item: any) => item.action === actionFilter);
    }

    // Sort
    data.sort((a: any, b: any) => {
      const aDate = new Date(a.timestamp).getTime();
      const bDate = new Date(b.timestamp).getTime();
      return sortOrder === "desc" ? bDate - aDate : aDate - bDate;
    });

    return data;
  };

  const filteredData = handleFilter();

  // Get current page items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // Get color for action type
  const getActionPillColor = (action: string) => {
    if (action.includes("USER")) return "bg-blue-500/20 text-blue-400 border border-blue-500/30";
    if (action.includes("BALANCE") || action.includes("TRANSACTION"))
      return "bg-green-500/20 text-green-400 border border-green-500/30";
    if (action.includes("CHAT"))
      return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30";
    if (action.includes("DELETE")) return "bg-red-500/20 text-red-400 border border-red-500/30";
    return "bg-gray-500/20 text-gray-400 border border-gray-500/30";
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-white">Activity Log</h1>
        <p className="text-sm text-[#8A9BB5]">
          Complete, immutable audit trail of every admin action
        </p>
      </div>

      {/* Retention Notice */}
      <div className="p-4 rounded-xl border border-[#38BDF8]/30 bg-[#38BDF8]/10">
        <p className="text-sm text-[#8A9BB5]">
          <span className="font-semibold text-[#38BDF8]">Notice</span>: Activity logs are retained
          indefinitely. All actions are final and cannot be retroactively edited.
        </p>
      </div>

      {/* Filters & Controls */}
      <Card className="glass-card border-0 bg-[#111827]">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-3 mb-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A9BB5]"
                  size={18}
                />
                <Input
                  placeholder="Search description or user..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-[#1A2438] border border-[rgba(255,255,255,0.1)] text-white"
                />
              </div>
            </div>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-[200px] bg-[#1A2438] border border-[rgba(255,255,255,0.1)] text-white">
                <SelectValue placeholder="Filter by action" />
              </SelectTrigger>
              <SelectContent className="bg-[#111827] border border-[rgba(255,255,255,0.1)] text-white">
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="BALANCE_OVERRIDE">Balance Override</SelectItem>
                <SelectItem value="TRANSACTION_POSTED">Transaction Posted</SelectItem>
                <SelectItem value="USER_CREATED">User Created</SelectItem>
                <SelectItem value="USER_DELETED">User Deleted</SelectItem>
                <SelectItem value="CHAT_REPLIED">Chat Replied</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={() => exportToCSV(logData, "nexus-bank-activity-log.csv")}
              className="bg-[#1A2438] text-white border border-[rgba(255,255,255,0.1)]"
            >
              <Download size={16} className="mr-2" />
              Export Log
            </Button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-[rgba(255,255,255,0.07)]">
            {loading ? (
              <div className="py-12 text-center text-[#8A9BB5]">Loading activity log...</div>
            ) : filteredData.length === 0 ? (
              <div className="py-12 text-center text-[#8A9BB5]">No activity yet</div>
            ) : (
              <Table>
                <TableHeader className="bg-[#070B14]">
                  <TableRow className="border-b border-[rgba(255,255,255,0.07)]">
                    <TableHead className="text-[#8A9BB5] font-semibold">
                      <Button
                        variant="ghost"
                        className="text-[#8A9BB5] hover:text-white p-0"
                        onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
                      >
                        Timestamp
                        <ArrowUpDown size={14} className="ml-1" />
                      </Button>
                    </TableHead>
                    <TableHead className="text-[#8A9BB5] font-semibold">Action Type</TableHead>
                    <TableHead className="text-[#8A9BB5] font-semibold">Description</TableHead>
                    <TableHead className="text-[#8A9BB5] font-semibold">Target User</TableHead>
                    <TableHead className="text-[#8A9BB5] font-semibold">Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.map((item: any) => (
                    <TableRow key={item.id} className="border-b border-[rgba(255,255,255,0.07)]">
                      <TableCell className="text-[#8A9BB5]">
                        {new Date(item.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge className={getActionPillColor(item.action)}>{item.action}</Badge>
                      </TableCell>
                      <TableCell className="text-white">{item.description}</TableCell>
                      <TableCell className="text-white">{item.targetUserName || "-"}</TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-[#38BDF8]">
                              <Eye size={16} />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-[#111827] border border-[rgba(255,255,255,0.1)] text-white">
                            <DialogHeader>
                              <DialogTitle className="text-white">Activity Details</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-3">
                              <div className="flex justify-between border-b border-[rgba(255,255,255,0.07)] pb-2">
                                <span className="text-[#8A9BB5]">Action</span>
                                <Badge className={getActionPillColor(item.action)}>
                                  {item.action}
                                </Badge>
                              </div>
                              <div className="flex justify-between border-b border-[rgba(255,255,255,0.07)] pb-2">
                                <span className="text-[#8A9BB5]">Description</span>
                                <span className="text-white">{item.description}</span>
                              </div>
                              <div className="flex justify-between border-b border-[rgba(255,255,255,0.07)] pb-2">
                                <span className="text-[#8A9BB5]">Target User</span>
                                <span className="text-white">{item.targetUserName || "-"}</span>
                              </div>
                              <div className="flex justify-between border-b border-[rgba(255,255,255,0.07)] pb-2">
                                <span className="text-[#8A9BB5]">Admin ID</span>
                                <span className="text-white">{item.adminId}</span>
                              </div>
                              <div className="pt-2">
                                <span className="text-[#8A9BB5] block mb-1">Meta Data</span>
                                <div className="bg-[#1A2438] rounded-lg p-3 font-mono text-sm">
                                  <pre className="text-[#8A9BB5]">
                                    {JSON.stringify(item.meta, null, 2)}
                                  </pre>
                                </div>
                              </div>
                            </div>
                            <DialogClose asChild>
                              <Button className="w-full bg-gradient-to-r from-[#38BDF8] to-[#6366F1] text-white">
                                Close
                              </Button>
                            </DialogClose>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-4">
            <p className="text-[#8A9BB5] text-sm">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredData.length)} of{" "}
              {filteredData.length} items
            </p>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                className="text-[#8A9BB5] border border-[rgba(255,255,255,0.1)]"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              >
                Previous
              </Button>
              <Button
                variant="ghost"
                className="text-[#8A9BB5] border border-[rgba(255,255,255,0.1)]"
                disabled={indexOfLastItem >= filteredData.length}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
