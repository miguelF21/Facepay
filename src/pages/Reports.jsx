import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { FileText, Calendar, Loader2 } from "lucide-react";
import {
  getAttendanceReport,
  getPayrollReport
} from "../services/employeeService";

export default function Reports() {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [loading, setLoading] = useState(false);
  const [attendance, setAttendance] = useState([]);
  const [payroll, setPayroll] = useState([]);

  const generate = async () => {
    if (!start || !end) return;
    setLoading(true);
    try {
      const a = await getAttendanceReport(start, end);
      const p = await getPayrollReport(start, end);
      setAttendance(a);
      setPayroll(p);
    } catch (err) {
      console.error("Report error", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto grid gap-6">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
        Reports
      </h1>

      <div className="flex flex-wrap gap-4 items-end">
        <DateInput label="Start date" value={start} onChange={setStart} />
        <DateInput label="End date" value={end} onChange={setEnd} />
        <button
          onClick={generate}
          disabled={loading || !start || !end}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-lg disabled:opacity-50"
        >
          <FileText size={18} /> Generate
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-rose-500" />
        </div>
      ) : (
        <div className="grid gap-6">
          {/* Attendance */}
          <ReportCard title="Attendance Records" data={attendance} columns={["Employee", "Date", "Check In", "Check Out"]} renderRow={(r) => (
            <>
              <td className="px-4 py-3 text-sm whitespace-nowrap">
                {r.employee?.first_name} {r.employee?.last_name}
              </td>
              <td className="px-4 py-3 text-sm">{r.date}</td>
              <td className="px-4 py-3 text-sm text-emerald-600">{r.check_in}</td>
              <td className="px-4 py-3 text-sm text-red-600">{r.check_out}</td>
            </>
          )} />

          {/* Payroll */}
          <ReportCard title="Payroll Records" data={payroll} columns={["Employee", "Period", "Net Salary"]} renderRow={(r) => (
            <>
              <td className="px-4 py-3 text-sm whitespace-nowrap">
                {r.employee?.first_name} {r.employee?.last_name}
              </td>
              <td className="px-4 py-3 text-sm">{r.period_start} → {r.period_end}</td>
              <td className="px-4 py-3 text-sm font-medium text-emerald-600">
                ${parseFloat(r.net_salary).toLocaleString()}
              </td>
            </>
          )} />
        </div>
      )}
    </div>
  );
}

function DateInput({ label, value, onChange }) {
  return (
    <label className="flex flex-col text-sm text-slate-700 dark:text-slate-300">
      {label}
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800"
      />
    </label>
  );
}

function ReportCard({ title, data, columns, renderRow }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1 }}>
      <Card className="shadow-md border border-slate-100 dark:border-slate-700">
        <CardHeader className="border-b border-slate-100 dark:border-slate-700">
          <CardTitle className="flex items-center gap-2 text-xl">
            <FileText className="w-5 h-5 text-pink-600" /> {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {data.length === 0 ? (
            <div className="text-center py-12 text-slate-500 dark:text-slate-400">
              No data for selected range.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/50">
                  <tr>
                    {columns.map((c) => (
                      <th key={c} className="px-4 py-3 text-left font-medium text-slate-500 dark:text-slate-400">
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {data.map((r) => (
                    <motion.tr key={r.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      {renderRow(r)}
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
