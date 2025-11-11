/*
  # FacePay System - Complete Database Schema

  ## Overview
  Sistema de gestión de asistencia biométrica facial con nómina integrada.
  
  ## New Tables
  
  ### 1. Core User Management
    - `usuario` - Tabla principal de usuarios del sistema
      - `id` (SERIAL PK) - Identificador único
      - `nombre_usuario` (VARCHAR 64) - Nombre de usuario
      - `correo` (VARCHAR 72) - Correo electrónico único
      - `contrasena_hash` (VARCHAR 64) - Hash de contraseña
      - `rol` (VARCHAR 64) - Rol del usuario (admin, operador, empleado)
      - `creado_en` (TIMESTAMP) - Fecha de creación
      - `actualizado_en` (TIMESTAMP) - Fecha de última actualización
      - `activo` (BOOLEAN) - Estado activo/inactivo
    
    - `administrador` - Usuarios con rol administrativo
      - `id_usuario` (INT PK, FK) - Referencia a usuario
    
    - `operador` - Usuarios con rol de operador
      - `id_usuario` (INT PK, FK) - Referencia a usuario
    
  ### 2. Employee Management
    - `info_contacto` - Información de contacto
      - `id` (SERIAL PK) - Identificador único
      - `telefono` (VARCHAR 16) - Número de teléfono
      - `correo` (VARCHAR 40) - Correo de contacto
    
    - `direccion` - Direcciones físicas
      - `id` (SERIAL PK) - Identificador único
      - `calle` (VARCHAR 72) - Dirección de calle
      - `ciudad` (VARCHAR 32) - Ciudad
      - `estado` (VARCHAR 32) - Estado/Provincia
      - `codigo_postal` (VARCHAR 16) - Código postal
    
    - `empleado` - Información de empleados
      - `id` (SERIAL PK) - Identificador único
      - `id_usuario` (INT FK) - Referencia a usuario
      - `nombres` (VARCHAR 40) - Nombres
      - `apellidos` (VARCHAR 40) - Apellidos
      - `tipo_documento` (VARCHAR 64) - Tipo de documento
      - `numero_documento` (INT) - Número de documento
      - `cargo` (VARCHAR 64) - Cargo laboral
      - `departamento` (VARCHAR 64) - Departamento
      - `codigo_empleado` (VARCHAR 16) - Código único de empleado
      - `id_contacto` (INT FK) - Referencia a info_contacto
      - `id_direccion` (INT FK) - Referencia a direccion
  
  ### 3. Biometric & Access Control
    - `terminal` - Terminales biométricas
      - `id` (SERIAL PK) - Identificador único
      - `ubicacion` (VARCHAR 64) - Ubicación física
      - `direccion_ip` (VARCHAR 64) - Dirección IP
      - `version_firmware` (VARCHAR 32) - Versión de firmware
      - `estado` (VARCHAR 32) - Estado operativo
    
    - `datos_biometricos` - Datos biométricos faciales
      - `id` (SERIAL PK) - Identificador único
      - `tipo` (VARCHAR 64) - Tipo de dato biométrico
      - `vector` (TEXT) - Vector de características faciales
      - `registrado_en` (TIMESTAMP) - Fecha de registro
      - `id_terminal` (INT FK) - Terminal de registro
      - `id_empleado` (INT FK) - Empleado asociado
    
    - `intento_acceso` - Intentos de acceso
      - `id` (SERIAL PK) - Identificador único
      - `id_terminal` (INT FK) - Terminal usado
      - `fecha_hora` (TIMESTAMP) - Momento del intento
      - `metodo` (VARCHAR 16) - Método de acceso
      - `resultado` (VARCHAR 16) - Resultado del intento
      - `referencia_empleado` (INT FK) - Empleado que intenta acceso
    
    - `resultado_reconocimiento` - Resultados de reconocimiento facial
      - `id` (SERIAL PK) - Identificador único
      - `coincidencia` (BOOLEAN) - Si hubo coincidencia
      - `id_empleado` (INT FK) - Empleado reconocido
      - `confianza` (FLOAT) - Nivel de confianza
      - `fecha_hora` (TIMESTAMP) - Momento del reconocimiento
      - `id_intento` (INT FK) - Intento asociado
  
  ### 4. Attendance & Payroll
    - `registro_asistencia` - Registros de asistencia
      - `id` (SERIAL PK) - Identificador único
      - `id_empleado` (INT FK) - Empleado
      - `fecha` (DATE) - Fecha del registro
      - `hora_entrada` (TIME) - Hora de entrada
      - `hora_salida` (TIME) - Hora de salida
      - `terminal_origen` (VARCHAR 64) - Terminal de origen
      - `estado` (BOOLEAN) - Estado del registro
    
    - `registro_nomina` - Registros de nómina
      - `id` (SERIAL PK) - Identificador único
      - `id_empleado` (INT FK) - Empleado
      - `inicio_periodo` (DATE) - Inicio del período
      - `fin_periodo` (DATE) - Fin del período
      - `salario_bruto` (DECIMAL 12,2) - Salario bruto
      - `deducciones` (DECIMAL 12,2) - Deducciones totales
      - `salario_neto` (DECIMAL 12,2) - Salario neto
    
    - `concepto` - Conceptos de nómina
      - `codigo` (VARCHAR 24 PK) - Código único
      - `descripcion` (VARCHAR 120) - Descripción del concepto
      - `monto` (DECIMAL 12,2) - Monto
      - `id_nomina` (INT FK) - Nómina asociada
    
    - `recibo_pago` - Recibos de pago
      - `id` (SERIAL PK) - Identificador único
      - `id_nomina` (INT FK) - Nómina asociada
      - `id_empleado` (INT FK) - Empleado
      - `generado_en` (TIMESTAMP) - Fecha de generación
      - `referencia_pdf` (VARCHAR 255) - Referencia al PDF
  
  ### 5. System Management
    - `reporte` - Reportes generados
      - `id` (SERIAL PK) - Identificador único
      - `titulo` (VARCHAR 116) - Título del reporte
      - `generado_en` (TIMESTAMP) - Fecha de generación
      - `filtros` (JSONB) - Filtros aplicados
      - `referencia_archivo` (VARCHAR 64) - Referencia al archivo
      - `id_admin` (INT FK) - Administrador que generó
    
    - `config_sistema` - Configuración del sistema
      - `id` (SERIAL PK) - Identificador único
      - `configuraciones` (JSONB) - Configuraciones JSON
    
    - `registro_auditoria` - Auditoría del sistema
      - `id` (SERIAL PK) - Identificador único
      - `accion` (VARCHAR 150) - Acción realizada
      - `id_usuario` (INT FK) - Usuario que realizó la acción
      - `fecha_hora` (TIMESTAMP) - Momento de la acción
      - `detalles` (JSONB) - Detalles adicionales
    
    - `token_autenticacion` - Tokens de autenticación
      - `token` (VARCHAR 255 PK) - Token único
      - `id_usuario` (INT FK) - Usuario asociado
      - `expira_en` (TIMESTAMP) - Fecha de expiración
  
  ## Security
    - RLS enabled on all tables
    - Policies for authenticated users with role-based access
    - Audit trail for all critical operations
*/

-- Create info_contacto table
CREATE TABLE IF NOT EXISTS contact_info (
  id SERIAL PRIMARY KEY,
  phone VARCHAR(16),
  email VARCHAR(40)
);

ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read contact info"
  ON contact_info FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert contact info"
  ON contact_info FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update contact info"
  ON contact_info FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create address table
CREATE TABLE IF NOT EXISTS address (
  id SERIAL PRIMARY KEY,
  street VARCHAR(72),
  city VARCHAR(32),
  state VARCHAR(32),
  postal_code VARCHAR(16)
);

ALTER TABLE address ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read addresses"
  ON address FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert addresses"
  ON address FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update addresses"
  ON address FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create user table
CREATE TABLE IF NOT EXISTS user_account (
  id SERIAL PRIMARY KEY,
  username VARCHAR(64),
  email VARCHAR(72) UNIQUE NOT NULL,
  password_hash VARCHAR(64),
  role VARCHAR(64) DEFAULT 'employee',
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  active BOOLEAN DEFAULT true
);

ALTER TABLE user_account ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data"
  ON user_account FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id::text OR role IN ('admin', 'operator'));

CREATE POLICY "Admins can insert users"
  ON user_account FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_account WHERE id::text = auth.uid()::text AND role = 'admin'
    )
  );

CREATE POLICY "Users can update own data"
  ON user_account FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = id::text)
  WITH CHECK (auth.uid()::text = id::text);

-- Create admin table
CREATE TABLE IF NOT EXISTS admin (
  user_id INT PRIMARY KEY REFERENCES user_account(id) ON DELETE CASCADE
);

ALTER TABLE admin ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read admins"
  ON admin FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage admin records"
  ON admin FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_account WHERE id::text = auth.uid()::text AND role = 'admin'
    )
  );

-- Create operator table
CREATE TABLE IF NOT EXISTS operator (
  user_id INT PRIMARY KEY REFERENCES user_account(id) ON DELETE CASCADE
);

ALTER TABLE operator ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read operators"
  ON operator FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage operator records"
  ON operator FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_account WHERE id::text = auth.uid()::text AND role = 'admin'
    )
  );

-- Create employee table
CREATE TABLE IF NOT EXISTS employee (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES user_account(id) ON DELETE SET NULL,
  first_name VARCHAR(40),
  last_name VARCHAR(40),
  document_type VARCHAR(64),
  document_number INT,
  position VARCHAR(64),
  department VARCHAR(64),
  employee_code VARCHAR(16) UNIQUE,
  contact_id INT REFERENCES contact_info(id) ON DELETE SET NULL,
  address_id INT REFERENCES address(id) ON DELETE SET NULL
);

ALTER TABLE employee ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read employees"
  ON employee FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins and operators can insert employees"
  ON employee FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_account WHERE id::text = auth.uid()::text AND role IN ('admin', 'operator')
    )
  );

CREATE POLICY "Admins and operators can update employees"
  ON employee FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_account WHERE id::text = auth.uid()::text AND role IN ('admin', 'operator')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_account WHERE id::text = auth.uid()::text AND role IN ('admin', 'operator')
    )
  );

-- Create terminal table
CREATE TABLE IF NOT EXISTS terminal (
  id SERIAL PRIMARY KEY,
  location VARCHAR(64),
  ip_address VARCHAR(64),
  firmware_version VARCHAR(32),
  status VARCHAR(32) DEFAULT 'active'
);

ALTER TABLE terminal ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read terminals"
  ON terminal FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage terminals"
  ON terminal FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_account WHERE id::text = auth.uid()::text AND role = 'admin'
    )
  );

-- Create biometric_data table
CREATE TABLE IF NOT EXISTS biometric_data (
  id SERIAL PRIMARY KEY,
  type VARCHAR(64),
  vector TEXT,
  registered_at TIMESTAMP DEFAULT now(),
  terminal_id INT REFERENCES terminal(id) ON DELETE SET NULL,
  employee_id INT REFERENCES employee(id) ON DELETE CASCADE
);

ALTER TABLE biometric_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read biometric data"
  ON biometric_data FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins and operators can manage biometric data"
  ON biometric_data FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_account WHERE id::text = auth.uid()::text AND role IN ('admin', 'operator')
    )
  );

-- Create access_attempt table
CREATE TABLE IF NOT EXISTS access_attempt (
  id SERIAL PRIMARY KEY,
  terminal_id INT REFERENCES terminal(id) ON DELETE SET NULL,
  timestamp TIMESTAMP DEFAULT now(),
  method VARCHAR(16),
  result VARCHAR(16),
  employee_ref INT REFERENCES employee(id) ON DELETE SET NULL
);

ALTER TABLE access_attempt ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read access attempts"
  ON access_attempt FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "System can insert access attempts"
  ON access_attempt FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create recognition_result table
CREATE TABLE IF NOT EXISTS recognition_result (
  id SERIAL PRIMARY KEY,
  match BOOLEAN,
  employee_id INT REFERENCES employee(id) ON DELETE SET NULL,
  confidence FLOAT,
  timestamp TIMESTAMP DEFAULT now(),
  attempt_id INT REFERENCES access_attempt(id) ON DELETE CASCADE
);

ALTER TABLE recognition_result ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read recognition results"
  ON recognition_result FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "System can insert recognition results"
  ON recognition_result FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create attendance_record table
CREATE TABLE IF NOT EXISTS attendance_record (
  id SERIAL PRIMARY KEY,
  employee_id INT REFERENCES employee(id) ON DELETE CASCADE,
  date DATE DEFAULT CURRENT_DATE,
  check_in TIME,
  check_out TIME,
  source_terminal VARCHAR(64),
  status BOOLEAN DEFAULT true
);

ALTER TABLE attendance_record ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read attendance"
  ON attendance_record FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "System can insert attendance records"
  ON attendance_record FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admins and operators can update attendance"
  ON attendance_record FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_account WHERE id::text = auth.uid()::text AND role IN ('admin', 'operator')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_account WHERE id::text = auth.uid()::text AND role IN ('admin', 'operator')
    )
  );

-- Create payroll_record table
CREATE TABLE IF NOT EXISTS payroll_record (
  id SERIAL PRIMARY KEY,
  employee_id INT REFERENCES employee(id) ON DELETE CASCADE,
  period_start DATE,
  period_end DATE,
  gross_salary DECIMAL(12,2),
  deductions DECIMAL(12,2),
  net_salary DECIMAL(12,2)
);

ALTER TABLE payroll_record ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employees can read own payroll"
  ON payroll_record FOR SELECT
  TO authenticated
  USING (
    employee_id IN (
      SELECT id FROM employee WHERE user_id::text = auth.uid()::text
    ) OR
    EXISTS (
      SELECT 1 FROM user_account WHERE id::text = auth.uid()::text AND role IN ('admin', 'operator')
    )
  );

CREATE POLICY "Admins can manage payroll"
  ON payroll_record FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_account WHERE id::text = auth.uid()::text AND role = 'admin'
    )
  );

-- Create concept table
CREATE TABLE IF NOT EXISTS concept (
  code VARCHAR(24) PRIMARY KEY,
  description VARCHAR(120),
  amount DECIMAL(12,2),
  payroll_id INT REFERENCES payroll_record(id) ON DELETE CASCADE
);

ALTER TABLE concept ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users with payroll access can read concepts"
  ON concept FOR SELECT
  TO authenticated
  USING (
    payroll_id IN (
      SELECT pr.id FROM payroll_record pr
      JOIN employee e ON pr.employee_id = e.id
      WHERE e.user_id::text = auth.uid()::text
    ) OR
    EXISTS (
      SELECT 1 FROM user_account WHERE id::text = auth.uid()::text AND role IN ('admin', 'operator')
    )
  );

CREATE POLICY "Admins can manage concepts"
  ON concept FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_account WHERE id::text = auth.uid()::text AND role = 'admin'
    )
  );

-- Create payment_receipt table
CREATE TABLE IF NOT EXISTS payment_receipt (
  id SERIAL PRIMARY KEY,
  payroll_id INT REFERENCES payroll_record(id) ON DELETE CASCADE,
  employee_id INT REFERENCES employee(id) ON DELETE CASCADE,
  generated_at TIMESTAMP DEFAULT now(),
  pdf_reference VARCHAR(255)
);

ALTER TABLE payment_receipt ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employees can read own payment receipts"
  ON payment_receipt FOR SELECT
  TO authenticated
  USING (
    employee_id IN (
      SELECT id FROM employee WHERE user_id::text = auth.uid()::text
    ) OR
    EXISTS (
      SELECT 1 FROM user_account WHERE id::text = auth.uid()::text AND role IN ('admin', 'operator')
    )
  );

CREATE POLICY "Admins can manage payment receipts"
  ON payment_receipt FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_account WHERE id::text = auth.uid()::text AND role = 'admin'
    )
  );

-- Create report table
CREATE TABLE IF NOT EXISTS report (
  id SERIAL PRIMARY KEY,
  title VARCHAR(116),
  generated_at TIMESTAMP DEFAULT now(),
  filters JSONB,
  file_reference VARCHAR(64),
  admin_id INT REFERENCES admin(user_id) ON DELETE SET NULL
);

ALTER TABLE report ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read all reports"
  ON report FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_account WHERE id::text = auth.uid()::text AND role = 'admin'
    )
  );

CREATE POLICY "Admins can manage reports"
  ON report FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_account WHERE id::text = auth.uid()::text AND role = 'admin'
    )
  );

-- Create system_config table
CREATE TABLE IF NOT EXISTS system_config (
  id SERIAL PRIMARY KEY,
  settings JSONB DEFAULT '{}'::jsonb
);

ALTER TABLE system_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read config"
  ON system_config FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage config"
  ON system_config FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_account WHERE id::text = auth.uid()::text AND role = 'admin'
    )
  );

-- Create audit_log table
CREATE TABLE IF NOT EXISTS audit_log (
  id SERIAL PRIMARY KEY,
  action VARCHAR(150),
  user_id INT REFERENCES user_account(id) ON DELETE SET NULL,
  timestamp TIMESTAMP DEFAULT now(),
  details JSONB
);

ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read audit logs"
  ON audit_log FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_account WHERE id::text = auth.uid()::text AND role = 'admin'
    )
  );

CREATE POLICY "System can insert audit logs"
  ON audit_log FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create auth_token table
CREATE TABLE IF NOT EXISTS auth_token (
  token VARCHAR(255) PRIMARY KEY,
  user_id INT REFERENCES user_account(id) ON DELETE CASCADE,
  expires_at TIMESTAMP
);

ALTER TABLE auth_token ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own tokens"
  ON auth_token FOR SELECT
  TO authenticated
  USING (user_id::text = auth.uid()::text);

CREATE POLICY "Users can manage own tokens"
  ON auth_token FOR ALL
  TO authenticated
  USING (user_id::text = auth.uid()::text);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_email ON user_account(email);
CREATE INDEX IF NOT EXISTS idx_employee_code ON employee(employee_code);
CREATE INDEX IF NOT EXISTS idx_employee_user ON employee(user_id);
CREATE INDEX IF NOT EXISTS idx_biometric_employee ON biometric_data(employee_id);
CREATE INDEX IF NOT EXISTS idx_access_terminal ON access_attempt(terminal_id);
CREATE INDEX IF NOT EXISTS idx_access_timestamp ON access_attempt(timestamp);
CREATE INDEX IF NOT EXISTS idx_attendance_employee ON attendance_record(employee_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance_record(date);
CREATE INDEX IF NOT EXISTS idx_payroll_employee ON payroll_record(employee_id);
CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON audit_log(timestamp);
