# Step 1: Build the React app
FROM node:18 AS build

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Step 2: Serve it using NGINX
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
