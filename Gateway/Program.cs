using Gateway;
using Ocelot.DependencyInjection;
using Ocelot.Middleware;
using Ocelot.Provider.Polly;

var builder = WebApplication.CreateBuilder(args);

// Environment detection
var env = builder.Environment.EnvironmentName;
var configFile = env.Equals("Docker", StringComparison.OrdinalIgnoreCase)
    ? "ocelot.Docker.json"
    : "ocelot.Local.json";

builder.Configuration.AddJsonFile(configFile, optional: false, reloadOnChange: true);
builder.Services.AddSingleton<LoggingService>();

// Configure Ocelot with Polly support for QoS
builder.Services.AddOcelot(builder.Configuration)
    .AddPolly();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowFrontend");
await app.UseOcelot();
app.UseAuthorization();
app.MapControllers();

app.Run();