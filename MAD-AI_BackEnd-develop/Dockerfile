FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY ["MADAI-BACKEND.csproj", "."]
RUN dotnet restore "MADAI-BACKEND.csproj"

COPY . .
RUN dotnet publish "MADAI-BACKEND.csproj" \
    --configuration Release \
    --output /app/publish \
    --no-restore \
    /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

ENV ASPNETCORE_ENVIRONMENT=Production
ENV ASPNETCORE_URLS=http://0.0.0.0:10000
EXPOSE 10000

COPY --from=build /app/publish .

USER $APP_UID
ENTRYPOINT ["dotnet", "MADAI-BACKEND.dll"]
