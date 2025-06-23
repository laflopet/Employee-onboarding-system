
# 📘 Employee Onboarding System

Sistema para la gestión y registro de empleados. Este proyecto está compuesto por:

- 🧠 **Backend:** Django REST Framework.
- 💻 **Frontend:** React + Vite.

---

## 📁 Estructura del Proyecto

```
project-root/
│
├── backend/
│   ├── apps/
│   │   └── employees/         # Lógica de empleados (modelos, vistas, serializers, etc.)
│   ├── employees_system/      # Configuración principal de Django
│   ├── manage.py
│   ├── requirements.txt       # Ya configurado con todas las dependencias necesarias
│   └── .env                   # Se enviará por correo y debe pegarse aquí
│
└── frontend/
    └── employees/             # Aplicación React + Vite
```

---

## 🔧 Requisitos Previos

### General
- Tener **Git** instalado.
- Editor recomendado: **Visual Studio Code**.

### Backend
- Python **3.10** o superior
- pip
- `python-decouple`, `django-cors-headers`, `djangorestframework`, etc. (ya incluidos en `requirements.txt`)

### Frontend
- Node.js **18** o superior
- npm

---

## 🚀 Instrucciones para el Backend (Django REST)

### 1. Acceder al directorio del backend:

```bash
cd backend
```

### 2. (Opcional) Crear un entorno virtual:

```bash
python -m venv env
source env/bin/activate      # Linux/macOS
env\Scripts\activate         # Windows
```

### 3. Instalar las dependencias del proyecto:

```bash
pip install -r requirements.txt
```

### 4. Agregar el archivo `.env`

El archivo `.env` una vez recibido:

- Ubícalo en la carpeta `backend/`.

### 5. Aplicar las migraciones:

```bash
python manage.py migrate
python manage.py makemigrations
```

### 6. Iniciar el servidor de desarrollo:

```bash
python manage.py runserver
```

El servidor quedará disponible en:  
[http://localhost:8000](http://localhost:8000)

---

## ⚙️ Instrucciones para el Frontend (React + Vite)

### 1. Acceder al directorio del frontend:

```bash
cd frontend/employees
```

### 2. Instalar las dependencias:

```bash
npm install
```

### 3. Iniciar la aplicación:

```bash
npm run dev
```

Accede desde:  
[http://localhost:5173](http://localhost:5173)


---

## 📝 Licencia

Por definir.

---
