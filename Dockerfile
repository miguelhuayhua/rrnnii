# Usa una imagen de Node.js como base
FROM node:18

# Establece el directorio de trabajo en /app
WORKDIR /app

# Copia el archivo package.json y package-lock.json (si existe)
COPY package*.json ./
# Copia el archivo .env al directorio de trabajo
COPY .env .env
# Instala las dependencias del proyecto
RUN npm install

# Genera el cliente de Prisma
RUN npx prisma db push

RUN npx prisma generate

# Copia el resto del código de la aplicación al directorio de trabajo
COPY . .

# Construye la aplicación Next.js para producción
RUN npm run build

# Expone el puerto 3000 (o el puerto que uses para tu aplicación)
EXPOSE 3000

# Comando para ejecutar la aplicación en producción
CMD ["npm", "start"]
