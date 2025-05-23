# Sample Dockerfile (VegetableService/Dockerfile or Service/Dockerfile)
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY . .
RUN dotnet restore "VegetableService/VegetableService.csproj"
RUN dotnet build "VegetableService/VegetableService.csproj" -c Release -o /app/build
RUN dotnet publish "VegetableService/VegetableService.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "VegetableService.dll"]
