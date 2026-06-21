import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Route as AdminRootRoute } from "../admin";
import { Search, Download, ArrowUpRight, ArrowDownRight, Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useTransactions } from "../../admin/hooks/useTransactions";
import { exportToCSV } from "../../utils/exportToCSV";

export const Route = createFileRoute("/admin/transactions")({
  component: AdminTransactionsPage,
  getParentRoute: () => AdminRootRoute,
});

function AdminTransactionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { transactions, loading } = useTransactions();

  const filteredTransactions = transactions.filter(
    (tx) =>
      tx.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.userFullName?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalCredits = transactions
    .filter((tx) => tx.type === "credit")
    .reduce((sum, tx) => sum + (tx.amount || 0), 0);

  const totalDebits = transactions
    .filter((tx) => tx.type === "debit")
    .reduce((sum, tx) => sum + (tx.amount || 0), 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Transaction Manager</h1>
          <p className="text-blue-300/60 text-sm">View and manage all transactions</p>
        </div>
        <Button
          onClick={() => exportToCSV(transactions, "nexus-bank-transactions.csv")}
          className="bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-600 hover:to-violet-700 text-white gap-2"
        >
          <Download size={18} />
          Export CSV
        </Button>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <Input
          placeholder="Search transactions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-80 bg-[#070B14] border-[rgba(255,255,255,0.1)] text-white"
        />
      </div>

      <Card className="glass-card border-0 overflow-hidden">
        <div className="p-4 border-b border-[rgba(255,255,255,0.05)] flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <span className="text-blue-300/70 text-sm">Total Credits:</span>
            <span className="text-green-400 font-mono text-sm">
              ${totalCredits.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-blue-300/70 text-sm">Total Debits:</span>
            <span className="text-red-400 font-mono text-sm">${totalDebits.toLocaleString()}</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-12 text-center text-[#8A9BB5]">Loading transactions...</div>
          ) : filteredTransactions.length === 0 ? (
            <div className="py-12 text-center text-[#8A9BB5]">No transactions yet</div>
          ) : (
            <table className="w-full">
              <thead className="bg-[#070B14]">
                <tr>
                  <th className="text-left py-4 px-6 text-blue-300/60 text-xs font-medium uppercase">
                    Date
                  </th>
                  <th className="text-left py-4 px-6 text-blue-300/60 text-xs font-medium uppercase">
                    User
                  </th>
                  <th className="text-left py-4 px-6 text-blue-300/60 text-xs font-medium uppercase">
                    Account
                  </th>
                  <th className="text-left py-4 px-6 text-blue-300/60 text-xs font-medium uppercase">
                    Description
                  </th>
                  <th className="text-left py-4 px-6 text-blue-300/60 text-xs font-medium uppercase">
                    Type
                  </th>
                  <th className="text-left py-4 px-6 text-blue-300/60 text-xs font-medium uppercase">
                    Amount
                  </th>
                  <th className="text-left py-4 px-6 text-blue-300/60 text-xs font-medium uppercase">
                    Balance After
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className="border-t border-[rgba(255,255,255,0.05)] hover:bg-white/5"
                  >
                    <td className="py-4 px-6 text-blue-300/60 text-sm">
                      {tx.createdAt?.toLocaleString()}
                    </td>
                    <td className="py-4 px-6 text-white font-medium">
                      {tx.userFullName || "Unknown"}
                    </td>
                    <td className="py-4 px-6 text-blue-300/60 text-sm capitalize">
                      {tx.account || "Checking"}
                    </td>
                    <td className="py-4 px-6 text-white text-sm">{tx.description}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          tx.type === "credit"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {tx.type}
                      </span>
                    </td>
                    <td
                      className={`py-4 px-6 font-mono text-sm font-semibold ${
                        tx.type === "credit" ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {tx.type === "credit" ? "+" : ""}${Math.abs(tx.amount || 0).toLocaleString()}
                    </td>
                    <td className="py-4 px-6 text-white font-mono text-sm">
                      ${tx.balanceAfter?.toLocaleString() || "N/A"}
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
