from rest_framework import serializers
from .models import Employee
from datetime import datetime, timedelta
from django.utils import timezone


class EmployeeSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(read_only=True)
    estado = serializers.CharField(read_only=True)
    fecha_registro = serializers.DateTimeField(read_only=True, format="%d/%m/%Y %H:%M:%S")

    class Meta:
        model = Employee
        fields = [
            'id', 'primer_apellido', 'segundo_apellido', 'primer_nombre',
            'segundo_nombre', 'pais_empleo', 'tipo_identificacion',
            'numero_identificacion', 'email', 'fecha_ingreso',
            'area', 'estado', 'fecha_registro'
        ]

        def validate_primer_apellido(self, value):
            if not value.isupper():
                raise serializers.ValidationError("El primer apellido debe estar en mayúsculas sin acentos ni ñ.")
            return value
        
        def validate_segundo_apellido(self, value):
            if not value.isupper():
                raise serializers.ValidationError("El segundo apellido debe estar en mayúsculas sin acentos ni ñ.")         
            return value
        
        def validate_primer_nombre(self, value):
            if not value.isupper():
                raise serializers.ValidationError("El primer nombre debe estar en mayúsculas sin acentos ni ñ.")
            return value
        
        def validate_segundo_nombre(self, value):
            if value and not all(c.isupper() or c.isspace() for c in value if c.isalpha()):
                raise serializers.ValidationError("Solo letras mayúsculas A-Z y espacios, sin acentos ni Ñ")
            return value
        
        def validate_fecha_ingreso(self, value):
            today = timezone.now().date()
            one_month_ago = today - timedelta(days=30)

            if value > today:
                raise serializers.ValidationError("La fecha de ingreso no puede ser futura.")
            
            if value < one_month_ago:
                raise serializers.ValidationError("La fecha de ingreso no puede ser más antigua de un mes.")
            
            return value
        
        def validate(self, data):
            # validar tipo y numero de identificacion
            tipo_id = data.get('tipo_identificacion')
            numero_id = data.get('numero_identificacion')

            if tipo_id and numero_id:
                existe = Employee.objects.filter(
                    tipo_identificacion=tipo_id,
                    numero_identificacion=numero_id
                )
            
                if self.instance:
                    existe = existe.exclude(pk=self.instance.pk)

                if existe.exists():
                    raise serializers.ValidationError({'numero_identificacion': "Ya existe un empleado con este tipo y número de identificación."})
            
            return data
        