import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Loader2,
  Download,
  Eye,
  Filter,
  Calendar
} from 'lucide-react';
import { getPayrollRecords } from '../services/employeeService';

const Payroll = () => {
  const [payrollRecords, setPayrollRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterMonth, setFilterMonth] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    loadPayroll();
  }, []);

  const loadPayroll = async () => {
    try {
      setLoading(true);
      const data = await getPayrollRecords();
      setPayrollRecords(data);
    } catch (error) {
      console.error('Error loading payroll:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRecords = payrollRecords.filter(record => {
    if (!filterMonth) return true;
    const recordDate = new Date(record.period_start);
    const filterDate = new Date(filterMonth);
    return recordDate.getMonth() === filterDate.getMonth() && 
           recordDate.getFullYear() === filterDate.getFullYear();
  });

  const totalGrossPay = filteredRecords.reduce((sum, r) => sum + parseFloat(r.gross_salary || 0), 0);
  const totalDeductions = filteredRecords.reduce((sum, r) => sum + parseFloat(r.deductions || 0), 0);
  const totalNetPay = filteredRecords.reduce((sum, r) => sum + parseFloat(r.net_salary || 0), 0);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const formatDate = (date) => {
    if (!date) return '--';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

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
              <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-xl">
                <DollarSign className="w-8 h-8 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                  Payroll Management
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  Manage employee compensation and payments
                </p>
              </div>
            </div>
            <button
              className="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl font-semibold hover:from-amber-700 hover:to-orange-700 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              <Download className="w-5 h-5" />
              Export Payroll
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border border-blue-100 dark:border-blue-900/30 bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-blue-900/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Gross Pay</p>
                      <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                        {formatCurrency(totalGrossPay)}
                      </p>
                    </div>
                    <TrendingUp className="w-12 h-12 text-blue-500 opacity-20" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border border-red-100 dark:border-red-900/30 bg-gradient-to-br from-white to-red-50 dark:from-slate-800 dark:to-red-900/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Deductions</p>
                      <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                        {formatCurrency(totalDeductions)}
                      </p>
                    </div>
                    <TrendingDown className="w-12 h-12 text-red-500 opacity-20" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border border-emerald-100 dark:border-emerald-900/30 bg-gradient-to-br from-white to-emerald-50 dark:from-slate-800 dark:to-emerald-900/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Net Pay</p>
                      <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(totalNetPay)}
                      </p>
                    </div>
                    <DollarSign className="w-12 h-12 text-emerald-500 opacity-20" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Filter */}
          <div className="relative max-w-md">
            <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="month"
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
        </motion.div>

        {/* Payroll Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border border-slate-200 dark:border-slate-700 shadow-lg">
            <CardHeader className="border-b border-slate-100 dark:border-slate-700">
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-xl">
                  <DollarSign className="w-6 h-6 text-amber-600" />
                  Payroll Records
                </span>
                <span className="text-sm font-normal text-slate-500 dark:text-slate-400">
                  {filteredRecords.length} records
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="w-12 h-12 text-amber-600 animate-spin mb-4" />
                  <p className="text-slate-600 dark:text-slate-400">Loading payroll records...</p>
                </div>
              ) : filteredRecords.length === 0 ? (
                <div className="text-center py-12">
                  <DollarSign className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                  <p className="text-xl text-slate-600 dark:text-slate-400">
                    No payroll records found
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
                          Period
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                          Gross Salary
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                          Deductions
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                          Net Salary
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                          Actions
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
                                {record.employee?.employee_code} • {record.employee?.position}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                            <div>
                              <p>{formatDate(record.period_start)}</p>
                              <p className="text-xs">to {formatDate(record.period_end)}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                              {formatCurrency(record.gross_salary)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                              -{formatCurrency(record.deductions)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                              {formatCurrency(record.net_salary)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => setSelectedRecord(record)}
                              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg text-xs font-medium hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                            >
                              <Eye className="w-3 h-3" />
                              Details
                            </button>
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

        {/* Detail Modal */}
        {selectedRecord && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedRecord(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-2xl w-full shadow-2xl"
            >
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-6">
                Payroll Details
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Employee</p>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      {selectedRecord.employee?.first_name} {selectedRecord.employee?.last_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Department</p>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      {selectedRecord.employee?.department}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Period Start</p>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      {formatDate(selectedRecord.period_start)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Period End</p>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      {formatDate(selectedRecord.period_end)}
                    </p>
                  </div>
                </div>
                <div className="border-t border-slate-200 dark:border-slate-700 pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Gross Salary</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">
                      {formatCurrency(selectedRecord.gross_salary)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Deductions</span>
                    <span className="font-bold text-red-600 dark:text-red-400">
                      -{formatCurrency(selectedRecord.deductions)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
                    <span className="text-lg font-semibold text-slate-800 dark:text-slate-200">Net Salary</span>
                    <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(selectedRecord.net_salary)}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="mt-6 w-full px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Payroll;
