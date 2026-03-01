# ---------- Stage 1: Build ----------
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build -- --configuration production


# ---------- Stage 2: Nginx ----------
FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*

# 🔥 Ionic build output location
COPY --from=build /app/www /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
