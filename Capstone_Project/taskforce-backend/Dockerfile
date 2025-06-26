# Use an official Maven image to build the application
FROM maven:3.9.6-eclipse-temurin-21 AS build

# Set working directory
WORKDIR /app

# Copy the project files
COPY . .

# Build the project
RUN mvn clean package -DskipTests

# Use a lightweight JDK image to run the application
FROM openjdk:21-jdk-slim

# Set working directory
WORKDIR /app

# Copy the built JAR file from the previous stage
COPY --from=build /app/target/*.jar app.jar

# Expose the port the app runs on
EXPOSE 8080

# Run the JAR file
ENTRYPOINT ["java", "-jar", "app.jar"]
