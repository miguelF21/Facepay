from django.contrib import admin
from .models import (
    Usuario, Administrador, Operador, Empleado, InfoContacto, Direccion,
    Terminal, DatosBiometricos, IntentoAcceso, ResultadoReconocimiento,
    RegistroAsistencia, RegistroNomina, Concepto, ReciboPago,
    Reporte, ConfigSistema, RegistroAuditoria, TokenAutenticacion
)

admin.site.register(Usuario)
admin.site.register(Administrador)
admin.site.register(Operador)
admin.site.register(Empleado)
admin.site.register(InfoContacto)
admin.site.register(Direccion)
admin.site.register(Terminal)
admin.site.register(DatosBiometricos)
admin.site.register(IntentoAcceso)
admin.site.register(ResultadoReconocimiento)
admin.site.register(RegistroAsistencia)
admin.site.register(RegistroNomina)
admin.site.register(Concepto)
admin.site.register(ReciboPago)
admin.site.register(Reporte)
admin.site.register(ConfigSistema)
admin.site.register(RegistroAuditoria)
admin.site.register(TokenAutenticacion)
