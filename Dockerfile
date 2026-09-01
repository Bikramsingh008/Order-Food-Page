# Build and Run Fullstack Single-Link Container
FROM node:20-alpine AS build

WORKDIR /app

# Copy root and package files
COPY package.json ./
COPY Backend/package*.json ./Backend/
COPY FrontEnd/package*.json ./FrontEnd/
COPY Admin/package*.json ./Admin/

# Install dependencies
RUN npm run install:all

# Copy source code
COPY . .

# Build frontend and admin
RUN npm run build:frontend
RUN npm run build:admin

# Expose server port
EXPOSE 4000

ENV PORT=4000
ENV NODE_ENV=production

# Start single unified server
CMD ["npm", "start"]
