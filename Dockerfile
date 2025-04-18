# Stage 1: Build the application
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build:prod

# Stage 2: Serve the application
FROM nginx:alpine
COPY --from=build /app/dist/barista-app/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

# Run nginx in foreground
CMD ["nginx", "-g", "daemon off;"]