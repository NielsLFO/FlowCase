# Usa una imagen base oficial de Node.js
FROM node:18-alpine

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias de producción
RUN npm install --only=production

# Copia el resto de los archivos del proyecto
COPY . .

# Construye el proyecto Next.js
RUN npm run build

# Exponer el puerto 8080 en el contenedor (Cloud Run usa el puerto 8080)
EXPOSE 8080

# Comando para ejecutar la aplicación en producción
CMD ["npm", "start"]
