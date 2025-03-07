# 🚀 Koywe Challenge API - Marco Antonio Laura
API para conversión de monedas fiat y criptomonedas en **NestJS**, con autenticación **JWT**, **Prisma** para PostgreSQL y pruebas **unitarias e integrales** con **Jest y Supertest**.

## 1️⃣ Descargar el Proyecto
```bash
git clone https://github.com/marcoalaura/koywe-challenge.git
cd koywe-challenge
```

---

## 2️⃣ Instalación de Dependencias

```bash
npm install
```

---

## 3️⃣ Creación de la Base de Datos en PostgreSQL
Si no tienes PostgreSQL instalado, instálalo y crea la base de datos:
```bash
sudo apt update && sudo apt install postgresql
sudo -u postgres psql
CREATE DATABASE COTIZACIONdb;
```

## 4️⃣ Configuración de Prisma y Creación de Tablas

### 1️. Configurar la Conexión a PostgreSQL
Edita el archivo .env y agrega:

```env
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/koywe_db"
JWT_SECRET="tu_secreto_super_seguro"
EXCHANGE_API_URL="https://api.exchange.cryptomkt.com/api/3/public/price/rate"
```

### 2️. Ejecutar Prisma para Crear Tablas
```bash
npx prisma migrate dev --name init
npx prisma generate
```
✔ Esto generará las tablas necesarias en la base de datos.

## 5️⃣ Inicializar el Proyecto
```bash
npm run start
```

### Inicializar el Proyecto modo desarrollo
```bash
npm run start:dev
```

Por defecto, la API estará disponible en http://localhost:3000.


## 6️⃣ Endpoints Disponibles
🔑 Autenticación
POST /auth/login → Genera un token JWT
Ejemplo de body:
```json
{
  "username": "admin",
  "password": "123456"
}
```
Respuesta esperada:
```json
{
  "access_token": "eyxJhbOiJIUz..."
}
```
💰 Cotizaciones
POST /quote → Crea una cotización (requiere token JWT)
Ejemplo de body:
```json
{
  "amount": 1000000,
  "from": "ARS",
  "to": "ETH"
}
```
GET /quote/:id → Obtiene una cotización por ID (requiere token JWT)

Para todas las solicitudes protegidas, agrega en Headers:
```json
Authorization: Bearer <TOKEN>
```

Se hizo uso de la herramienta swagger para la documentación de las APIs.
Puede ingresar en la siguiente dirección: http://localhost:3000/api/doc

## 7️⃣ Correr Pruebas Unitarias
```bash
npm run test
```
✔ Esto ejecutará todas las pruebas unitarias.

### Correr Pruebas de Integración (E2E)
```bash
npm run test:e2e
```
✔ Esto ejecutará las pruebas completas de la API usando Supertest.

## 8️⃣ Herramientas Adicionales
**A. Ver Base de Datos con Prisma Studio**
```bash
npx prisma studio
```
Permite visualizar la base de datos en una interfaz gráfica.

Por defecto esta es la url: http://localhost:5555/

**B. Uso de postman para validar el API**

La siguiente herramienta es útil para poder probar la API del backend.

**C. Configuracion Docker**

Se cuenta con la configuración necesaria para levantar las instancias en contenedores docker.

En el archivo **dockerfile** tenemos las instrucciones necesarias para levantar nuestra instancia del API.

En el archivo **docker-compose.yml**  tenemos la configuración necesaria para levantar las instancias de base de datos postgres y el backend. De ser necesario se puede ajustar las variables de entorno y los puertos que se estan usando.

Los comandos para cargar los contenedores son los siguientes:

```bash
docker-compose up --build -d
```
✔ Esto construye la imagen y levanta los contenedores en modo detached (en segundo plano).

Verificar que los Contenedores Están Corriendo
```bash
docker ps
```
✔ Debe mostrar koywe_api y koywe_postgres activos.

Ver los Logs de la API
```bash
docker logs -f koywe_api
```

Inicializar la base de datos con prisma en el contenedor
```bash
docker exec -it koywe_api npx prisma migrate dev --name init
```
✔ Esto ejecuta las migraciones para crear las tablas en PostgreSQL dentro del contenedor.

Detener los Contenedores

```bash
docker-compose down
```
✔ Esto apaga la API y PostgreSQL sin eliminar los datos.

Tambien puede dar de baja los servicios.
```bash
docker stop koywe_api
docker stop koywe_postgres
```