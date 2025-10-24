import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { Briefcase, Users, DollarSign, Clock } from "lucide-react";
import { getDashboardStats, getAttendanceRecords } from "../services/employeeService";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalDepartments: 0,
    totalPayroll: 0
  });
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const dashboardStats = await getDashboardStats();
      const attendance = await getAttendanceRecords();

      setStats(dashboardStats);

      const recentAttendance = attendance.slice(0, 7);
      const chartData = recentAttendance.reduce((acc, record) => {
        const date = new Date(record.fecha).toLocaleDateString('en-US', { weekday: 'short' });
        const existing = acc.find(item => item.day === date);
        if (existing) {
          existing.count += 1;
        } else {
          acc.push({ day: date, count: 1 });
        }
        return acc;
      }, []);

      setAttendanceData(chartData);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-2 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 grid gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Control Panel</h1>
        <button
          onClick={loadDashboardData}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
        >
          Refresh Data
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-4 shadow-md rounded-2xl border border-blue-100 bg-gradient-to-br from-white to-blue-50">
            <CardContent className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Users className="text-blue-600 w-6 h-6" />
              </div>
              <div>
                <h2 className="text-sm text-gray-600">Total Employees</h2>
                <p className="text-2xl font-bold text-gray-900">{stats.totalEmployees}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-4 shadow-md rounded-2xl border border-green-100 bg-gradient-to-br from-white to-green-50">
            <CardContent className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <Briefcase className="text-green-600 w-6 h-6" />
              </div>
              <div>
                <h2 className="text-sm text-gray-600">Departments</h2>
                <p className="text-2xl font-bold text-gray-900">{stats.totalDepartments}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-4 shadow-md rounded-2xl border border-emerald-100 bg-gradient-to-br from-white to-emerald-50">
            <CardContent className="flex items-center gap-4">
              <div className="p-3 bg-emerald-100 rounded-xl">
                <DollarSign className="text-emerald-600 w-6 h-6" />
              </div>
              <div>
                <h2 className="text-sm text-gray-600">Total Payroll</h2>
                <p className="text-2xl font-bold text-gray-900">${stats.totalPayroll.toLocaleString("en-US")}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        className="mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="p-6 shadow-md rounded-2xl border border-gray-100">
          <h2 className="text-xl font-bold mb-4 text-gray-900">Recent Attendance Activity</h2>
          {attendanceData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={attendanceData}>
                <XAxis
                  dataKey="day"
                  tick={{ fill: '#6b7280' }}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fill: '#6b7280' }}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Bar
                  dataKey="count"
                  fill="#3b82f6"
                  radius={[8, 8, 0, 0]}
                  label={{ position: 'top', fill: '#3b82f6' }}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              <div className="text-center">
                <Clock className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p>No attendance records yet</p>
              </div>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
};

export default Dashboard;