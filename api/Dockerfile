# Build and run the API on Render. Build context: the api/ folder.
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY . .
RUN dotnet publish src/Portfolio.Api/Portfolio.Api.csproj -c Release -o /app

FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=build /app .
ENV ASPNETCORE_HTTP_PORTS=8080
EXPOSE 8080
# Run as the image's unprivileged "app" user instead of root.
USER $APP_UID
ENTRYPOINT ["dotnet", "Portfolio.Api.dll"]
