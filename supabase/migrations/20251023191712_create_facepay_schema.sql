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
CREATE TABLE IF NOT EXISTS info_contacto (
  id SERIAL PRIMARY KEY,
  telefono VARCHAR(16),
  correo VARCHAR(40)
);

ALTER TABLE info_contacto ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read contact info"
  ON info_contacto FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert contact info"
  ON info_contacto FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update contact info"
  ON info_contacto FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create direccion table
CREATE TABLE IF NOT EXISTS direccion (
  id SERIAL PRIMARY KEY,
  calle VARCHAR(72),
  ciudad VARCHAR(32),
  estado VARCHAR(32),
  codigo_postal VARCHAR(16)
);

ALTER TABLE direccion ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read addresses"
  ON direccion FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert addresses"
  ON direccion FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update addresses"
  ON direccion FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create usuario table
CREATE TABLE IF NOT EXISTS usuario (
  id SERIAL PRIMARY KEY,
  nombre_usuario VARCHAR(64),
  correo VARCHAR(72) UNIQUE NOT NULL,
  contrasena_hash VARCHAR(64),
  rol VARCHAR(64) DEFAULT 'empleado',
  creado_en TIMESTAMP DEFAULT now(),
  actualizado_en TIMESTAMP DEFAULT now(),
  activo BOOLEAN DEFAULT true
);

ALTER TABLE usuario ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data"
  ON usuario FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id::text OR rol IN ('administrador', 'operador'));

CREATE POLICY "Admins can insert users"
  ON usuario FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM usuario WHERE id::text = auth.uid()::text AND rol = 'administrador'
    )
  );

CREATE POLICY "Users can update own data"
  ON usuario FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = id::text)
  WITH CHECK (auth.uid()::text = id::text);

-- Create administrador table
CREATE TABLE IF NOT EXISTS administrador (
  id_usuario INT PRIMARY KEY REFERENCES usuario(id) ON DELETE CASCADE
);

ALTER TABLE administrador ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read admins"
  ON administrador FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage admin records"
  ON administrador FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM usuario WHERE id::text = auth.uid()::text AND rol = 'administrador'
    )
  );

-- Create operador table
CREATE TABLE IF NOT EXISTS operador (
  id_usuario INT PRIMARY KEY REFERENCES usuario(id) ON DELETE CASCADE
);

ALTER TABLE operador ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read operators"
  ON operador FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage operator records"
  ON operador FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM usuario WHERE id::text = auth.uid()::text AND rol = 'administrador'
    )
  );

-- Create empleado table
CREATE TABLE IF NOT EXISTS empleado (
  id SERIAL PRIMARY KEY,
  id_usuario INT REFERENCES usuario(id) ON DELETE SET NULL,
  nombres VARCHAR(40),
  apellidos VARCHAR(40),
  tipo_documento VARCHAR(64),
  numero_documento INT,
  cargo VARCHAR(64),
  departamento VARCHAR(64),
  codigo_empleado VARCHAR(16) UNIQUE,
  id_contacto INT REFERENCES info_contacto(id) ON DELETE SET NULL,
  id_direccion INT REFERENCES direccion(id) ON DELETE SET NULL
);

ALTER TABLE empleado ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read employees"
  ON empleado FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins and operators can insert employees"
  ON empleado FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM usuario WHERE id::text = auth.uid()::text AND rol IN ('administrador', 'operador')
    )
  );

CREATE POLICY "Admins and operators can update employees"
  ON empleado FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM usuario WHERE id::text = auth.uid()::text AND rol IN ('administrador', 'operador')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM usuario WHERE id::text = auth.uid()::text AND rol IN ('administrador', 'operador')
    )
  );

-- Create terminal table
CREATE TABLE IF NOT EXISTS terminal (
  id SERIAL PRIMARY KEY,
  ubicacion VARCHAR(64),
  direccion_ip VARCHAR(64),
  version_firmware VARCHAR(32),
  estado VARCHAR(32) DEFAULT 'activo'
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
      SELECT 1 FROM usuario WHERE id::text = auth.uid()::text AND rol = 'administrador'
    )
  );

-- Create datos_biometricos table
CREATE TABLE IF NOT EXISTS datos_biometricos (
  id SERIAL PRIMARY KEY,
  tipo VARCHAR(64),
  vector TEXT,
  registrado_en TIMESTAMP DEFAULT now(),
  id_terminal INT REFERENCES terminal(id) ON DELETE SET NULL,
  id_empleado INT REFERENCES empleado(id) ON DELETE CASCADE
);

ALTER TABLE datos_biometricos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read biometric data"
  ON datos_biometricos FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins and operators can manage biometric data"
  ON datos_biometricos FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM usuario WHERE id::text = auth.uid()::text AND rol IN ('administrador', 'operador')
    )
  );

-- Create intento_acceso table
CREATE TABLE IF NOT EXISTS intento_acceso (
  id SERIAL PRIMARY KEY,
  id_terminal INT REFERENCES terminal(id) ON DELETE SET NULL,
  fecha_hora TIMESTAMP DEFAULT now(),
  metodo VARCHAR(16),
  resultado VARCHAR(16),
  referencia_empleado INT REFERENCES empleado(id) ON DELETE SET NULL
);

ALTER TABLE intento_acceso ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read access attempts"
  ON intento_acceso FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "System can insert access attempts"
  ON intento_acceso FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create resultado_reconocimiento table
CREATE TABLE IF NOT EXISTS resultado_reconocimiento (
  id SERIAL PRIMARY KEY,
  coincidencia BOOLEAN,
  id_empleado INT REFERENCES empleado(id) ON DELETE SET NULL,
  confianza FLOAT,
  fecha_hora TIMESTAMP DEFAULT now(),
  id_intento INT REFERENCES intento_acceso(id) ON DELETE CASCADE
);

ALTER TABLE resultado_reconocimiento ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read recognition results"
  ON resultado_reconocimiento FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "System can insert recognition results"
  ON resultado_reconocimiento FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create registro_asistencia table
CREATE TABLE IF NOT EXISTS registro_asistencia (
  id SERIAL PRIMARY KEY,
  id_empleado INT REFERENCES empleado(id) ON DELETE CASCADE,
  fecha DATE DEFAULT CURRENT_DATE,
  hora_entrada TIME,
  hora_salida TIME,
  terminal_origen VARCHAR(64),
  estado BOOLEAN DEFAULT true
);

ALTER TABLE registro_asistencia ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read attendance"
  ON registro_asistencia FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "System can insert attendance records"
  ON registro_asistencia FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admins and operators can update attendance"
  ON registro_asistencia FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM usuario WHERE id::text = auth.uid()::text AND rol IN ('administrador', 'operador')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM usuario WHERE id::text = auth.uid()::text AND rol IN ('administrador', 'operador')
    )
  );

-- Create registro_nomina table
CREATE TABLE IF NOT EXISTS registro_nomina (
  id SERIAL PRIMARY KEY,
  id_empleado INT REFERENCES empleado(id) ON DELETE CASCADE,
  inicio_periodo DATE,
  fin_periodo DATE,
  salario_bruto DECIMAL(12,2),
  deducciones DECIMAL(12,2),
  salario_neto DECIMAL(12,2)
);

ALTER TABLE registro_nomina ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employees can read own payroll"
  ON registro_nomina FOR SELECT
  TO authenticated
  USING (
    id_empleado IN (
      SELECT id FROM empleado WHERE id_usuario::text = auth.uid()::text
    ) OR
    EXISTS (
      SELECT 1 FROM usuario WHERE id::text = auth.uid()::text AND rol IN ('administrador', 'operador')
    )
  );

CREATE POLICY "Admins can manage payroll"
  ON registro_nomina FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM usuario WHERE id::text = auth.uid()::text AND rol = 'administrador'
    )
  );

-- Create concepto table
CREATE TABLE IF NOT EXISTS concepto (
  codigo VARCHAR(24) PRIMARY KEY,
  descripcion VARCHAR(120),
  monto DECIMAL(12,2),
  id_nomina INT REFERENCES registro_nomina(id) ON DELETE CASCADE
);

ALTER TABLE concepto ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users with payroll access can read concepts"
  ON concepto FOR SELECT
  TO authenticated
  USING (
    id_nomina IN (
      SELECT rn.id FROM registro_nomina rn
      JOIN empleado e ON rn.id_empleado = e.id
      WHERE e.id_usuario::text = auth.uid()::text
    ) OR
    EXISTS (
      SELECT 1 FROM usuario WHERE id::text = auth.uid()::text AND rol IN ('administrador', 'operador')
    )
  );

CREATE POLICY "Admins can manage concepts"
  ON concepto FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM usuario WHERE id::text = auth.uid()::text AND rol = 'administrador'
    )
  );

-- Create recibo_pago table
CREATE TABLE IF NOT EXISTS recibo_pago (
  id SERIAL PRIMARY KEY,
  id_nomina INT REFERENCES registro_nomina(id) ON DELETE CASCADE,
  id_empleado INT REFERENCES empleado(id) ON DELETE CASCADE,
  generado_en TIMESTAMP DEFAULT now(),
  referencia_pdf VARCHAR(255)
);

ALTER TABLE recibo_pago ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employees can read own payment receipts"
  ON recibo_pago FOR SELECT
  TO authenticated
  USING (
    id_empleado IN (
      SELECT id FROM empleado WHERE id_usuario::text = auth.uid()::text
    ) OR
    EXISTS (
      SELECT 1 FROM usuario WHERE id::text = auth.uid()::text AND rol IN ('administrador', 'operador')
    )
  );

CREATE POLICY "Admins can manage payment receipts"
  ON recibo_pago FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM usuario WHERE id::text = auth.uid()::text AND rol = 'administrador'
    )
  );

-- Create reporte table
CREATE TABLE IF NOT EXISTS reporte (
  id SERIAL PRIMARY KEY,
  titulo VARCHAR(116),
  generado_en TIMESTAMP DEFAULT now(),
  filtros JSONB,
  referencia_archivo VARCHAR(64),
  id_admin INT REFERENCES administrador(id_usuario) ON DELETE SET NULL
);

ALTER TABLE reporte ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read all reports"
  ON reporte FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM usuario WHERE id::text = auth.uid()::text AND rol = 'administrador'
    )
  );

CREATE POLICY "Admins can manage reports"
  ON reporte FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM usuario WHERE id::text = auth.uid()::text AND rol = 'administrador'
    )
  );

-- Create config_sistema table
CREATE TABLE IF NOT EXISTS config_sistema (
  id SERIAL PRIMARY KEY,
  configuraciones JSONB DEFAULT '{}'::jsonb
);

ALTER TABLE config_sistema ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read config"
  ON config_sistema FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage config"
  ON config_sistema FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM usuario WHERE id::text = auth.uid()::text AND rol = 'administrador'
    )
  );

-- Create registro_auditoria table
CREATE TABLE IF NOT EXISTS registro_auditoria (
  id SERIAL PRIMARY KEY,
  accion VARCHAR(150),
  id_usuario INT REFERENCES usuario(id) ON DELETE SET NULL,
  fecha_hora TIMESTAMP DEFAULT now(),
  detalles JSONB
);

ALTER TABLE registro_auditoria ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read audit logs"
  ON registro_auditoria FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM usuario WHERE id::text = auth.uid()::text AND rol = 'administrador'
    )
  );

CREATE POLICY "System can insert audit logs"
  ON registro_auditoria FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create token_autenticacion table
CREATE TABLE IF NOT EXISTS token_autenticacion (
  token VARCHAR(255) PRIMARY KEY,
  id_usuario INT REFERENCES usuario(id) ON DELETE CASCADE,
  expira_en TIMESTAMP
);

ALTER TABLE token_autenticacion ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own tokens"
  ON token_autenticacion FOR SELECT
  TO authenticated
  USING (id_usuario::text = auth.uid()::text);

CREATE POLICY "Users can manage own tokens"
  ON token_autenticacion FOR ALL
  TO authenticated
  USING (id_usuario::text = auth.uid()::text);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_usuario_correo ON usuario(correo);
CREATE INDEX IF NOT EXISTS idx_empleado_codigo ON empleado(codigo_empleado);
CREATE INDEX IF NOT EXISTS idx_empleado_usuario ON empleado(id_usuario);
CREATE INDEX IF NOT EXISTS idx_datos_biometricos_empleado ON datos_biometricos(id_empleado);
CREATE INDEX IF NOT EXISTS idx_intento_acceso_terminal ON intento_acceso(id_terminal);
CREATE INDEX IF NOT EXISTS idx_intento_acceso_fecha ON intento_acceso(fecha_hora);
CREATE INDEX IF NOT EXISTS idx_registro_asistencia_empleado ON registro_asistencia(id_empleado);
CREATE INDEX IF NOT EXISTS idx_registro_asistencia_fecha ON registro_asistencia(fecha);
CREATE INDEX IF NOT EXISTS idx_registro_nomina_empleado ON registro_nomina(id_empleado);
CREATE INDEX IF NOT EXISTS idx_registro_auditoria_usuario ON registro_auditoria(id_usuario);
CREATE INDEX IF NOT EXISTS idx_registro_auditoria_fecha ON registro_auditoria(fecha_hora);