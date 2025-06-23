# Employee Onboarding System

Sistema para la gestión y registro de empleados, compuesto por un backend en Django REST Framework y un frontend en React con Vite.

## Estructura del Proyecto

```
backend/
  apps/
    employees/
      # Lógica de empleados (modelos, vistas, serializers, etc.)
  employees_system/
    # Configuración principal de Django
  manage.py
  requirements.txt

frontend/
  employees/
    # Aplicación React + Vite
```

---

## Backend (Django REST)

### Requisitos

- Python 3.10+
- pip

### Instalación

1. Ve al directorio del backend:
   ```sh
   cd backend
   ```
2. Instala las dependencias:
   ```sh
   pip install -r requirements.txt
   ```
3. Realiza las migraciones:
   ```sh
   python manage.py migrate
   ```
4. Inicia el servidor:
   ```sh
   python manage.py runserver
   ```

### Variables de entorno

Configura tus variables en el archivo `.env` dentro de `backend/`.

---

## Frontend (React + Vite)

### Requisitos

- Node.js 18+
- npm

### Instalación

1. Ve al directorio del frontend:
   ```sh
   cd frontend/employees
   ```
2. Instala las dependencias:
   ```sh
   npm install
   ```
3. Inicia la aplicación:
   ```sh
   npm run dev
   ```

---

## Notas

- El backend expone una API REST para la gestión de empleados.
- El frontend consume esta API y ofrece una interfaz de usuario moderna.
- Asegúrate de configurar correctamente CORS en el backend para permitir peticiones desde el frontend.

---

## Licencia

MIT
