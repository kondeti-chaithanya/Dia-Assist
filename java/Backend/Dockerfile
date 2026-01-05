# ---------- STAGE 1: Build ----------
FROM maven:3.9.6-eclipse-temurin-17 AS build

WORKDIR /app

# Copy pom.xml and download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy source code
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests


# ---------- STAGE 2: Run ----------
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copy jar from build stage
COPY --from=build /app/target/*.jar app.jar

# ---------- DATABASE CONFIG (RDS) ----------
ENV SPRING_DATASOURCE_URL=jdbc:mysql://database-1.ct2su282ilk1.ap-south-1.rds.amazonaws.com:3306/dia_assist
ENV SPRING_DATASOURCE_USERNAME=mysqldb
ENV SPRING_DATASOURCE_PASSWORD=mysqldb123

# Expose Spring Boot port
EXPOSE 8080

# Run application
ENTRYPOINT ["java", "-jar", "app.jar"]
