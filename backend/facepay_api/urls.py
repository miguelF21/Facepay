from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from api import views

router = routers.DefaultRouter()
router.register(r'usuarios', views.UsuarioViewSet)
router.register(r'empleados', views.EmpleadoViewSet)
router.register(r'contactos', views.InfoContactoViewSet)
router.register(r'direcciones', views.DireccionViewSet)
router.register(r'terminales', views.TerminalViewSet)
router.register(r'datos-biometricos', views.DatosBiometricosViewSet)
router.register(r'intentos-acceso', views.IntentoAccesoViewSet)
router.register(r'resultados-reconocimiento', views.ResultadoReconocimientoViewSet)
router.register(r'registros-asistencia', views.RegistroAsistenciaViewSet)
router.register(r'registros-nomina', views.RegistroNominaViewSet)
router.register(r'conceptos', views.ConceptoViewSet)
router.register(r'recibos-pago', views.ReciboPagoViewSet)
router.register(r'reportes', views.ReporteViewSet)
router.register(r'configuracion-sistema', views.ConfigSistemaViewSet)
router.register(r'auditoria', views.RegistroAuditoriaViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework'))
]
