import { useState, useEffect } from 'react';
import { 
  getDashboardStats, 
  getAttendanceRecords 
} from '../services/employeeService';
import { connectRealtime } from '../services/realtimeService';

function Dashboard() {
  const [stats, setStats] = useState({
    total_employees: 0,
    today_attendance: 0,
    present_now: 0,
    absent_today: 0
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

      const statsResponse = await getDashboardStats();
      const today = new Date().toISOString().split('T')[0];
      const attendanceResponse = await getAttendanceRecords({
        date_from: today,
        date_to: today
      });

      setStats(statsResponse.data || {
        total_employees: 0,
        today_attendance: 0,
        present_now: 0,
        absent_today: 0
      });
      
      let attendanceArray = [];
      if (attendanceResponse.data) {
        attendanceArray = Array.isArray(attendanceResponse.data) 
          ? attendanceResponse.data 
          : Object.values(attendanceResponse.data);
      }
      
      setRecentAttendance(attendanceArray.slice(0, 5));

    } catch (err) {
      console.error('Dashboard error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 border-l-4 border-red-500">
            <div className="flex items-center mb-4">
              <svg className="w-8 h-8 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <h3 className="text-2xl font-bold text-gray-900">Error Loading Dashboard</h3>
            </div>
            <p className="text-gray-600 mb-6">{error}</p>
            <button 
              onClick={loadDashboard}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-gray-600 mt-2">Real-time overview of your workforce</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setLiveUpdates(!liveUpdates)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                liveUpdates 
                  ? 'bg-green-500 text-white shadow-lg' 
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
            >
              {liveUpdates ? 'Live Updates ON' : 'Live Updates OFF'}
            </button>
            <button 
              onClick={loadDashboard}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Refresh
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Employees"
            value={stats.total_employees || 0}
            icon="users"
            color="blue"
            trend="+5%"
          />
          <StatCard
            title="Today's Attendance"
            value={stats.today_attendance || 0}
            icon="check"
            color="green"
            trend="+12%"
          />
          <StatCard
            title="Currently Present"
            value={stats.present_now || 0}
            icon="clock"
            color="purple"
            trend="Live"
          />
          <StatCard
            title="Absent Today"
            value={stats.absent_today || 0}
            icon="alert"
            color="red"
            trend="-3%"
          />
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 backdrop-blur-lg bg-opacity-90">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Recent Attendance
            </h2>
            <span className="text-sm text-gray-500">Last 5 records</span>
          </div>
          
          {recentAttendance.length === 0 ? (
            <div className="text-center py-16">
              <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <p className="text-gray-500 text-lg">No attendance records today</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Employee
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Check In
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Check Out
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Hours
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentAttendance.map((record, index) => (
                    <tr key={record._id || index} className="hover:bg-blue-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
                            {(record.employee_name || 'N').charAt(0)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-bold text-gray-900">
                              {record.employee_name || 'N/A'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {record.employee_id || ''}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatTime(record.check_in)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatTime(record.check_out)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-indigo-600">
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

function StatCard({ title, value, icon, color, trend }) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-emerald-600',
    purple: 'from-purple-500 to-indigo-600',
    red: 'from-red-500 to-rose-600'
  };

  const iconMap = {
    users: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>,
    check: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>,
    clock: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>,
    alert: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]} text-white shadow-lg`}>
          {iconMap[icon]}
        </div>
        <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">
          {trend}
        </span>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-1">
          {title}
        </p>
        <p className="text-4xl font-bold text-gray-900">
          {value}
        </p>
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

  const { label, className } = config[status] || { label: 'Unknown', className: 'bg-gray-100 text-gray-800' };

  return (
    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${className}`}>
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
