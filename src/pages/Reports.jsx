// Reports.jsx
import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

function Reports() {
  const [startDate, setStartDate] = useState('2025-04-12');
  const [endDate, setEndDate] = useState('2025-04-13');
  const [isGenerating, setIsGenerating] = useState(false);
  const pdfRef = useRef(null);

  // Datos quemados de asistencia
  const attendanceData = [
    { name: 'Miguel Fuentes', type: 'Entry', time: '08:05 AM', date: '2025-04-12' },
    { name: 'Miguel Fuentes', type: 'Exit', time: '05:01 PM', date: '2025-04-12' },
    { name: 'Juan Pérez', type: 'Entry', time: '08:03 AM', date: '2025-04-12' },
    { name: 'Juan Pérez', type: 'Exit', time: '05:00 PM', date: '2025-04-12' },
    { name: 'Ana López', type: 'Entry', time: '08:10 AM', date: '2025-04-13' },
    { name: 'Ana López', type: 'Exit', time: '05:05 PM', date: '2025-04-13' },
    { name: 'Pedro García', type: 'Entry', time: '08:00 AM', date: '2025-04-13' },
    { name: 'Pedro García', type: 'Exit', time: '05:15 PM', date: '2025-04-13' },
  ];

  // Datos quemados de nómina
  const payrollData = [
    { name: 'Miguel Fuentes', hours: 76, payment: '$1,520' },
    { name: 'Juan Pérez', hours: 80, payment: '$2,000' },
    { name: 'Ana López', hours: 78, payment: '$1,600' },
    { name: 'Pedro García', hours: 70, payment: '$1,400' },
  ];

  // Procesar datos de asistencia para agrupar por empleado y fecha
  const processAttendanceData = () => {
    const processedData = {};
    
    attendanceData.forEach(record => {
      if (!processedData[record.name]) {
        processedData[record.name] = {};
      }
      
      if (!processedData[record.name][record.date]) {
        processedData[record.name][record.date] = {};
      }
      
      processedData[record.name][record.date][record.type] = record.time;
    });
    
    return processedData;
  };

  const processedAttendance = processAttendanceData();

  const handleGenerateReport = async () => {
    if (!startDate || !endDate) {
      alert('Please select a complete date range.');
      return;
    }

    setIsGenerating(true);
    
    try {
      const element = pdfRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#FFFFFF'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 10;
      
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`attendance_payroll_report_${startDate}_to_${endDate}.pdf`);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">
        Generate Reports
      </h1>

      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              />
            </div>
          </div>

          <button
            onClick={handleGenerateReport}
            disabled={isGenerating}
            className={`w-full py-3 px-6 rounded-lg font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 ${
              isGenerating 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white hover:shadow-lg transform hover:scale-[1.02]'
            }`}
          >
            {isGenerating ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating PDF...
              </div>
            ) : (
              'Generate Report'
            )}
          </button>
        </div>

        {/* Vista previa del reporte que se convertirá en PDF */}
        <div 
          ref={pdfRef} 
          className="p-8 bg-white"
          style={{ width: '210mm', minHeight: '297mm' }}
        >
          {/* Encabezado del reporte */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-lg inline-block">
                <h2 className="text-2xl font-bold">FacePay</h2>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Attendance & Payroll Report</h1>
            <div className="mt-2 text-lg text-gray-600">
              <p>From {startDate} to {endDate}</p>
              <p>Generated on: {new Date().toLocaleDateString()}</p>
            </div>
          </div>

          {/* Sección de Asistencia */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">
              Attendance Records
            </h2>
            
            {Object.entries(processedAttendance).map(([employee, dates]) => (
              <div key={employee} className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-3 bg-gray-100 p-2 rounded-md">
                  {employee}
                </h3>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                          Entry Time
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                          Exit Time
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                          Total Hours
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {Object.entries(dates).map(([date, times]) => {
                        // Calcular horas trabajadas
                        const entryTime = times.Entry;
                        const exitTime = times.Exit;
                        
                        const parseTime = (timeStr) => {
                          const [time, modifier] = timeStr.split(' ');
                          let [hours, minutes] = time.split(':');
                          
                          if (hours === '12') hours = '00';
                          if (modifier === 'PM') hours = parseInt(hours, 10) + 12;
                          
                          return new Date(0, 0, 0, hours, minutes);
                        };
                        
                        const start = parseTime(entryTime);
                        const end = parseTime(exitTime);
                        let diff = end - start;
                        const hours = Math.floor(diff / 3600000);
                        diff -= hours * 3600000;
                        const minutes = Math.floor(diff / 60000);
                        
                        return (
                          <tr key={date} className="hover:bg-gray-50">
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              {date}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                                {entryTime}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                                {exitTime}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-gray-700">
                              {hours}h {minutes}m
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>

          {/* Sección de Nómina */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">
              Payroll Summary
            </h2>
            
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Employee
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Total Hours
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Hourly Rate
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {payrollData.map((employee, index) => {
                    // Calcular tarifa por hora
                    const paymentNumber = parseFloat(employee.payment.replace(/[^0-9.]/g, ''));
                    const hourlyRate = paymentNumber / employee.hours;
                    
                    return (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10 mr-3" />
                            <div className="font-medium text-gray-900">{employee.name}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold">
                          {employee.hours} hours
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-700">
                          {employee.payment}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-700">
                          ${hourlyRate.toFixed(2)}/hour
                        </td>
                      </tr>
                    );
                  })}
                  
                  {/* Total */}
                  <tr className="bg-gray-100">
                    <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-900">
                      Total
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                      {payrollData.reduce((sum, emp) => sum + emp.hours, 0)} hours
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-900">
                      ${payrollData.reduce((sum, emp) => {
                        const amount = parseFloat(emp.payment.replace(/[^0-9.]/g, ''));
                        return sum + amount;
                      }, 0).toLocaleString('en-US')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-900">
                      Average: ${(payrollData.reduce((sum, emp) => {
                        const amount = parseFloat(emp.payment.replace(/[^0-9.]/g, ''));
                        return sum + (amount / emp.hours);
                      }, 0) / payrollData.length).toFixed(2)}/hour
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Pie de página */}
          <div className="mt-12 pt-6 border-t border-gray-200 text-center text-gray-500 text-sm">
            <p>Generated by FacePay Attendance System</p>
            <p>Confidential Report - For internal use only</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reports;