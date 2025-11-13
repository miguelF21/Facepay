import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import {
  Clock,
  Calendar,
  CheckCircle,
  XCircle,
  Loader2,
  Download,
  Filter,
  Search
} from 'lucide-react';
import { getAttendanceRecords } from '../services/employeeService';

const Attendance = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState('');
  const [searchEmployee, setSearchEmployee] = useState('');

  useEffect(() => {
    loadAttendance();
  }, []);

  const loadAttendance = async () => {
    try {
      setLoading(true);
      const data = await getAttendanceRecords();
      setAttendanceRecords(data);
    } catch (error) {
      console.error('Error loading attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRecords = attendanceRecords.filter(record => {
    const matchesDate = !filterDate || record.date === filterDate;
    const matchesEmployee = !searchEmployee || 
      (record.employee?.first_name?.toLowerCase().includes(searchEmployee.toLowerCase()) ||
       record.employee?.last_name?.toLowerCase().includes(searchEmployee.toLowerCase()) ||
       record.employee?.employee_code?.toLowerCase().includes(searchEmployee.toLowerCase()));
    return matchesDate && matchesEmployee;
  });

  const formatTime = (time) => {
    if (!time) return '--:--';
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (date) => {
    if (!date) return '--';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const calculateHours = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return '--';
    const start = new Date(`2000-01-01T${checkIn}`);
    const end = new Date(`2000-01-01T${checkOut}`);
    const diff = (end - start) / (1000 * 60 * 60);
    return diff.toFixed(2);
  };

  const todayRecords = attendanceRecords.filter(
    r => r.date === new Date().toISOString().split('T')[0]
  );
  
  const presentToday = todayRecords.filter(r => r.status).length;
  const totalEmployees = new Set(attendanceRecords.map(r => r.employee_id)).size;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
                <Clock className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Attendance Tracking
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  Monitor employee check-ins and check-outs
                </p>
              </div>
            </div>
            <button
              onClick={loadAttendance}
              className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              <Download className="w-5 h-5" />
              Export Report
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border border-emerald-100 dark:border-emerald-900/30 bg-gradient-to-br from-white to-emerald-50 dark:from-slate-800 dark:to-emerald-900/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Present Today</p>
                      <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                        {presentToday}
                      </p>
                    </div>
                    <CheckCircle className="w-12 h-12 text-emerald-500 opacity-20" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border border-blue-100 dark:border-blue-900/30 bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-blue-900/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Employees</p>
                      <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                        {totalEmployees}
                      </p>
                    </div>
                    <Clock className="w-12 h-12 text-blue-500 opacity-20" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border border-amber-100 dark:border-amber-900/30 bg-gradient-to-br from-white to-amber-50 dark:from-slate-800 dark:to-amber-900/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Attendance Rate</p>
                      <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                        {totalEmployees > 0 ? Math.round((presentToday / totalEmployees) * 100) : 0}%
                      </p>
                    </div>
                    <Calendar className="w-12 h-12 text-amber-500 opacity-20" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by employee name or code..."
                value={searchEmployee}
                onChange={(e) => setSearchEmployee(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>
        </motion.div>

        {/* Attendance Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border border-slate-200 dark:border-slate-700 shadow-lg">
            <CardHeader className="border-b border-slate-100 dark:border-slate-700">
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-xl">
                  <Clock className="w-6 h-6 text-emerald-600" />
                  Attendance Records
                </span>
                <span className="text-sm font-normal text-slate-500 dark:text-slate-400">
                  {filteredRecords.length} records
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mb-4" />
                  <p className="text-slate-600 dark:text-slate-400">Loading attendance records...</p>
                </div>
              ) : filteredRecords.length === 0 ? (
                <div className="text-center py-12">
                  <Clock className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                  <p className="text-xl text-slate-600 dark:text-slate-400">
                    No attendance records found
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 dark:bg-slate-800/50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                          Employee
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                          Check In
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                          Check Out
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                          Hours
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                      {filteredRecords.map((record, index) => (
                        <motion.tr
                          key={record.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                {record.employee?.first_name} {record.employee?.last_name}
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                {record.employee?.employee_code}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                            {formatDate(record.date)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                              {formatTime(record.check_in)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-medium text-red-600 dark:text-red-400">
                              {formatTime(record.check_out)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-800 dark:text-slate-200">
                            {calculateHours(record.check_in, record.check_out)} hrs
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {record.status ? (
                              <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-xs font-medium">
                                <CheckCircle className="w-3 h-3" />
                                Present
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-xs font-medium">
                                <XCircle className="w-3 h-3" />
                                Absent
                              </span>
                            )}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Attendance;
