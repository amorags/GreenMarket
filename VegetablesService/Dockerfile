# Sample Dockerfile (VegetablesService/Dockerfile or Service/Dockerfile)
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY . .
RUN dotnet restore "VegetablesService/VegetablesService.csproj"
RUN dotnet build "VegetablesService/VegetablesService.csproj" -c Release -o /app/build
RUN dotnet publish "VegetablesService/VegetablesService.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "VegetablesService.dll"]
