# Imagen base con Node
FROM node:18

# Crear carpeta de la app dentro del contenedor
WORKDIR /usr/src/app

# Copiar package.json (si tienes package-lock.json también)
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código de la app
COPY . .

# Exponer el puerto donde escucha nuestra API
EXPOSE 3000

# Comando por defecto para arrancar el servidor
CMD ["node", "server.js"]

