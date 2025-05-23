using Ocelot.DependencyInjection;
using Ocelot.Middleware;

var builder = WebApplication.CreateBuilder(args);

// Load environment-specific Ocelot config
var env = builder.Environment.EnvironmentName.ToLower();
var configFile = env == "development" ? "ocelot.Local.json" : "ocelot.Docker.json";

builder.Configuration.AddJsonFile(configFile, optional: false, reloadOnChange: true);

builder.Services.AddOcelot(builder.Configuration);
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseOcelot().Wait();

app.UseAuthorization();
app.MapControllers();

app.Run();