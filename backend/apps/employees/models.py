from django.db import models
from django.core.validators import RegexValidator
from django.utils import timezone
from django.core.exceptions import ValidationError
from datetime import datetime, timedelta


class Employee(models.Model):

    PAIS_CHOICES = [
        ('Colombia', 'Colombia'),
        ('Estados Unidos', 'Estados Unidos'),
    ]

    TIPO_ID_CHOICES = [
        ('Cédula de Ciudadanía', 'Cédula de Ciudadanía'),
        ('Cédula de Extranjería', 'Cédula de Extranjería'),
        ('Pasaporte', 'Pasaporte'),
        ('Permiso Especial', 'Permiso Especial'),
    ]

    AREA_CHOICES = [
        ('Administración', 'Administración'),
        ('Financiera', 'Financiera'),
        ('Compras', 'Compras'),
        ('Infraestructura', 'Infraestructura'),
        ('Operación', 'Operación'),
        ('Talento Humano', 'Talento Humano'),
        ('Servicios Varios', 'Servicios Varios'),
    ]

    # información personal
    primer_apellido = models.CharField(max_length=20, validators=[RegexValidator(r'^[a-zA-Z]+$', 'Solo letras mayúsculas A-Z.')])
    segundo_apellido = models.CharField(max_length=20, validators=[RegexValidator(r'^[a-zA-Z]+$', 'Solo letras mayúsculas A-Z.')], blank=True)
    primer_nombre = models.CharField(max_length=20, validators=[RegexValidator(r'^[a-zA-Z]+$', 'Solo letras mayúsculas A-Z.')])
    segundo_nombre = models.CharField(max_length=50, blank=True, null=True, validators=[RegexValidator(r'^[a-zA-Z]+$', 'Solo letras mayúsculas A-Z y espacios.')])

    # ubicacion e identificacion
    pais_empleo = models.CharField(max_length=20, choices=PAIS_CHOICES, default='Colombia')
    tipo_identificacion = models.CharField(max_length=30, choices=TIPO_ID_CHOICES)
    numero_identificacion = models.CharField(max_length=20, unique=True, validators=[RegexValidator(r'^[0-9]+$', 'Solo números.')])

    # contacto
    email = models.EmailField(max_length=254, unique=True)

    # informacion laboral
    fecha_ingreso = models.DateField()
    area = models.CharField(max_length=20, choices=AREA_CHOICES)
    estado = models.CharField(max_length=20, default='Activo')

    # timestamps
    fecha_registro = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('tipo_identificacion', 'numero_identificacion')
        db_table = 'employees'

    def clean(self):
        #validacion fecha ingreso
        if self.fecha_ingreso:
            today = timezone.now().date()
            on_month_ago = today - timedelta(days=30)

            # verificacion de que la fecha de ingreso no sea futura
            if self.fecha_ingreso > today:
                raise ValidationError({'fecha_ingreso':'La fecha de ingreso no puede ser futura.'})
            # verificacion de que la fecha de ingreso no sea anterior a un mes
            if self.fecha_ingreso < on_month_ago:
                raise ValidationError({'fecha_ingreso':'La fecha de ingreso no puede ser anterior a un mes.'})

    def generate_email(self):
        # generar el email automáticamente
        dominio = 'cidenet.com.co' if self.pais_empleo == 'Colombia' else 'cidenet.com.us'
        base_email = f"{self.primer_nombre.lower()}.{self.primer_apellido.lower()}"

        # verificar si el email ya existe
        contador = 0
        while True:
            if contador == 0:
                email = f"{base_email}@{dominio}"
            else:
                email = f"{base_email}{contador}@{dominio}"
            
            if not Employee.objects.filter(email=email).exists():
                return email
            contador += 1

    def save(self, *args, **kwargs):
        # generar el email si no se ha proporcionado
        if not self.email:
            self.email = self.generate_email()

        self.full_clean()  # para validar antes de guardar
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.primer_nombre} {self.primer_apellido} ({self.numero_identificacion})"