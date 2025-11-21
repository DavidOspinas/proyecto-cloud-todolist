# Proyecto Cloud ToDo List 🧾☁️

Repositorio: **https://github.com/DavidOspinas/proyecto-cloud-todolist**

## 1. Descripción general

Este proyecto implementa una **aplicación web de lista de tareas (To-Do List)** desplegada sobre una arquitectura tipo **nube** usando:

- Máquinas virtuales (nube privada tipo IaaS)
- Contenedores Docker
- Balanceo de carga con **HAProxy**
- Servicio backend en **Node.js + Express**
- Base de datos ligera **SQLite**

El objetivo es demostrar conceptos de **Cloud Computing** como:

- **Alta disponibilidad**
- **Balanceo de carga**
- **Contenerización**
- **Servicios en la nube (API REST)**

---

## 2. Arquitectura del sistema

La arquitectura lógica es:

- **Cliente** (navegador / Postman)  
  ↓  
- **Balanceador de carga (HAProxy)** – VM *Balanceador*  
  ↓  
- **Servidores de aplicación** – contenedores Docker con la API:
  - `todo-api-1` → expuesto en `:3000`
  - `todo-api-2` → expuesto en `:3001`
- **Base de datos SQLite** (`tasks.db`) en el backend

En el entorno de laboratorio se usa una **nube privada** montada con VirtualBox:

- **VM 1 – ServidorWeb-1**  
  - Ubuntu Server  
  - Proyecto `todo-list`  
  - Docker con dos contenedores:
    - `todo-api-1` → `0.0.0.0:3000->3000`
    - `todo-api-2` → `0.0.0.0:3001->3000`
  - Base de datos `tasks.db` (SQLite)

- **VM 2 – Balanceador**  
  - Ubuntu Server  
  - **HAProxy** escuchando en el puerto `80`  
  - Redirige el tráfico HTTP a:
    - `192.168.1.62:3000` (todo-api-1)
    - `192.168.1.62:3001` (todo-api-2)  
  - Estrategia de balanceo: **roundrobin**

- **VM 3 – (opcional / laboratorio previo)**  
  - Segundo servidor web usado en ejercicios anteriores (Nginx estático)

El acceso típico al servicio es:

- Directo a una instancia:  
  `http://192.168.1.62:3000/tasks`
- A través del balanceador (servicio “en la nube”):  
  `http://192.168.1.63/tasks`  
  `http://192.168.1.63/` (página web del proyecto servida por el backend)

> **Idea clave:** el balanceador expone un único punto de entrada (como un servicio en la nube) y distribuye el tráfico entre múltiples instancias de la API que corren dentro de contenedores Docker.

---

## 3. Tecnologías utilizadas

- **Backend**
  - Node.js
  - Express
  - body-parser
- **Base de datos**
  - SQLite (`tasks.db`)
- **Infraestructura**
  - VirtualBox (nube privada de laboratorio)
  - Ubuntu Server 22.04 LTS
- **Contenedores**
  - Docker
  - Imagen personalizada: `todo-api` (definida en `Dockerfile`)
- **Balanceador**
  - HAProxy
- **Control de versiones**
  - Git + GitHub

---

## 4. API REST – Endpoints principales

La API expone un CRUD de tareas:

- `GET /tasks`  
  Lista todas las tareas.

- `POST /tasks`  
  Crea una nueva tarea.  
  **Body (JSON):**
  ```json
  {
    "text": "Mi nueva tarea",
    "completed": false
  }
