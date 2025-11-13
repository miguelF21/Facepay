import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { motion } from "framer-motion";
import { Briefcase, Users, DollarSign, Clock, TrendingUp, Activity, RefreshCw } from "lucide-react";
import { getDashboardStats, getAttendanceRecords } from "../services/employeeService";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalDepartments: 0,
    totalPayroll: 0,
    todayAttendance: 0
  });
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const dashboardStats = await getDashboardStats();
      const attendance = await getAttendanceRecords();

      setStats(dashboardStats);

      // Process attendance data for chart (last 7 days)
      const recentAttendance = attendance.slice(0, 7);
      const chartData = recentAttendance.reduce((acc, record) => {
        const date = new Date(record.date).toLocaleDateString('en-US', { weekday: 'short' });
        const existing = acc.find(item => item.day === date);
        if (existing) {
          existing.count += 1;
        } else {
          acc.push({ day: date, count: 1 });
        }
        return acc;
      }, []);

      setAttendanceData(chartData.reverse());
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#3b82f6', '#06b6d4', '#10b981', '#f59e0b'];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent mb-4"></div>
          <p className="text-xl text-slate-600 dark:text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <Activity className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  Dashboard
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  Overview of your business metrics
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs text-slate-500 dark:text-slate-400">Last updated</p>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {lastUpdate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <button
                onClick={loadDashboardData}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 text-sm font-medium flex items-center gap-2 shadow-lg hover:shadow-xl"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border border-blue-100 dark:border-blue-900/30 bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-blue-900/10 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                    <Users className="text-blue-600 dark:text-blue-400 w-6 h-6" />
                  </div>
                  <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Employees</h2>
                <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">{stats.totalEmployees}</p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2">Active workforce</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border border-emerald-100 dark:border-emerald-900/30 bg-gradient-to-br from-white to-emerald-50 dark:from-slate-800 dark:to-emerald-900/10 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
                    <Briefcase className="text-emerald-600 dark:text-emerald-400 w-6 h-6" />
                  </div>
                  <Activity className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h2 className="text-sm text-slate-600 dark:text-slate-400 mb-1">Departments</h2>
                <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">{stats.totalDepartments}</p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2">Active divisions</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border border-amber-100 dark:border-amber-900/30 bg-gradient-to-br from-white to-amber-50 dark:from-slate-800 dark:to-amber-900/10 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-xl">
                    <DollarSign className="text-amber-600 dark:text-amber-400 w-6 h-6" />
                  </div>
                  <TrendingUp className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <h2 className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Payroll</h2>
                <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                  ${stats.totalPayroll.toLocaleString("en-US")}
                </p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2">Monthly expenses</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border border-cyan-100 dark:border-cyan-900/30 bg-gradient-to-br from-white to-cyan-50 dark:from-slate-800 dark:to-cyan-900/10 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-cyan-100 dark:bg-cyan-900/30 rounded-xl">
                    <Clock className="text-cyan-600 dark:text-cyan-400 w-6 h-6" />
                  </div>
                  <Activity className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                </div>
                <h2 className="text-sm text-slate-600 dark:text-slate-400 mb-1">Today's Attendance</h2>
                <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">{stats.todayAttendance}</p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2">
                  {stats.totalEmployees > 0 ? Math.round((stats.todayAttendance / stats.totalEmployees) * 100) : 0}% present
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Attendance Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="border border-slate-200 dark:border-slate-700 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Weekly Attendance</h2>
                  <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                {attendanceData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={attendanceData}>
                      <XAxis
                        dataKey="day"
                        tick={{ fill: '#64748b', fontSize: 12 }}
                        axisLine={{ stroke: '#e2e8f0' }}
                      />
                      <YAxis
                        allowDecimals={false}
                        tick={{ fill: '#64748b', fontSize: 12 }}
                        axisLine={{ stroke: '#e2e8f0' }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e2e8f0',
                          borderRadius: '12px',
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                        }}
                      />
                      <Bar
                        dataKey="count"
                        fill="url(#colorGradient)"
                        radius={[8, 8, 0, 0]}
                        label={{ position: 'top', fill: '#3b82f6', fontSize: 12, fontWeight: 600 }}
                      />
                      <defs>
                        <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
                          <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.6} />
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-64 text-slate-500 dark:text-slate-400">
                    <div className="text-center">
                      <Clock className="w-12 h-12 mx-auto mb-3 text-slate-400 dark:text-slate-600" />
                      <p>No attendance data available</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="border border-slate-200 dark:border-slate-700 shadow-lg">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6">Quick Actions</h2>
                <div className="space-y-3">
                  <button className="w-full flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl hover:from-blue-100 hover:to-cyan-100 dark:hover:from-blue-900/30 dark:hover:to-cyan-900/30 transition-all duration-200 group">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:scale-110 transition-transform">
                      <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-semibold text-slate-800 dark:text-slate-200">Manage Employees</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Add, edit or remove employees</p>
                    </div>
                  </button>

                  <button className="w-full flex items-center gap-4 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl hover:from-emerald-100 hover:to-teal-100 dark:hover:from-emerald-900/30 dark:hover:to-teal-900/30 transition-all duration-200 group">
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg group-hover:scale-110 transition-transform">
                      <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-semibold text-slate-800 dark:text-slate-200">View Attendance</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Check today's attendance records</p>
                    </div>
                  </button>

                  <button className="w-full flex items-center gap-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl hover:from-amber-100 hover:to-orange-100 dark:hover:from-amber-900/30 dark:hover:to-orange-900/30 transition-all duration-200 group">
                    <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg group-hover:scale-110 transition-transform">
                      <DollarSign className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-semibold text-slate-800 dark:text-slate-200">Process Payroll</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Manage employee payments</p>
                    </div>
                  </button>

                  <button className="w-full flex items-center gap-4 p-4 bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 rounded-xl hover:from-rose-100 hover:to-pink-100 dark:hover:from-rose-900/30 dark:hover:to-pink-900/30 transition-all duration-200 group">
                    <div className="p-2 bg-rose-100 dark:bg-rose-900/30 rounded-lg group-hover:scale-110 transition-transform">
                      <Activity className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-semibold text-slate-800 dark:text-slate-200">Generate Reports</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Create custom reports</p>
                    </div>
                  </button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
