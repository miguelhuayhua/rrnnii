# Usa una imagen de Node.js como base
FROM node:18

# Establece el directorio de trabajo en /app
WORKDIR /app

# Copia el archivo package.json y package-lock.json (si existe)
COPY package*.json ./

# Instala las dependencias del proyecto
RUN npm install

# Copia el resto del código de la aplicación al directorio de trabajo
COPY . .

# Construye la aplicación Next.js para producción
RUN npm run build

# Expone el puerto 3000 (o el puerto que uses para tu aplicación)
EXPOSE 3000

# Comando para ejecutar la aplicación en producción
CMD ["npm", "start"]
