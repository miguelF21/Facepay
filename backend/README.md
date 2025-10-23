# FacePay API - Backend Django

Backend API REST para el sistema de gestión de asistencia biométrica facial FacePay.

## Tecnologías

- **Django 5.0.1**: Framework web principal
- **Django REST Framework**: API REST
- **PostgreSQL**: Base de datos (via Supabase)
- **Supabase**: Gestión de base de datos y autenticación

## Estructura del Proyecto

```
backend/
├── facepay_api/           # Configuración principal del proyecto
│   ├── settings.py        # Configuración de Django
│   ├── urls.py            # URLs principales
│   ├── wsgi.py            # Configuración WSGI
│   └── api/               # Aplicación API
│       ├── models.py      # Modelos de datos
│       ├── serializers.py # Serializadores REST
│       ├── views.py       # Vistas/ViewSets
│       ├── admin.py       # Configuración del panel admin
│       └── supabase_client.py  # Cliente de Supabase
├── manage.py              # Script de gestión Django
├── requirements.txt       # Dependencias Python
└── .env.example          # Variables de entorno de ejemplo
```

## Instalación

### 1. Instalar dependencias

```bash
pip install -r requirements.txt
```

### 2. Configurar variables de entorno

Copiar `.env.example` a `.env` y configurar con los valores de tu proyecto Supabase:

```bash
cp .env.example .env
```

Editar `.env` con tus credenciales de Supabase.

### 3. Verificar modelos

Los modelos están configurados para usar las tablas existentes en Supabase (no se necesitan migraciones de Django):

```bash
python manage.py check
```

### 4. Ejecutar el servidor

```bash
python manage.py runserver
```

El servidor estará disponible en: `http://localhost:8000`

## API Endpoints

Todos los endpoints están bajo `/api/`:

### Usuarios y Roles
- `GET/POST /api/usuarios/` - Lista/Crea usuarios
- `GET/PUT/DELETE /api/usuarios/{id}/` - Detalle/Actualiza/Elimina usuario
- `GET/POST /api/empleados/` - Empleados
- `GET/POST /api/contactos/` - Información de contacto
- `GET/POST /api/direcciones/` - Direcciones

### Control de Acceso
- `GET/POST /api/terminales/` - Terminales biométricas
- `GET/POST /api/datos-biometricos/` - Datos biométricos
- `GET/POST /api/intentos-acceso/` - Intentos de acceso
- `GET/POST /api/resultados-reconocimiento/` - Resultados de reconocimiento

### Asistencia y Nómina
- `GET/POST /api/registros-asistencia/` - Registros de asistencia
- `GET/POST /api/registros-nomina/` - Registros de nómina
- `GET/POST /api/conceptos/` - Conceptos de nómina
- `GET/POST /api/recibos-pago/` - Recibos de pago

### Sistema
- `GET/POST /api/reportes/` - Reportes
- `GET/POST /api/configuracion-sistema/` - Configuración del sistema
- `GET /api/auditoria/` - Registros de auditoría

## Características

### Filtros y Búsqueda

Todos los endpoints soportan filtros, búsqueda y ordenamiento:

```bash
# Filtrar empleados por departamento
GET /api/empleados/?departamento=TI

# Buscar empleados por nombre
GET /api/empleados/?search=Juan

# Ordenar por código de empleado
GET /api/empleados/?ordering=codigo_empleado
```

### Paginación

Resultados paginados automáticamente (100 por página):

```json
{
  "count": 250,
  "next": "http://localhost:8000/api/empleados/?page=2",
  "previous": null,
  "results": [...]
}
```

### Relaciones Anidadas

Los serializadores incluyen datos relacionados:

```json
{
  "id": 1,
  "nombres": "Juan",
  "apellidos": "Pérez",
  "contacto": {
    "telefono": "555-1234",
    "correo": "juan@example.com"
  },
  "direccion": {
    "calle": "Calle 123",
    "ciudad": "Bogotá"
  }
}
```

## Panel de Administración

Django Admin disponible en: `http://localhost:8000/admin/`

Para crear un superusuario:

```bash
python manage.py createsuperuser
```

## Integración con Supabase

El proyecto utiliza Supabase para:
- **Base de datos PostgreSQL**: Todas las tablas están en Supabase
- **Row Level Security (RLS)**: Políticas de seguridad configuradas
- **Cliente Python**: Para operaciones avanzadas con Supabase

## CORS

Configurado para permitir conexiones desde:
- `http://localhost:5173` (Vite)
- `http://localhost:3000` (React/Next.js)

## Notas de Seguridad

- En producción, cambiar `DEBUG=False`
- Configurar `ALLOWED_HOSTS` apropiadamente
- Usar una `SECRET_KEY` segura
- Las políticas RLS de Supabase protegen los datos
