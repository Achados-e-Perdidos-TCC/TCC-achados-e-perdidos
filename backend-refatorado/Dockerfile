# Build: baixa as dependências e compila o jar. Fica fora da imagem final.
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

# Copia só o pom.xml primeiro para cachear as dependências em camada
# separada — mudar código-fonte não invalida esse download no rebuild.
COPY pom.xml .
RUN mvn -q dependency:go-offline

COPY src ./src
RUN mvn -q clean package -DskipTests

# Runtime: só o JRE (não precisa de Maven/JDK completo pra rodar o jar).
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

COPY --from=build /app/target/api-*.jar app.jar

# Porta real vem da env var PORT em runtime (Render a injeta sozinho) — ver
# server.port em application.yml. 8080 aqui é só o valor default/documentação.
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
