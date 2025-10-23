from django.db import models


class InfoContacto(models.Model):
    id = models.AutoField(primary_key=True)
    telefono = models.CharField(max_length=16, null=True, blank=True)
    correo = models.CharField(max_length=40, null=True, blank=True)

    class Meta:
        db_table = 'info_contacto'
        verbose_name = 'Información de Contacto'
        verbose_name_plural = 'Información de Contactos'

    def __str__(self):
        return f"{self.correo} - {self.telefono}"


class Direccion(models.Model):
    id = models.AutoField(primary_key=True)
    calle = models.CharField(max_length=72, null=True, blank=True)
    ciudad = models.CharField(max_length=32, null=True, blank=True)
    estado = models.CharField(max_length=32, null=True, blank=True)
    codigo_postal = models.CharField(max_length=16, null=True, blank=True)

    class Meta:
        db_table = 'direccion'
        verbose_name = 'Dirección'
        verbose_name_plural = 'Direcciones'

    def __str__(self):
        return f"{self.calle}, {self.ciudad}"


class Usuario(models.Model):
    id = models.AutoField(primary_key=True)
    nombre_usuario = models.CharField(max_length=64, null=True, blank=True)
    correo = models.CharField(max_length=72, unique=True)
    contrasena_hash = models.CharField(max_length=64, null=True, blank=True)
    rol = models.CharField(max_length=64, default='empleado')
    creado_en = models.DateTimeField(auto_now_add=True)
    actualizado_en = models.DateTimeField(auto_now=True)
    activo = models.BooleanField(default=True)

    class Meta:
        db_table = 'usuario'
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'

    def __str__(self):
        return f"{self.nombre_usuario} ({self.rol})"


class Administrador(models.Model):
    id_usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE, primary_key=True, db_column='id_usuario')

    class Meta:
        db_table = 'administrador'
        verbose_name = 'Administrador'
        verbose_name_plural = 'Administradores'

    def __str__(self):
        return f"Admin: {self.id_usuario.nombre_usuario}"


class Operador(models.Model):
    id_usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE, primary_key=True, db_column='id_usuario')

    class Meta:
        db_table = 'operador'
        verbose_name = 'Operador'
        verbose_name_plural = 'Operadores'

    def __str__(self):
        return f"Operador: {self.id_usuario.nombre_usuario}"


class Empleado(models.Model):
    id = models.AutoField(primary_key=True)
    id_usuario = models.ForeignKey(Usuario, on_delete=models.SET_NULL, null=True, blank=True, db_column='id_usuario')
    nombres = models.CharField(max_length=40, null=True, blank=True)
    apellidos = models.CharField(max_length=40, null=True, blank=True)
    tipo_documento = models.CharField(max_length=64, null=True, blank=True)
    numero_documento = models.IntegerField(null=True, blank=True)
    cargo = models.CharField(max_length=64, null=True, blank=True)
    departamento = models.CharField(max_length=64, null=True, blank=True)
    codigo_empleado = models.CharField(max_length=16, unique=True, null=True, blank=True)
    id_contacto = models.ForeignKey(InfoContacto, on_delete=models.SET_NULL, null=True, blank=True, db_column='id_contacto')
    id_direccion = models.ForeignKey(Direccion, on_delete=models.SET_NULL, null=True, blank=True, db_column='id_direccion')

    class Meta:
        db_table = 'empleado'
        verbose_name = 'Empleado'
        verbose_name_plural = 'Empleados'

    def __str__(self):
        return f"{self.nombres} {self.apellidos} - {self.codigo_empleado}"


class Terminal(models.Model):
    id = models.AutoField(primary_key=True)
    ubicacion = models.CharField(max_length=64, null=True, blank=True)
    direccion_ip = models.CharField(max_length=64, null=True, blank=True)
    version_firmware = models.CharField(max_length=32, null=True, blank=True)
    estado = models.CharField(max_length=32, default='activo')

    class Meta:
        db_table = 'terminal'
        verbose_name = 'Terminal'
        verbose_name_plural = 'Terminales'

    def __str__(self):
        return f"Terminal {self.ubicacion} - {self.direccion_ip}"


class DatosBiometricos(models.Model):
    id = models.AutoField(primary_key=True)
    tipo = models.CharField(max_length=64, null=True, blank=True)
    vector = models.TextField(null=True, blank=True)
    registrado_en = models.DateTimeField(auto_now_add=True)
    id_terminal = models.ForeignKey(Terminal, on_delete=models.SET_NULL, null=True, blank=True, db_column='id_terminal')
    id_empleado = models.ForeignKey(Empleado, on_delete=models.CASCADE, db_column='id_empleado')

    class Meta:
        db_table = 'datos_biometricos'
        verbose_name = 'Dato Biométrico'
        verbose_name_plural = 'Datos Biométricos'

    def __str__(self):
        return f"{self.tipo} - {self.id_empleado}"


class IntentoAcceso(models.Model):
    id = models.AutoField(primary_key=True)
    id_terminal = models.ForeignKey(Terminal, on_delete=models.SET_NULL, null=True, blank=True, db_column='id_terminal')
    fecha_hora = models.DateTimeField(auto_now_add=True)
    metodo = models.CharField(max_length=16, null=True, blank=True)
    resultado = models.CharField(max_length=16, null=True, blank=True)
    referencia_empleado = models.ForeignKey(Empleado, on_delete=models.SET_NULL, null=True, blank=True, db_column='referencia_empleado')

    class Meta:
        db_table = 'intento_acceso'
        verbose_name = 'Intento de Acceso'
        verbose_name_plural = 'Intentos de Acceso'

    def __str__(self):
        return f"Acceso {self.resultado} - {self.fecha_hora}"


class ResultadoReconocimiento(models.Model):
    id = models.AutoField(primary_key=True)
    coincidencia = models.BooleanField(null=True, blank=True)
    id_empleado = models.ForeignKey(Empleado, on_delete=models.SET_NULL, null=True, blank=True, db_column='id_empleado')
    confianza = models.FloatField(null=True, blank=True)
    fecha_hora = models.DateTimeField(auto_now_add=True)
    id_intento = models.ForeignKey(IntentoAcceso, on_delete=models.CASCADE, db_column='id_intento')

    class Meta:
        db_table = 'resultado_reconocimiento'
        verbose_name = 'Resultado de Reconocimiento'
        verbose_name_plural = 'Resultados de Reconocimiento'

    def __str__(self):
        return f"Reconocimiento {self.coincidencia} - Confianza: {self.confianza}"


class RegistroAsistencia(models.Model):
    id = models.AutoField(primary_key=True)
    id_empleado = models.ForeignKey(Empleado, on_delete=models.CASCADE, db_column='id_empleado')
    fecha = models.DateField(auto_now_add=True)
    hora_entrada = models.TimeField(null=True, blank=True)
    hora_salida = models.TimeField(null=True, blank=True)
    terminal_origen = models.CharField(max_length=64, null=True, blank=True)
    estado = models.BooleanField(default=True)

    class Meta:
        db_table = 'registro_asistencia'
        verbose_name = 'Registro de Asistencia'
        verbose_name_plural = 'Registros de Asistencia'

    def __str__(self):
        return f"{self.id_empleado} - {self.fecha}"


class RegistroNomina(models.Model):
    id = models.AutoField(primary_key=True)
    id_empleado = models.ForeignKey(Empleado, on_delete=models.CASCADE, db_column='id_empleado')
    inicio_periodo = models.DateField(null=True, blank=True)
    fin_periodo = models.DateField(null=True, blank=True)
    salario_bruto = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    deducciones = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    salario_neto = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)

    class Meta:
        db_table = 'registro_nomina'
        verbose_name = 'Registro de Nómina'
        verbose_name_plural = 'Registros de Nómina'

    def __str__(self):
        return f"{self.id_empleado} - {self.inicio_periodo} a {self.fin_periodo}"


class Concepto(models.Model):
    codigo = models.CharField(max_length=24, primary_key=True)
    descripcion = models.CharField(max_length=120, null=True, blank=True)
    monto = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    id_nomina = models.ForeignKey(RegistroNomina, on_delete=models.CASCADE, db_column='id_nomina')

    class Meta:
        db_table = 'concepto'
        verbose_name = 'Concepto'
        verbose_name_plural = 'Conceptos'

    def __str__(self):
        return f"{self.codigo} - {self.descripcion}"


class ReciboPago(models.Model):
    id = models.AutoField(primary_key=True)
    id_nomina = models.ForeignKey(RegistroNomina, on_delete=models.CASCADE, db_column='id_nomina')
    id_empleado = models.ForeignKey(Empleado, on_delete=models.CASCADE, db_column='id_empleado')
    generado_en = models.DateTimeField(auto_now_add=True)
    referencia_pdf = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        db_table = 'recibo_pago'
        verbose_name = 'Recibo de Pago'
        verbose_name_plural = 'Recibos de Pago'

    def __str__(self):
        return f"Recibo {self.id} - {self.id_empleado}"


class Reporte(models.Model):
    id = models.AutoField(primary_key=True)
    titulo = models.CharField(max_length=116, null=True, blank=True)
    generado_en = models.DateTimeField(auto_now_add=True)
    filtros = models.JSONField(null=True, blank=True)
    referencia_archivo = models.CharField(max_length=64, null=True, blank=True)
    id_admin = models.ForeignKey(Administrador, on_delete=models.SET_NULL, null=True, blank=True, db_column='id_admin')

    class Meta:
        db_table = 'reporte'
        verbose_name = 'Reporte'
        verbose_name_plural = 'Reportes'

    def __str__(self):
        return f"{self.titulo} - {self.generado_en}"


class ConfigSistema(models.Model):
    id = models.AutoField(primary_key=True)
    configuraciones = models.JSONField(default=dict)

    class Meta:
        db_table = 'config_sistema'
        verbose_name = 'Configuración del Sistema'
        verbose_name_plural = 'Configuraciones del Sistema'

    def __str__(self):
        return f"Configuración {self.id}"


class RegistroAuditoria(models.Model):
    id = models.AutoField(primary_key=True)
    accion = models.CharField(max_length=150, null=True, blank=True)
    id_usuario = models.ForeignKey(Usuario, on_delete=models.SET_NULL, null=True, blank=True, db_column='id_usuario')
    fecha_hora = models.DateTimeField(auto_now_add=True)
    detalles = models.JSONField(null=True, blank=True)

    class Meta:
        db_table = 'registro_auditoria'
        verbose_name = 'Registro de Auditoría'
        verbose_name_plural = 'Registros de Auditoría'

    def __str__(self):
        return f"{self.accion} - {self.fecha_hora}"


class TokenAutenticacion(models.Model):
    token = models.CharField(max_length=255, primary_key=True)
    id_usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, db_column='id_usuario')
    expira_en = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'token_autenticacion'
        verbose_name = 'Token de Autenticación'
        verbose_name_plural = 'Tokens de Autenticación'

    def __str__(self):
        return f"Token para {self.id_usuario}"
