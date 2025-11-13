# Integración de Reconocimiento Facial con FacePay

## 📚 Descripción General

Este sistema integra el reconocimiento facial biométrico con la plataforma web FacePay, permitiendo:

- ✅ Autenticación automática mediante reconocimiento facial
- ✅ Registro de asistencia automático
- ✅ Redirección directa al dashboard sin Auth0
- ✅ Compatibilidad con autenticación Auth0 tradicional
- ✅ Sistema dual (facial + manual)

## 🏛️ Arquitectura

```
Sistema de Reconocimiento Facial (Python)
            ↓
        Reconoce Usuario
            ↓
    API Bridge (Flask)
            ↓
   Registra en Supabase
            ↓
   Abre Navegador con Token
            ↓
  FacialLogin.jsx (React)
            ↓
   Valida y Crea Sesión
            ↓
     Dashboard (Autenticado)
```

## 🔧 Componentes Creados/Modificados

### Frontend (Facepay)

1. **`src/utils/authMiddleware.js`** (NUEVO)
   - Maneja autenticación dual (Auth0 + Facial)
   - Verifica sesiones faciales
   - Gestiona tokens y expiración

2. **`src/pages/FacialLogin.jsx`** (ACTUALIZADO)
   - Página de autenticación facial
   - Valida token y employee_id
   - Crea sesión y redirige a dashboard
   - UI con barra de progreso

3. **`src/components/ProtectedRoute.jsx`** (ACTUALIZADO)
   - Soporta Auth0 Y reconocimiento facial
   - Permite acceso con cualquiera de los dos métodos

4. **`src/App.jsx`** (ACTUALIZADO)
   - `/facial-login` ahora es ruta pública
   - Rutas del dashboard protegidas con sistema dual

### Backend (Facial-recognition)

5. **`api_bridge.py`** (NUEVO - crear en raiz)
   - API Flask que conecta reconocimiento con Supabase
   - Endpoint: `POST /api/facial-auth`
   - Registra asistencia y abre navegador

6. **`process/main.py`** (ACTUALIZADO)
   - Método `facial_login` modificado
   - Llama a API Bridge cuando reconoce usuario
   - Sistema de cooldown para evitar reconocimientos múltiples

7. **`sync_employees.py`** (NUEVO - crear en raiz)
   - Sincroniza empleados entre sistemas
   - Bidireccional: Local ↔ Supabase

## 🚀 Configuración

### 1. Variables de Entorno

**Facepay (`.env`):**
```env
VITE_AUTH0_DOMAIN=dev-whrxbulkwlxu1gbp.us.auth0.com
VITE_AUTH0_CLIENT_ID=5IYmUDEsnSjR1XfHwYAlFhJpAogg7ixJ
VITE_SUPABASE_URL=https://zypyviskemdvvqnjnnui.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_key
VITE_AUTH0_AUDIENCE=https://dev-whrxbulkwlxu1gbp.us.auth0.com/api/v2/
VITE_AUTH0_CALLBACK_URL=http://localhost:5173
VITE_FACIAL_AUTH_SECRET=facial_auth_secret_2024_facepay_xk9j2m4p8q1w5e7r
```

**Facial-recognition (`.env`):**
```env
SUPABASE_URL=https://zypyviskemdvvqnjnnui.supabase.co
SUPABASE_KEY=tu_anon_key
```

### 2. Dependencias

**Frontend:**
```bash
cd Facepay
npm install
```

**Backend:**
```bash
cd Facial-recognition
pip install Flask supabase python-dotenv requests
```

## 📦 Instalación

### Paso 1: Clonar Repositorios

```bash
git clone https://github.com/miguelF21/Facepay.git
git clone https://github.com/miguelF21/Facial-recognition.git
```

### Paso 2: Configurar Facepay

```bash
cd Facepay
git checkout feature/facial-recognition-integration
npm install

# Copiar y configurar .env
cp .env.example .env
# Editar .env con tus credenciales
```

### Paso 3: Configurar Facial-recognition

```bash
cd Facial-recognition

# Crear y activar entorno virtual (Python 3.10)
python -m venv env310
# Windows:
.\env310\Scripts\activate
# Linux/Mac:
source env310/bin/activate

# Instalar dependencias
pip install -r requirements.txt
pip install Flask supabase python-dotenv requests

# Configurar .env
echo SUPABASE_URL=https://tu-proyecto.supabase.co > .env
echo SUPABASE_KEY=tu_key >> .env
```

### Paso 4: Crear Archivos de API en Facial-recognition

Crea `api_bridge.py` en la raíz de Facial-recognition (ver sección completa abajo).

## 🏃 Ejecución

### Ejecutar Sistema Completo (3 Terminales)

**Terminal 1 - API Bridge:**
```bash
cd Facial-recognition
python api_bridge.py
```

**Terminal 2 - Sistema de Reconocimiento Facial:**
```bash
cd Facial-recognition/examples
python example.py
```

**Terminal 3 - Frontend Web:**
```bash
cd Facepay
npm run dev
```

## 🔄 Flujo de Autenticación

### Método 1: Reconocimiento Facial (Terminal)

1. Usuario se para frente a la cámara
2. Sistema reconoce rostro → `validating face with: 1122509143`
3. `main.py` detecta `matching: True`
4. Llama a `POST http://localhost:5000/api/facial-auth`
5. API busca empleado en Supabase por `employee_code`
6. Registra asistencia en tabla `attendance_record`
7. Genera token temporal y abre navegador
8. URL: `http://localhost:5173/facial-login?token=xxx&employee_id=123`
9. `FacialLogin.jsx` valida token
10. Crea sesión en localStorage
11. Redirige a `/dashboard` ✅

### Método 2: Login Manual (Auth0)

1. Usuario va a `http://localhost:5173`
2. Click en "Login"
3. Autenticación Auth0 tradicional
4. Acceso al dashboard ✅

## 📝 Registro de Empleados

### Requisito: Mismo Código en Ambos Sistemas

**En Supabase (Base de Datos Web):**
```sql
INSERT INTO employee (first_name, last_name, employee_code, position, department)
VALUES ('Juan', 'Pérez', '001', 'Desarrollador', 'TI');
```

**En Sistema Local (Reconocimiento Facial):**
1. Ejecutar `examples/example.py`
2. Click en "Sign Up"
3. Ingresar:
   - Nombre: `Juan Pérez`
   - Código: `001` (DEBE COINCIDIR)
4. Capturar rostro

## 🔍 Verificación

### Verificar Sincronización

```bash
cd Facial-recognition
python sync_employees.py
```

Selecciona opción 1 para ver el estado de sincronización.

### Verificar Base de Datos

```bash
# Ver empleados registrados localmente
dir Facial-recognition/process/database/users

# Ver contenido de un empleado
type Facial-recognition/process/database/users/001.txt
# Debe mostrar: Juan Pérez,001,
```

## 🛡️ Seguridad

### Tokens Temporales

- Los tokens de reconocimiento facial son temporales
- Se generan con hash SHA-256
- Incluyen timestamp para validación

### Sesiones

- Sesiones faciales expiran después de 12 horas
- Se almacenan en localStorage
- Incluyen información del empleado y timestamp

### Row Level Security (RLS)

- Todas las tablas de Supabase tienen RLS habilitado
- Políticas de acceso basadas en roles
- Auditoria de acciones críticas

## ⚠️ Troubleshooting

### Problema: "No se pudo conectar con la API"
**Solución:** Asegúrate de que `api_bridge.py` esté corriendo

### Problema: "Usuario reconocido pero no registrado"
**Solución:** Verifica que el `employee_code` coincida en ambos sistemas

### Problema: "No face mesh detected"
**Solución:** 
- Mejora la iluminación
- Centra tu rostro en la cámara
- Mantén distancia de 50-70cm

### Problema: "Empleado no encontrado en Supabase"
**Solución:** Registra el empleado en Supabase primero

## 📊 Tablas de Base de Datos Usadas

### `employee`
- Almacena información de empleados
- Campo clave: `employee_code` (debe coincidir con sistema local)

### `attendance_record`
- Registros de entrada/salida
- Se crea automáticamente al reconocer rostro
- Campos: `employee_id`, `date`, `check_in`, `check_out`, `source_terminal`

### `biometric_data` (opcional futuro)
- Almacenar vectores faciales en Supabase
- Permitiría reconocimiento sin archivos locales

## 🔑 Código del API Bridge

Crea `Facial-recognition/api_bridge.py`:

```python
from flask import Flask, jsonify, request
import webbrowser
from datetime import datetime
from supabase import create_client
import os
from dotenv import load_dotenv
import secrets
import hashlib

load_dotenv()

app = Flask(__name__)

# Configuración Supabase
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("❌ Falta configurar SUPABASE_URL y SUPABASE_KEY en .env")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# URL de tu aplicación web
WEBAPP_URL = "http://localhost:5173"

@app.route('/api/facial-auth', methods=['POST'])
def facial_authentication():
    """
    Endpoint que recibe el reconocimiento facial exitoso
    """
    try:
        data = request.json
        employee_code = data.get('employee_code')
        name = data.get('name')
        confidence = data.get('confidence', 0.0)
        
        print(f"\n✅ Recibida petición de autenticación facial")
        print(f"  Código: {employee_code}")
        print(f"  Nombre: {name}")
        print(f"  Confianza: {confidence}")
        
        # 1. Buscar empleado en Supabase por employee_code
        employee_response = supabase.table('employee')\
            .select('id, first_name, last_name, user_id, employee_code, position, department')\
            .eq('employee_code', employee_code)\
            .single()\
            .execute()
        
        if not employee_response.data:
            print(f"❌ Empleado no encontrado en Supabase: {employee_code}")
            return jsonify({'error': 'Empleado no encontrado'}), 404
        
        employee = employee_response.data
        employee_id = employee['id']
        
        print(f"✅ Empleado encontrado en Supabase:")
        print(f"  ID: {employee_id}")
        print(f"  Nombre: {employee['first_name']} {employee['last_name']}")
        
        # 2. Verificar si ya existe registro de asistencia hoy
        today = datetime.now().date()
        attendance_check = supabase.table('attendance_record')\
            .select('id, check_in, check_out')\
            .eq('employee_id', employee_id)\
            .eq('date', today.isoformat())\
            .execute()
        
        # 3. Registrar entrada o salida
        current_time = datetime.now().time()
        
        if not attendance_check.data:
            # Primera entrada del día
            result = supabase.table('attendance_record').insert({
                'employee_id': employee_id,
                'date': today.isoformat(),
                'check_in': current_time.isoformat(),
                'source_terminal': 'facial_recognition_terminal',
                'status': True
            }).execute()
            action = 'entrada'
            print(f"✅ Registro de entrada creado")
        else:
            # Ya tiene entrada, registrar salida
            attendance_id = attendance_check.data[0]['id']
            if not attendance_check.data[0].get('check_out'):
                supabase.table('attendance_record')\
                    .update({'check_out': current_time.isoformat()})\
                    .eq('id', attendance_id)\
                    .execute()
                action = 'salida'
                print(f"✅ Registro de salida actualizado")
            else:
                # Ya tiene entrada y salida, crear nuevo registro
                result = supabase.table('attendance_record').insert({
                    'employee_id': employee_id,
                    'date': today.isoformat(),
                    'check_in': current_time.isoformat(),
                    'source_terminal': 'facial_recognition_terminal',
                    'status': True
                }).execute()
                action = 'entrada (nuevo registro)'
                print(f"✅ Nuevo registro de entrada creado")
        
        # 4. Generar token de sesión temporal
        session_token = generate_session_token(employee_code)
        
        # 5. Abrir navegador con autenticación automática
        auth_url = f"{WEBAPP_URL}/facial-login?token={session_token}&employee_id={employee_id}"
        print(f"\n🌐 Abriendo navegador: {auth_url}")
        webbrowser.open(auth_url)
        
        response_data = {
            'success': True,
            'employee': {
                'id': employee_id,
                'name': f"{employee['first_name']} {employee['last_name']}",
                'code': employee_code,
                'position': employee.get('position'),
                'department': employee.get('department')
            },
            'action': action,
            'timestamp': datetime.now().isoformat()
        }
        
        print(f"✅ Proceso completado exitosamente\n")
        return jsonify(response_data), 200
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

def generate_session_token(employee_code):
    """Genera token temporal para autenticación"""
    timestamp = str(datetime.now().timestamp())
    token_raw = f"{employee_code}:{timestamp}:{secrets.token_hex(16)}"
    return hashlib.sha256(token_raw.encode()).hexdigest()

@app.route('/api/health', methods=['GET'])
def health_check():
    """Endpoint de verificación de salud"""
    return jsonify({
        'status': 'ok',
        'service': 'facial-recognition-api-bridge',
        'timestamp': datetime.now().isoformat()
    }), 200

if __name__ == '__main__':
    print("✨ Iniciando API Bridge para Reconocimiento Facial")
    print(f"SUPABASE_URL: {SUPABASE_URL}")
    print(f"WEBAPP_URL: {WEBAPP_URL}")
    print("\n🚀 Servidor corriendo en http://localhost:5000\n")
    app.run(host='0.0.0.0', port=5000, debug=True)
```

## 📋 Código de Sincronización

Crea `Facial-recognition/sync_employees.py` (ver documentación anterior).

## ✅ Testing

### Test 1: Verificar API Bridge

```bash
curl http://localhost:5000/api/health
```

Debe responder:
```json
{"status": "ok", "service": "facial-recognition-api-bridge"}
```

### Test 2: Reconocimiento Facial

1. Ejecutar sistema completo (3 terminales)
2. Click en "Login" en la interfaz gráfica
3. Posicionarse frente a la cámara
4. Esperar reconocimiento
5. Verificar:
   - Console muestra: "✓ ¡RECONOCIMIENTO EXITOSO!"
   - Navegador se abre automáticamente
   - Redirección a dashboard sin Auth0

### Test 3: Registro de Asistencia

```sql
-- En Supabase SQL Editor
SELECT 
  ar.*,
  e.first_name,
  e.last_name,
  e.employee_code
FROM attendance_record ar
JOIN employee e ON ar.employee_id = e.id
ORDER BY ar.date DESC, ar.check_in DESC
LIMIT 10;
```

## 👥 Soporte Multi-Usuario

El sistema soporta múltiples empleados:

```
Empleado 1 (Código 001) → Reconoce → Registra → Dashboard
Empleado 2 (Código 002) → Reconoce → Registra → Dashboard
Empleado 3 (Código 003) → Reconoce → Registra → Dashboard
```

Cada usuario:
- Tiene su propio archivo `.txt` y `.jpg`
- Registro independiente en Supabase
- Sesión individual en el navegador

## 📊 Logs y Debug

### API Bridge Logs

```
✅ Recibida petición de autenticación facial
  Código: 001
  Nombre: Juan Pérez
✅ Empleado encontrado en Supabase
✅ Registro de entrada creado
🌐 Abriendo navegador
✅ Proceso completado exitosamente
```

### Sistema de Reconocimiento Logs

```
validating face with: 001
matching: True distance: 0.13

[DEBUG] Info recibido: 'Approved user access!'
[DEBUG] ¡Reconocimiento exitoso detectado!
[DEBUG] Usando código reconocido: 001
[DEBUG] Enviando a API - código: 001, nombre: Juan Pérez

✓ ¡RECONOCIMIENTO EXITOSO!
  Empleado: Juan Pérez
  Código: 001
  Acción: entrada
```

## 📖 Próximos Pasos

- [ ] Almacenar vectores faciales en Supabase
- [ ] Dashboard con estadísticas de asistencia facial
- [ ] Notificaciones push al reconocer usuario
- [ ] Integración con hardware biométrico físico
- [ ] Módulo de reportes de reconocimiento facial

## 👥 Autores

- Sistema de Reconocimiento Facial: [Facial-recognition](https://github.com/miguelF21/Facial-recognition)
- Plataforma Web FacePay: [Facepay](https://github.com/miguelF21/Facepay)
- Integración: Miguel F21

---

**Versión:** 1.0.0  
**Última actualización:** Noviembre 2025
