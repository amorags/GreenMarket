using Gateway;
using Ocelot.DependencyInjection;
using Ocelot.Middleware;

var builder = WebApplication.CreateBuilder(args);

// Load environment-specific Ocelot config
var env = builder.Environment.EnvironmentName.ToLower();
var configFile = env == "development" ? "ocelot.Local.json" : "ocelot.Docker.json";

builder.Configuration.AddJsonFile(configFile, optional: false, reloadOnChange: true);

builder.Services.AddHttpClient("OcelotClient")
    .AddPolicyHandler(ResiliencePolicies.GetBulkheadPolicy())
    .AddPolicyHandler(ResiliencePolicies.GetRetryPolicy())
    .AddPolicyHandler(ResiliencePolicies.GetCircuitBreakerPolicy())
    .AddPolicyHandler(ResiliencePolicies.GetTimeoutPolicy())
    .AddPolicyHandler(ResiliencePolicies.GetFallbackPolicy());

builder.Services.AddTransient<ResilienceDelegatingHandler>();

builder.Services.AddOcelot(builder.Configuration)
    .AddDelegatingHandler<ResilienceDelegatingHandler>(true);
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
app.UseOcelot().Wait();

app.UseAuthorization();
app.MapControllers();

app.Run();