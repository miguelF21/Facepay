import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { DollarSign, Loader2, Search } from "lucide-react";
import { getPayrollRecords } from "../services/employeeService";

export default function Payroll() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadPayroll();
  }, []);

  const loadPayroll = async () => {
    setLoading(true);
    try {
      const data = await getPayrollRecords();
      setRecords(data);
    } catch (err) {
      console.error("Payroll error", err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = records.filter((r) => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    return (
      r.employee?.first_name?.toLowerCase().includes(term) ||
      r.employee?.last_name?.toLowerCase().includes(term) ||
      r.employee?.employee_code?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="p-6 max-w-7xl mx-auto grid gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
          Payroll
        </h1>
        <input
          type="text"
          placeholder="Search employee..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-sm w-60"
        />
      </div>

      <Card className="shadow-md border border-slate-100 dark:border-slate-700">
        <CardHeader className="border-b border-slate-100 dark:border-slate-700">
          <CardTitle className="flex items-center gap-2 text-xl">
            <DollarSign className="w-5 h-5 text-amber-600" /> Payroll Records
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-amber-600" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-slate-500 dark:text-slate-400">
              No payroll records found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/50">
                  <tr>
                    {[
                      "Employee",
                      "Period",
                      "Gross",
                      "Deductions",
                      "Net"
                    ].map((h) => (
                      <th key={h} className="px-6 py-3 text-left font-medium text-slate-500 dark:text-slate-400">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {filtered.map((r) => (
                    <motion.tr key={r.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <td className="px-6 py-3 whitespace-nowrap">
                        <span className="font-medium text-slate-700 dark:text-slate-200">
                          {r.employee?.first_name} {r.employee?.last_name}
                        </span>
                        <span className="block text-xs text-slate-500 dark:text-slate-400">
                          {r.employee?.employee_code}
                        </span>
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-slate-600 dark:text-slate-400">
                        {r.period_start} → {r.period_end}
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap font-medium text-amber-600 dark:text-amber-400">
                        ${parseFloat(r.gross_salary).toLocaleString()}
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-red-500">
                        -${parseFloat(r.deductions).toLocaleString()}
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap font-semibold text-emerald-600 dark:text-emerald-400">
                        ${parseFloat(r.net_salary).toLocaleString()}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
