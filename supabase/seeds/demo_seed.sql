-- Demo seed for Facepay (run in Supabase SQL editor as service role)
-- Tables used: contact_info, address, employee, attendance_record, payroll_record, concept
-- Idempotent inserts with ON CONFLICT where applicable

-- Contact info
insert into contact_info (id, phone, email) values
  (1001, '+57 3001112233', 'ana.garcia@example.com'),
  (1002, '+57 3002223344', 'jose.lopez@example.com'),
  (1003, '+57 3003334455', 'maria.torres@example.com')
ON CONFLICT (id) DO UPDATE SET phone = excluded.phone, email = excluded.email;

-- Addresses
insert into address (id, street, city, state, postal_code) values
  (2001, 'Cra 7 #12-34', 'Bogotá', 'Cundinamarca', '110111'),
  (2002, 'Av 4N #25-18', 'Cali', 'Valle', '760001'),
  (2003, 'Cll 10 #5-21', 'Medellín', 'Antioquia', '050001')
ON CONFLICT (id) DO UPDATE SET street = excluded.street, city = excluded.city, state = excluded.state, postal_code = excluded.postal_code;

-- Employees
insert into employee (id, first_name, last_name, document_type, document_number, position, department, employee_code, contact_id, address_id) values
  (3001, 'Ana', 'García', 'CC', 1012345678, 'HR Manager', 'Human Resources', 'EMP001', 1001, 2001),
  (3002, 'José', 'López', 'CC', 1023456789, 'Software Engineer', 'Engineering', 'EMP002', 1002, 2002),
  (3003, 'María', 'Torres', 'CC', 1034567890, 'Data Analyst', 'Analytics', 'EMP003', 1003, 2003)
ON CONFLICT (id) DO UPDATE SET first_name = excluded.first_name, last_name = excluded.last_name, position = excluded.position, department = excluded.department, employee_code = excluded.employee_code, contact_id = excluded.contact_id, address_id = excluded.address_id;

-- Attendance (last 7 days for EMP001-EMP003)
insert into attendance_record (employee_id, date, check_in, check_out, source_terminal, status) values
  (3001, CURRENT_DATE - 1, '08:58', '17:12', 'T-01', true),
  (3002, CURRENT_DATE - 1, '09:05', '18:03', 'T-01', true),
  (3003, CURRENT_DATE - 1, '09:12', '18:07', 'T-02', true),
  (3001, CURRENT_DATE - 2, '08:55', '17:02', 'T-01', true),
  (3002, CURRENT_DATE - 2, '09:03', '18:10', 'T-01', true),
  (3003, CURRENT_DATE - 2, '09:10', '18:00', 'T-02', true)
ON CONFLICT DO NOTHING;

-- Payroll for current month biweekly
insert into payroll_record (id, employee_id, period_start, period_end, gross_salary, deductions, net_salary) values
  (4001, 3001, date_trunc('month', CURRENT_DATE), date_trunc('month', CURRENT_DATE) + interval '14 day', 4500000, 450000, 4050000),
  (4002, 3002, date_trunc('month', CURRENT_DATE), date_trunc('month', CURRENT_DATE) + interval '14 day', 6500000, 650000, 5850000),
  (4003, 3003, date_trunc('month', CURRENT_DATE), date_trunc('month', CURRENT_DATE) + interval '14 day', 5200000, 520000, 4680000)
ON CONFLICT (id) DO UPDATE SET gross_salary = excluded.gross_salary, deductions = excluded.deductions, net_salary = excluded.net_salary;

-- Concepts
insert into concept (code, description, amount, payroll_id) values
  ('BASIC', 'Basic salary', 4000000, 4001),
  ('HEALTH', 'Health deduction', -160000, 4001),
  ('PENSION', 'Pension deduction', -160000, 4001),
  ('BASIC2', 'Basic salary', 6000000, 4002),
  ('HEALTH2', 'Health deduction', -240000, 4002),
  ('PENSION2', 'Pension deduction', -240000, 4002)
ON CONFLICT (code) DO UPDATE SET amount = excluded.amount, payroll_id = excluded.payroll_id;
