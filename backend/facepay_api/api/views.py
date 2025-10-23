from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import (
    Usuario, Administrador, Operador, Empleado, InfoContacto, Direccion,
    Terminal, DatosBiometricos, IntentoAcceso, ResultadoReconocimiento,
    RegistroAsistencia, RegistroNomina, Concepto, ReciboPago,
    Reporte, ConfigSistema, RegistroAuditoria, TokenAutenticacion
)
from .serializers import (
    UsuarioSerializer, AdministradorSerializer, OperadorSerializer,
    EmpleadoSerializer, InfoContactoSerializer, DireccionSerializer,
    TerminalSerializer, DatosBiometricosSerializer, IntentoAccesoSerializer,
    ResultadoReconocimientoSerializer, RegistroAsistenciaSerializer,
    RegistroNominaSerializer, ConceptoSerializer, ReciboPagoSerializer,
    ReporteSerializer, ConfigSistemaSerializer, RegistroAuditoriaSerializer,
    TokenAutenticacionSerializer
)


class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['rol', 'activo']
    search_fields = ['nombre_usuario', 'correo']
    ordering_fields = ['creado_en', 'nombre_usuario']


class InfoContactoViewSet(viewsets.ModelViewSet):
    queryset = InfoContacto.objects.all()
    serializer_class = InfoContactoSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['telefono', 'correo']


class DireccionViewSet(viewsets.ModelViewSet):
    queryset = Direccion.objects.all()
    serializer_class = DireccionSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['ciudad', 'estado']
    search_fields = ['calle', 'ciudad', 'estado']


class EmpleadoViewSet(viewsets.ModelViewSet):
    queryset = Empleado.objects.select_related('id_usuario', 'id_contacto', 'id_direccion').all()
    serializer_class = EmpleadoSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['cargo', 'departamento', 'tipo_documento']
    search_fields = ['nombres', 'apellidos', 'codigo_empleado', 'numero_documento']
    ordering_fields = ['nombres', 'apellidos', 'codigo_empleado']


class TerminalViewSet(viewsets.ModelViewSet):
    queryset = Terminal.objects.all()
    serializer_class = TerminalSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['estado', 'ubicacion']
    search_fields = ['ubicacion', 'direccion_ip']


class DatosBiometricosViewSet(viewsets.ModelViewSet):
    queryset = DatosBiometricos.objects.select_related('id_empleado', 'id_terminal').all()
    serializer_class = DatosBiometricosSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['tipo', 'id_empleado', 'id_terminal']
    ordering_fields = ['registrado_en']


class IntentoAccesoViewSet(viewsets.ModelViewSet):
    queryset = IntentoAcceso.objects.select_related('id_terminal', 'referencia_empleado').all()
    serializer_class = IntentoAccesoSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['resultado', 'metodo', 'id_terminal', 'referencia_empleado']
    ordering_fields = ['fecha_hora']


class ResultadoReconocimientoViewSet(viewsets.ModelViewSet):
    queryset = ResultadoReconocimiento.objects.select_related('id_empleado', 'id_intento').all()
    serializer_class = ResultadoReconocimientoSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['coincidencia', 'id_empleado']
    ordering_fields = ['fecha_hora', 'confianza']


class RegistroAsistenciaViewSet(viewsets.ModelViewSet):
    queryset = RegistroAsistencia.objects.select_related('id_empleado').all()
    serializer_class = RegistroAsistenciaSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['id_empleado', 'fecha', 'estado']
    ordering_fields = ['fecha', 'hora_entrada']


class RegistroNominaViewSet(viewsets.ModelViewSet):
    queryset = RegistroNomina.objects.select_related('id_empleado').all()
    serializer_class = RegistroNominaSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['id_empleado', 'inicio_periodo', 'fin_periodo']
    ordering_fields = ['inicio_periodo', 'fin_periodo']


class ConceptoViewSet(viewsets.ModelViewSet):
    queryset = Concepto.objects.select_related('id_nomina').all()
    serializer_class = ConceptoSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['id_nomina']
    search_fields = ['codigo', 'descripcion']


class ReciboPagoViewSet(viewsets.ModelViewSet):
    queryset = ReciboPago.objects.select_related('id_nomina', 'id_empleado').all()
    serializer_class = ReciboPagoSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['id_empleado', 'id_nomina']
    ordering_fields = ['generado_en']


class ReporteViewSet(viewsets.ModelViewSet):
    queryset = Reporte.objects.select_related('id_admin').all()
    serializer_class = ReporteSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['titulo']
    ordering_fields = ['generado_en']


class ConfigSistemaViewSet(viewsets.ModelViewSet):
    queryset = ConfigSistema.objects.all()
    serializer_class = ConfigSistemaSerializer


class RegistroAuditoriaViewSet(viewsets.ModelViewSet):
    queryset = RegistroAuditoria.objects.select_related('id_usuario').all()
    serializer_class = RegistroAuditoriaSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['id_usuario']
    search_fields = ['accion']
    ordering_fields = ['fecha_hora']
