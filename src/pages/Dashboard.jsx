import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"; // Although Badge is imported, it's not used in the provided snippet.
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { Briefcase, Users, DollarSign, LogOut } from "lucide-react";

const Dashboard = () => {
  // Variable names translated
  const totalEmployees = 20;
  const totalDepartments = 5;
  const payrollAmount = 70_000;

  // Array name and object keys translated
  const leavingRequests = [
    { status: "Applied", amount: 5 },
    { status: "Pending", amount: 1 },
    { status: "Approved", amount: 3 },
    { status: "Rejected", amount: 1 },
  ];

  return (
    <div className="p-6 grid gap-6">
      <h1 className="text-3xl font-bold">Control Panel</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card for Total Employees */}
        <motion.div whileHover={{ scale: 1.02 }}>
          <Card className="p-4 shadow-md rounded-2xl">
            <CardContent className="flex items-center gap-4">
              <Users className="text-blue-500" />
              <div>
                <h2 className="text-sm text-muted-foreground">Employees</h2>
                <p className="text-xl font-semibold">{totalEmployees}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Card for Total Departments */}
        <motion.div whileHover={{ scale: 1.02 }}>
          <Card className="p-4 shadow-md rounded-2xl">
            <CardContent className="flex items-center gap-4">
              <Briefcase className="text-green-500" />
              <div>
                <h2 className="text-sm text-muted-foreground">Departments</h2>
                <p className="text-xl font-semibold">{totalDepartments}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Card for Payroll Amount */}
        <motion.div whileHover={{ scale: 1.02 }}>
          <Card className="p-4 shadow-md rounded-2xl">
            <CardContent className="flex items-center gap-4">
              <DollarSign className="text-yellow-500" />
              <div>
                <h2 className="text-sm text-muted-foreground">Payroll</h2>
                {/* Ensure currency formatting is appropriate for USD or desired currency */}
                <p className="text-xl font-semibold">${payrollAmount.toLocaleString("en-US")}</p> 
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Card for Leaving Requests */}
        <motion.div whileHover={{ scale: 1.02 }}>
          <Card className="p-4 shadow-md rounded-2xl">
            <CardContent className="flex items-center gap-4">
              <LogOut className="text-red-500" />
              <div>
                <h2 className="text-sm text-muted-foreground">Leaving Requests</h2> {/* Translated "Leaving Soticitudes" to "Leaving Requests" */}
                <p className="text-xl font-semibold">
                  {leavingRequests.reduce((acc, req) => acc + req.amount, 0)}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Leaving Details Chart Section */}
      <div className="mt-6">
        <h2 className="text-lg font-bold mb-2">Leaving Details</h2> {/* Translated "Leaving Details" */}
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={leavingRequests}>
            <XAxis dataKey="status" /> {/* Changed dataKey to 'status' */}
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="amount" fill="#3b82f6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;