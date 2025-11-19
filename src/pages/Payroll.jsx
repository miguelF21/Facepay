import { useState, useEffect } from 'react';
import { getPayrollRecords, calculatePayroll } from '../services/employeeService';

function Payroll() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [calculating, setCalculating] = useState(false);

  useEffect(() => {
    const currentPeriod = getCurrentPeriod();
    setSelectedPeriod(currentPeriod);
    loadPayroll(currentPeriod);
  }, []);

  function getCurrentPeriod() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  }

  async function loadPayroll(period) {
    try {
      setLoading(true);
      setError(null);

      const response = await getPayrollRecords({ period });

      if (response.error) {
        throw new Error(response.error);
      }

      let recordsArray = [];
      if (response.data) {
        recordsArray = Array.isArray(response.data) 
          ? response.data 
          : Object.values(response.data);
      }

      setRecords(recordsArray);

    } catch (err) {
      console.error('Error loading payroll:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCalculatePayroll() {
    if (!confirm(`Calculate payroll for ${selectedPeriod}?`)) return;
    
    try {
      setCalculating(true);
      const response = await calculatePayroll(selectedPeriod);
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      alert(response.message || 'Payroll calculated successfully');
      loadPayroll(selectedPeriod);
    } catch (err) {
      alert('Error calculating payroll: ' + err.message);
    } finally {
      setCalculating(false);
    }
  }

  function handlePeriodChange(e) {
    const newPeriod = e.target.value;
    setSelectedPeriod(newPeriod);
    loadPayroll(newPeriod);
  }

  const totalGross = records.reduce((sum, r) => sum + (r.gross_salary || 0), 0);
  const totalDeductions = records.reduce((sum, r) => sum + (r.total_deductions || 0), 0);
  const totalNet = records.reduce((sum, r) => sum + (r.net_salary || 0), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading Payroll...</p>
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
              Payroll Management
            </h1>
            <p className="text-gray-600 mt-2">Manage employee salaries and payments</p>
          </div>
          <div className="flex items-center gap-4">
            <input
              type="month"
              value={selectedPeriod}
              onChange={handlePeriodChange}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-medium"
            />
            <button 
              onClick={handleCalculatePayroll}
              disabled={calculating}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-emerald-700 transform hover:scale-105 transition-all duration-200 shadow-lg disabled:opacity-50"
            >
              {calculating ? 'Calculating...' : 'Calculate Payroll'}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 mb-6">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                Total
              </span>
            </div>
            <p className="text-sm font-medium text-gray-600 uppercase mb-1">Gross Salary</p>
            <p className="text-3xl font-bold text-gray-900">${totalGross.toLocaleString('en-US')}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-lg">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path>
                </svg>
              </div>
              <span className="text-xs font-semibold text-red-600 bg-red-100 px-2 py-1 rounded-full">
                Deducted
              </span>
            </div>
            <p className="text-sm font-medium text-gray-600 uppercase mb-1">Total Deductions</p>
            <p className="text-3xl font-bold text-red-600">${totalDeductions.toLocaleString('en-US')}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                Net
              </span>
            </div>
            <p className="text-sm font-medium text-gray-600 uppercase mb-1">Net Salary</p>
            <p className="text-3xl font-bold text-green-600">${totalNet.toLocaleString('en-US')}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Payroll Records</h2>

          {records.length === 0 ? (
            <div className="text-center py-16">
              <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
              </svg>
              <p className="text-gray-500 text-lg mb-4">No payroll records for this period</p>
              <button
                onClick={handleCalculatePayroll}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all"
              >
                Calculate Payroll Now
              </button>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-gray-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Employee</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Base Salary</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Days</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Hours</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Deductions</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Net Salary</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {records.map((record, index) => (
                      <tr key={record._id || index} className="hover:bg-blue-50 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
                              {(record.employee_name || 'N').charAt(0)}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-bold text-gray-900">{record.employee_name || 'N/A'}</div>
                              <div className="text-sm text-gray-500">{record.employee_id || ''}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          ${(record.base_salary || 0).toLocaleString('en-US')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.worked_days || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {(record.worked_hours || 0).toFixed(1)}h
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-red-600">
                          ${(record.total_deductions || 0).toLocaleString('en-US')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                          ${(record.net_salary || 0).toLocaleString('en-US')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${
                            record.status === 'paid' 
                              ? 'bg-green-100 text-green-800 border border-green-200' 
                              : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                          }`}>
                            {record.status === 'paid' ? 'Paid' : 'Calculated'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Payroll;
