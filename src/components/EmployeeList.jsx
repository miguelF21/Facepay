// EmployeeList.jsx
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Trash2, Info, Mail, Phone, MapPin, CalendarDays, DollarSign, UserRound, ArrowBigRightDash, ArrowBigLeftDash } from 'lucide-react';

export default function EmployeeList({ employees, onDelete, onSetReason, onReinstate }) {
  // Function to determine the color for departure reason/status
  const getStatusColor = (isDeparted, reason) => {
    if (isDeparted) {
      switch (reason) {
        case 'Resignation':
        case 'Dismissal':
        case 'Termination of contract':
          return 'bg-red-100 text-red-700';
        case 'Inability':
        case 'Not attend':
          return 'bg-orange-100 text-orange-700';
        case 'Check out':
          return 'bg-blue-100 text-blue-700';
        default:
          return 'bg-gray-100 text-gray-700';
      }
    }
    return 'bg-green-100 text-green-700'; // For active employees
  };

  // Function to "view details" (simulation)
  const handleViewDetails = (employee) => {
    console.log("Viewing details for employee:", employee);
    alert(`Showing details for ${employee.first_name} ${employee.last_name}. (Check console for full data)`);
  };

  // Helper to format date strings
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Helper to get full name
  const getFullName = (emp) => {
    return `${emp.first_name || ''} ${emp.last_name || ''}`.trim();
  };

  // Helper to get employee initials
  const getInitials = (emp) => {
    const firstName = emp.first_name || '';
    const lastName = emp.last_name || '';
    return `${firstName.charAt(0) || ''}${lastName.charAt(0) || ''}`.toUpperCase() || 'E';
  };

  return (
    <div className="space-y-6">
      {employees.length === 0 ? (
        <p className="text-center text-gray-600 text-lg mt-8">
          No employees registered. Start by adding one!
        </p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {employees.map(emp => {
            const fullName = getFullName(emp);
            const initials = getInitials(emp);
            const email = emp.contact_info?.email || emp.email || '';
            const phone = emp.contact_info?.phone || emp.phone || '';
            const address = emp.address ? 
              `${emp.address.street || ''}, ${emp.address.city || ''}, ${emp.address.state || ''}`.replace(/^,\s*|,\s*$/g, '') : 
              emp.address || '';

            return (
              <motion.li
                key={emp.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                whileHover={{ scale: 1.02, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
                className="relative rounded-2xl bg-white shadow-lg overflow-hidden"
              >
                <Card className="p-6 h-full flex flex-col">
                  <CardContent className="p-0 flex-grow">
                    <div className="flex items-center gap-4 mb-4">
                      {/* Employee Photo */}
                      {emp.photo_url || emp.photoUrl ? (
                        <img
                          src={emp.photo_url || emp.photoUrl}
                          alt={fullName}
                          className="w-20 h-20 rounded-full object-cover border-2 border-blue-400 shadow-md"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white text-xl font-bold border-2 border-blue-300 shadow-md">
                          {initials}
                        </div>
                      )}
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 leading-snug">{fullName || 'No Name'}</h3>
                        <p className="text-md text-gray-700">{emp.position || 'No Position'}</p>
                        <p className="text-sm text-gray-500">{emp.department || 'No Department'}</p>
                        {emp.employee_code && (
                          <p className="text-xs text-gray-400 mt-1">Code: {emp.employee_code}</p>
                        )}
                        {/* Status Badge */}
                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full mt-1 inline-block ${
                          getStatusColor(emp.isDeparted, emp.reason)
                        }`}>
                          {emp.isDeparted ? `Departed: ${emp.reason || 'N/A'}` : 'Active'}
                        </span>
                      </div>
                    </div>

                    {/* Additional Information */}
                    <div className="text-sm text-gray-600 space-y-2 mb-4">
                      {emp.document_type && emp.document_number && (
                        <p><span className="font-semibold">{emp.document_type}:</span> {emp.document_number}</p>
                      )}
                      {emp.dateOfBirth && (
                        <p><span className="font-semibold">Date of Birth:</span> {formatDate(emp.dateOfBirth)} (Age: {emp.age})</p>
                      )}
                      {emp.salary && (
                        <p className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-1 text-green-600"/>
                          <span className="font-semibold">Salary:</span> ${parseFloat(emp.salary).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                      )}
                      {email && (
                        <p className="flex items-center">
                          <Mail className="w-4 h-4 mr-1 text-blue-500"/>
                          <span className="font-semibold">Email:</span> {email}
                        </p>
                      )}
                      {phone && (
                        <p className="flex items-center">
                          <Phone className="w-4 h-4 mr-1 text-purple-500"/>
                          <span className="font-semibold">Phone:</span> {phone}
                        </p>
                      )}
                      {address && (
                        <p className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1 text-orange-500"/>
                          <span className="font-semibold">Address:</span> {address}
                        </p>
                      )}
                      {emp.hireDate && (
                        <p className="flex items-center">
                          <CalendarDays className="w-4 h-4 mr-1 text-indigo-500"/>
                          <span className="font-semibold">Hire Date:</span> {formatDate(emp.hireDate)}
                        </p>
                      )}
                      {emp.departureDate && (
                        <p className="flex items-center text-red-600">
                          <ArrowBigRightDash className="w-4 h-4 mr-1" />
                          <span className="font-semibold">Departure Date:</span> {formatDate(emp.departureDate)}
                        </p>
                      )}
                      {emp.reinstatementDate && (
                        <p className="flex items-center text-green-600">
                          <ArrowBigLeftDash className="w-4 h-4 mr-1" />
                          <span className="font-semibold">Reinstatement Date:</span> {formatDate(emp.reinstatementDate)}
                        </p>
                      )}
                      {emp.timeOutside && emp.isDeparted === false && (
                        <p className="flex items-center text-gray-700">
                          <CalendarDays className="w-4 h-4 mr-1" />
                          <span className="font-semibold">Time Outside:</span> {emp.timeOutside}
                        </p>
                      )}
                    </div>
                  </CardContent>

                  {/* Actions (Buttons and Select) */}
                  <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-gray-100">
                    {/* View Details Button */}
                    <button
                      onClick={() => handleViewDetails(emp)}
                      className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition duration-200 text-sm font-medium"
                    >
                      <Info className="w-4 h-4 mr-2" /> View Details
                    </button>

                    {/* Conditional actions based on employee status */}
                    {emp.isDeparted ? (
                      // Show Reinstate button if departed
                      onReinstate && (
                        <button
                          onClick={() => onReinstate(emp.id)}
                          className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200 text-sm font-medium"
                        >
                          <ArrowBigLeftDash className="w-4 h-4 mr-2" /> Reinstate
                        </button>
                      )
                    ) : (
                      <>
                        {/* Select Departure Reason if not departed */}
                        {onSetReason && (
                          <select
                            onChange={(e) => onSetReason(emp.id, e.target.value, new Date().toISOString().split('T')[0])}
                            defaultValue=""
                            className="block py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700 transition duration-200"
                          >
                            <option value="" disabled>Select departure reason</option>
                            <option value="Check out">Check out</option>
                            <option value="Resignation">Resignation</option>
                            <option value="Dismissal">Dismissal</option>
                            <option value="Termination of contract">Contract Termination</option>
                            <option value="Inability">Inability</option>
                            <option value="Not attend">No Show</option>
                          </select>
                        )}

                        {/* Delete Button */}
                        <button
                          onClick={() => onDelete(emp.id)}
                          className="p-2 rounded-full bg-red-100 text-red-700 hover:bg-red-200 hover:text-red-800 transition duration-200 transform hover:scale-105 shadow-sm"
                          title="Delete Employee"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </>
                    )}
                  </div>
                </Card>
              </motion.li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
