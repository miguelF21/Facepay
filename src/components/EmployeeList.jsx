export default function EmployeeList({ employees, onDelete, onSetReason }) {
  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">Employees list</h2>
      {employees.length === 0 ? (
        <p className="text-gray-600">There are no employees registered</p>
      ) : (
        <ul className="space-y-4">
          {employees.map(emp => (
            <li key={emp.id} className="p-4 bg-gray-100 rounded shadow">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                  <p className="font-medium">{emp.name} – {emp.position}</p>
                  <p className="text-sm text-gray-600">Entry: {emp.date}</p>
                  {emp.reason && (
                    <p className="text-sm text-red-500">Exit: {emp.reason}</p>
                  )}
                </div>
                <div className="flex flex-col md:flex-row gap-2 mt-2 md:mt-0">
                  <button
                    onClick={() => onDelete(emp.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete                  </button>
                  {!emp.reason && (
                    <select
                      onChange={(e) => onSetReason(emp.id, e.target.value)}
                      className="text-sm border px-2 py-1 rounded"
                    >
                      <option value = "Check out">Check out</option> 
                      <option value="Resignation">Resignation</option>
                      <option value="Dismissal">Dismissal</option>
                      <option value="Termination of contract">Termination of contract</option>
                      <option value="Inability">Inability</option>
                      <option value="Not attend">Not attend</option>
                    </select>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
