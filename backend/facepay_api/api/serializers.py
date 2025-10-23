from rest_framework import serializers
from .models import (
    Usuario, Administrador, Operador, Empleado, InfoContacto, Direccion,
    Terminal, DatosBiometricos, IntentoAcceso, ResultadoReconocimiento,
    RegistroAsistencia, RegistroNomina, Concepto, ReciboPago,
    Reporte, ConfigSistema, RegistroAuditoria, TokenAutenticacion
)


class InfoContactoSerializer(serializers.ModelSerializer):
    class Meta:
        model = InfoContacto
        fields = '__all__'


class DireccionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Direccion
        fields = '__all__'


class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'nombre_usuario', 'correo', 'rol', 'creado_en', 'actualizado_en', 'activo']
        read_only_fields = ['id', 'creado_en', 'actualizado_en']


class AdministradorSerializer(serializers.ModelSerializer):
    usuario = UsuarioSerializer(source='id_usuario', read_only=True)

    class Meta:
        model = Administrador
        fields = '__all__'


class OperadorSerializer(serializers.ModelSerializer):
    usuario = UsuarioSerializer(source='id_usuario', read_only=True)

    class Meta:
        model = Operador
        fields = '__all__'


class EmpleadoSerializer(serializers.ModelSerializer):
    contacto = InfoContactoSerializer(source='id_contacto', read_only=True)
    direccion = DireccionSerializer(source='id_direccion', read_only=True)
    usuario = UsuarioSerializer(source='id_usuario', read_only=True)

    class Meta:
        model = Empleado
        fields = '__all__'


class TerminalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Terminal
        fields = '__all__'


class DatosBiometricosSerializer(serializers.ModelSerializer):
    empleado = EmpleadoSerializer(source='id_empleado', read_only=True)
    terminal = TerminalSerializer(source='id_terminal', read_only=True)

    class Meta:
        model = DatosBiometricos
        fields = '__all__'


class IntentoAccesoSerializer(serializers.ModelSerializer):
    terminal = TerminalSerializer(source='id_terminal', read_only=True)
    empleado = EmpleadoSerializer(source='referencia_empleado', read_only=True)

    class Meta:
        model = IntentoAcceso
        fields = '__all__'


class ResultadoReconocimientoSerializer(serializers.ModelSerializer):
    empleado = EmpleadoSerializer(source='id_empleado', read_only=True)
    intento = IntentoAccesoSerializer(source='id_intento', read_only=True)

    class Meta:
        model = ResultadoReconocimiento
        fields = '__all__'


class RegistroAsistenciaSerializer(serializers.ModelSerializer):
    empleado = EmpleadoSerializer(source='id_empleado', read_only=True)

    class Meta:
        model = RegistroAsistencia
        fields = '__all__'


class ConceptoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Concepto
        fields = '__all__'


class RegistroNominaSerializer(serializers.ModelSerializer):
    empleado = EmpleadoSerializer(source='id_empleado', read_only=True)
    conceptos = ConceptoSerializer(many=True, read_only=True)

    class Meta:
        model = RegistroNomina
        fields = '__all__'


class ReciboPagoSerializer(serializers.ModelSerializer):
    nomina = RegistroNominaSerializer(source='id_nomina', read_only=True)
    empleado = EmpleadoSerializer(source='id_empleado', read_only=True)

    class Meta:
        model = ReciboPago
        fields = '__all__'


class ReporteSerializer(serializers.ModelSerializer):
    administrador = AdministradorSerializer(source='id_admin', read_only=True)

    class Meta:
        model = Reporte
        fields = '__all__'


class ConfigSistemaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConfigSistema
        fields = '__all__'


class RegistroAuditoriaSerializer(serializers.ModelSerializer):
    usuario = UsuarioSerializer(source='id_usuario', read_only=True)

    class Meta:
        model = RegistroAuditoria
        fields = '__all__'


class TokenAutenticacionSerializer(serializers.ModelSerializer):
    usuario = UsuarioSerializer(source='id_usuario', read_only=True)

    class Meta:
        model = TokenAutenticacion
        fields = '__all__'
