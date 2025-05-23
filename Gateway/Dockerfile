# Base runtime image
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 80

# SDK build image
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy csproj and restore as separate layer
COPY ["Gateway/Gateway.csproj", "Gateway/"]
RUN dotnet restore "Gateway/Gateway.csproj"

# Copy the rest of the source
COPY . .

# Build and publish
WORKDIR /src/Gateway
RUN dotnet build "Gateway.csproj" -c Release -o /app/build
RUN dotnet publish "Gateway.csproj" -c Release -o /app/publish

# Final runtime stage
FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .

# Run the Gateway
ENTRYPOINT ["dotnet", "Gateway.dll"]
