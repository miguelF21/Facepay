# 🚀 Guía Rápida: Reconocimiento Facial

## ⏱️ Configuración en 5 Minutos

### Paso 1: Actualizar .env de Facepay

Agrega esta línea a tu archivo `.env`:

```env
VITE_FACIAL_AUTH_SECRET=facial_auth_secret_2024_facepay_xk9j2m4p8q1w5e7r
```

Tu `.env` completo debe verse así:

```env
VITE_AUTH0_DOMAIN=dev-whrxbulkwlxu1gbp.us.auth0.com
VITE_AUTH0_CLIENT_ID=5IYmUDEsnSjR1XfHwYAlFhJpAogg7ixJ
VITE_SUPABASE_URL=https://zypyviskemdvvqnjnnui.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5cHl2aXNrZW1kdnZxbmpubnVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyMjM5MTcsImV4cCI6MjA3Njc5OTkxN30.S9jUQsW_jMwYJd1zxXbLJEYZfvnxdDLMMVgLHQT1WpA
VITE_AUTH0_AUDIENCE=https://dev-whrxbulkwlxu1gbp.us.auth0.com/api/v2/
VITE_AUTH0_CALLBACK_URL=http://localhost:5173
VITE_FACIAL_AUTH_SECRET=facial_auth_secret_2024_facepay_xk9j2m4p8q1w5e7r
```

### Paso 2: Actualizar Código Frontend

```bash
cd Facepay
git checkout feature/facial-recognition-integration
git pull origin feature/facial-recognition-integration
npm install
```

### Paso 3: Crear API Bridge en Facial-recognition

**Crear archivo:** `Facial-recognition/api_bridge.py`

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

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("❌ Configurar SUPABASE_URL y SUPABASE_KEY en .env")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
WEBAPP_URL = "http://localhost:5173"

@app.route('/api/facial-auth', methods=['POST'])
def facial_authentication():
    try:
        data = request.json
        employee_code = data.get('employee_code')
        name = data.get('name')
        
        print(f"\n✅ Autenticación facial: {name} (código: {employee_code})")
        
        # Buscar empleado
        employee_response = supabase.table('employee')\
            .select('id, first_name, last_name')\
            .eq('employee_code', employee_code)\
            .single()\
            .execute()
        
        if not employee_response.data:
            return jsonify({'error': 'Empleado no encontrado'}), 404
        
        employee = employee_response.data
        employee_id = employee['id']
        
        # Registrar asistencia
        today = datetime.now().date()
        current_time = datetime.now().time()
        
        attendance_check = supabase.table('attendance_record')\
            .select('id, check_out')\
            .eq('employee_id', employee_id)\
            .eq('date', today.isoformat())\
            .execute()
        
        if not attendance_check.data:
            supabase.table('attendance_record').insert({
                'employee_id': employee_id,
                'date': today.isoformat(),
                'check_in': current_time.isoformat(),
                'source_terminal': 'facial_recognition_terminal',
                'status': True
            }).execute()
            action = 'entrada'
        else:
            if not attendance_check.data[0].get('check_out'):
                supabase.table('attendance_record')\
                    .update({'check_out': current_time.isoformat()})\
                    .eq('id', attendance_check.data[0]['id'])\
                    .execute()
                action = 'salida'
            else:
                supabase.table('attendance_record').insert({
                    'employee_id': employee_id,
                    'date': today.isoformat(),
                    'check_in': current_time.isoformat(),
                    'source_terminal': 'facial_recognition_terminal',
                    'status': True
                }).execute()
                action = 'entrada'
        
        # Generar token y abrir navegador
        token = hashlib.sha256(f"{employee_code}:{datetime.now().timestamp()}:{secrets.token_hex(16)}".encode()).hexdigest()
        auth_url = f"{WEBAPP_URL}/facial-login?token={token}&employee_id={employee_id}"
        
        print(f"🌐 Abriendo dashboard para {name}")
        webbrowser.open(auth_url)
        
        return jsonify({
            'success': True,
            'employee': {'name': f"{employee['first_name']} {employee['last_name']}", 'code': employee_code},
            'action': action,
            'timestamp': datetime.now().isoformat()
        }), 200
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok'}), 200

if __name__ == '__main__':
    print("✨ API Bridge corriendo en http://localhost:5000\n")
    app.run(host='0.0.0.0', port=5000, debug=True)
```

### Paso 4: Configurar .env en Facial-recognition

**Crear archivo:** `Facial-recognition/.env`

```env
SUPABASE_URL=https://zypyviskemdvvqnjnnui.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5cHl2aXNrZW1kdnZxbmpubnVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyMjM5MTcsImV4cCI6MjA3Njc5OTkxN30.S9jUQsW_jMwYJd1zxXbLJEYZfvnxdDLMMVgLHQT1WpA
```

### Paso 5: Instalar Dependencias

**En Facial-recognition:**
```bash
cd Facial-recognition
pip install Flask supabase python-dotenv requests
```

**En Facepay:**
```bash
cd Facepay
npm install
```

## ▶️ Ejecutar Todo

Abrir 3 terminales:

### Terminal 1: API Bridge
```bash
cd Facial-recognition
python api_bridge.py
```

Espera ver:
```
✨ API Bridge corriendo en http://localhost:5000
```

### Terminal 2: Sistema de Reconocimiento
```bash
cd Facial-recognition/examples
python example.py
```

Espera ver la interfaz gráfica.

### Terminal 3: Frontend Web
```bash
cd Facepay
npm run dev
```

Espera ver:
```
Local: http://localhost:5173/
```

## ✅ Probar el Sistema

1. **Click en "Login"** en la interfaz de reconocimiento facial
2. **Párate frente a la cámara** (bien iluminado, centrado)
3. **Espera el reconocimiento** (2-5 segundos)
4. **El navegador se abrirá automáticamente**
5. **Serás redirigido al dashboard** 🎉

## ⚡ Verificación Rápida

### ¿Funciona la API?
```bash
curl http://localhost:5000/api/health
```

### ¿Está registrado el empleado?
```bash
dir Facial-recognition\process\database\users\1122509143.txt
```

### ¿Hay registro en Supabase?
```sql
SELECT * FROM employee WHERE employee_code = '1122509143';
```

## 🐛 Problemas Comunes

### "No se pudo conectar con la API"
➡️ Asegúrate de que `python api_bridge.py` esté corriendo

### "Empleado no encontrado"
➡️ Verifica que el `employee_code` coincida en ambos sistemas

### "No face mesh detected"
➡️ Mejora iluminación y centra tu rostro

### El navegador no se abre
➡️ Verifica que `WEBAPP_URL` en `api_bridge.py` sea correcto

## 🎉 ¡Listo!

Ahora puedes autenticarte de dos formas:

1. **Reconocimiento Facial** 💁 (terminal biométrico)
2. **Auth0 Manual** 🔑 (login tradicional)

Ambos métodos son completamente funcionales y no interfieren entre sí.

---

**¿Preguntas?** Ver documentación completa en `FACIAL_RECOGNITION_INTEGRATION.md`
