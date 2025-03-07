# Usa una imagen oficial de Node.js como base
FROM node:18-alpine

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia los archivos package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código de la aplicación al contenedor
COPY . .

# Genera el cliente de Prisma antes de iniciar la aplicación
RUN npx prisma generate

# Expone el puerto en el que corre NestJS
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["npm", "run", "start"]
