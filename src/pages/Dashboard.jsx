import { useState, useEffect } from 'react';
import { 
  getDashboardStats, 
  getAttendanceRecords,
  getAllEmployees
} from '../services/employeeService';
import { connectRealtime } from '../services/realtimeService';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

function Dashboard() {
  const [stats, setStats] = useState({
    total_employees: 0,
    today_attendance: 0,
    present_now: 0,
    absent_today: 0
  });
  
  const [chartData, setChartData] = useState({
    weeklyTrend: [],
    departmentStats: [],
    attendanceRate: []
  });
  
  const [recentAttendance, setRecentAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liveUpdates, setLiveUpdates] = useState(true);

  useEffect(() => {
    loadDashboard();
    
    let disconnectFn = null;
    
    if (liveUpdates) {
      connectRealtime((event) => {
        if (event?.type === 'attendance_created' || event?.type === 'attendance_updated') {
          loadDashboard();
        }
      }).then(fn => {
        disconnectFn = fn;
      }).catch(err => {
        console.warn('Realtime connection failed:', err);
      });
    }
    
    return () => {
      if (disconnectFn && typeof disconnectFn === 'function') {
        disconnectFn();
      }
    };
  }, [liveUpdates]);

  async function loadDashboard() {
    try {
      setLoading(true);
      setError(null);

      const today = new Date().toISOString().split('T')[0];
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      const [statsResponse, attendanceResponse, employeesResponse, weekAttendanceResponse] = await Promise.all([
        getDashboardStats(),
        getAttendanceRecords({ date_from: today, date_to: today }),
        getAllEmployees(),
        getAttendanceRecords({ 
          date_from: weekAgo.toISOString().split('T')[0], 
          date_to: today 
        })
      ]);

      setStats(statsResponse.data || {
        total_employees: 0,
        today_attendance: 0,
        present_now: 0,
        absent_today: 0
      });
      
      const attendanceArray = Array.isArray(attendanceResponse.data) 
        ? attendanceResponse.data 
        : [];
      
      setRecentAttendance(attendanceArray.slice(0, 5));

      const employees = Array.isArray(employeesResponse.data) ? employeesResponse.data : [];
      const weekAttendance = Array.isArray(weekAttendanceResponse.data) ? weekAttendanceResponse.data : [];

      // Process chart data
      processChartData(employees, weekAttendance, today);

    } catch (err) {
      console.error('Dashboard error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function processChartData(employees, weekAttendance, today) {
    // Weekly trend (last 7 days)
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      
      const dayAttendance = weekAttendance.filter(att => att.date === dateStr).length;
      
      last7Days.push({
        day: dayName,
        attendance: dayAttendance,
        date: dateStr
      });
    }

    // Department stats
    const deptCount = {};
    employees.forEach(emp => {
      const dept = emp.department || 'Unassigned';
      deptCount[dept] = (deptCount[dept] || 0) + 1;
    });

    const departmentData = Object.entries(deptCount).map(([name, value]) => ({
      name,
      value
    }));

    // Attendance rate (present vs absent)
    const attendanceRate = [
      { name: 'Present', value: stats.present_now || 0 },
      { name: 'Absent', value: stats.absent_today || 0 }
    ];

    setChartData({
      weeklyTrend: last7Days,
      departmentStats: departmentData,
      attendanceRate: attendanceRate
    });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 font-semibold text-lg">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl p-8 border-l-4 border-red-500">
            <div className="flex items-center mb-4">
              <svg className="w-8 h-8 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <h3 className="text-2xl font-bold text-slate-900">Error Loading Dashboard</h3>
            </div>
            <p className="text-slate-600 mb-6">{error}</p>
            <button 
              onClick={loadDashboard}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const attendancePercentage = stats.total_employees > 0 
    ? ((stats.today_attendance / stats.total_employees) * 100).toFixed(1)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              Dashboard
            </h1>
            <p className="text-slate-600 text-lg">Real-time workforce analytics and insights</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setLiveUpdates(!liveUpdates)}
              className={`px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 shadow-md ${
                liveUpdates 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-green-200' 
                  : 'bg-white text-slate-700 border-2 border-slate-200 hover:border-slate-300'
              }`}
            >
              <span className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${liveUpdates ? 'bg-white animate-pulse' : 'bg-slate-400'}`}></span>
                {liveUpdates ? 'Live' : 'Offline'}
              </span>
            </button>
            <button 
              onClick={loadDashboard}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 shadow-md"
            >
              <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Refresh
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Employees"
            value={stats.total_employees || 0}
            icon="users"
            color="from-blue-500 to-blue-600"
            bgColor="bg-blue-50"
            textColor="text-blue-600"
          />
          <StatCard
            title="Today's Check-ins"
            value={stats.today_attendance || 0}
            subtitle={`${attendancePercentage}% attendance`}
            icon="check"
            color="from-green-500 to-emerald-600"
            bgColor="bg-green-50"
            textColor="text-green-600"
          />
          <StatCard
            title="Currently Present"
            value={stats.present_now || 0}
            subtitle="Active now"
            icon="clock"
            color="from-purple-500 to-indigo-600"
            bgColor="bg-purple-50"
            textColor="text-purple-600"
          />
          <StatCard
            title="Absent Today"
            value={stats.absent_today || 0}
            icon="alert"
            color="from-red-500 to-rose-600"
            bgColor="bg-red-50"
            textColor="text-red-600"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Weekly Attendance Trend */}
          <div className="bg-white rounded-3xl shadow-lg p-6 border border-slate-100">
            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
              Weekly Attendance Trend
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData.weeklyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="day" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="attendance" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Attendance Distribution */}
          <div className="bg-white rounded-3xl shadow-lg p-6 border border-slate-100">
            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path>
              </svg>
              Today's Status
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={chartData.attendanceRate}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.attendanceRate.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : '#ef4444'} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Stats */}
        {chartData.departmentStats.length > 0 && (
          <div className="bg-white rounded-3xl shadow-lg p-6 mb-8 border border-slate-100">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
              Employees by Department
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData.departmentStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                />
                <Bar dataKey="value" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Recent Attendance Table */}
        <div className="bg-white rounded-3xl shadow-lg p-6 border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Recent Activity
            </h3>
            <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full font-medium">
              Last 5 records
            </span>
          </div>
          
          {recentAttendance.length === 0 ? (
            <div className="text-center py-16">
              <svg className="w-24 h-24 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <p className="text-slate-500 text-lg font-medium">No attendance records today</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Employee
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Check In
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Check Out
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Hours
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100">
                  {recentAttendance.map((record, index) => (
                    <tr key={record._id || index} className="hover:bg-blue-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                            {(record.employee_name || 'N').charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-bold text-slate-900">
                              {record.employee_name || 'N/A'}
                            </div>
                            <div className="text-sm text-slate-500">
                              {record.employee_id || ''}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-slate-900">
                          {formatTime(record.check_in)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-slate-900">
                          {formatTime(record.check_out)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-indigo-600">
                          {formatHours(record.hours_worked)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={record.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, subtitle, icon, color, bgColor, textColor }) {
  const iconMap = {
    users: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>,
    check: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>,
    clock: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>,
    alert: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300 hover:shadow-xl border border-slate-100">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-4 rounded-2xl bg-gradient-to-br ${color} ${bgColor} shadow-md`}>
          <svg className={`w-8 h-8 ${textColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {iconMap[icon]}
          </svg>
        </div>
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-2">
          {title}
        </p>
        <p className="text-4xl font-bold text-slate-900 mb-1">
          {value}
        </p>
        {subtitle && (
          <p className="text-sm text-slate-500 font-medium">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const config = {
    complete: {
      label: 'Complete',
      className: 'bg-green-100 text-green-800 border border-green-200'
    },
    incomplete: {
      label: 'In Progress',
      className: 'bg-yellow-100 text-yellow-800 border border-yellow-200'
    }
  };

  const { label, className } = config[status] || { label: 'Unknown', className: 'bg-slate-100 text-slate-800' };

  return (
    <span className={`px-4 py-1.5 inline-flex text-xs leading-5 font-bold rounded-full ${className}`}>
      {label}
    </span>
  );
}

function formatTime(isoString) {
  if (!isoString) return '-';
  try {
    return new Date(isoString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return '-';
  }
}

function formatHours(hours) {
  if (!hours && hours !== 0) return '-';
  return Number(hours).toFixed(2) + 'h';
}

export default Dashboard;
