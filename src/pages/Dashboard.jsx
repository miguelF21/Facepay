import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Users, Briefcase, DollarSign, Clock, RefreshCw } from "lucide-react";
import {
  getDashboardStats,
  getAttendanceRecords
} from "../services/employeeService";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalDepartments: 0,
    totalPayroll: 0,
    presentToday: 0,
    attendanceRate: 0
  });
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const s = await getDashboardStats();
      const attendance = await getAttendanceRecords();

      setStats(s);

      // Chart data – last 7 days
      const last7 = attendance.slice(0, 7);
      const chartData = last7.reduce((acc, record) => {
        const date = new Date(record.date);
        const label = date.toLocaleDateString(undefined, { weekday: "short" });
        const found = acc.find((d) => d.day === label);
        if (found) {
          found.count += 1;
        } else {
          acc.push({ day: label, count: 1 });
        }
        return acc;
      }, []);
      setAttendanceData(chartData);
    } catch (err) {
      console.error("Dashboard error", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-10">
        <RefreshCw className="w-10 h-10 animate-spin text-blue-600" />
        <p className="mt-4 text-slate-500 dark:text-slate-400">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="p-6 grid gap-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
          Control Panel
        </h1>
        <button
          onClick={loadDashboard}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 shadow-lg"
        >
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          title="Employees"
          value={stats.totalEmployees}
          color="from-blue-500 to-sky-500"
        />
        <StatCard
          icon={Briefcase}
          title="Departments"
          value={stats.totalDepartments}
          color="from-emerald-500 to-teal-500"
        />
        <StatCard
          icon={DollarSign}
          title="Total Payroll"
          value={`$${stats.totalPayroll.toLocaleString()}`}
          color="from-amber-500 to-orange-500"
        />
        <StatCard
          icon={Clock}
          title="Attendance Rate"
          value={`${stats.attendanceRate}%`}
          color="from-rose-500 to-pink-500"
        />
      </div>

      {/* Attendance chart */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="shadow-md border border-slate-100 dark:border-slate-700">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-200">
              Attendance (last 7 days)
            </h2>
            {attendanceData.length === 0 ? (
              <div className="text-center py-16 text-slate-500 dark:text-slate-400">
                No attendance data
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={attendanceData} barSize={32}>
                  <XAxis dataKey="day" axisLine={false} tick={{ fill: "#94a3b8" }} />
                  <YAxis
                    allowDecimals={false}
                    axisLine={false}
                    tick={{ fill: "#94a3b8" }}
                  />
                  <Tooltip wrapperClassName="shadow-lg rounded-xl" />
                  <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

function StatCard({ icon: Icon, title, value, color }) {
  return (
    <motion.div whileHover={{ scale: 1.03 }}>
      <Card
        className={`shadow-md border border-slate-100 dark:border-slate-700 bg-gradient-to-br ${color} text-white`}
      >
        <CardContent className="p-5 flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-lg">
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm opacity-80">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
