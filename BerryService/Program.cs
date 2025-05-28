using BerriesService.Policies;
using BerriesService.Services;
using Polly;
using Polly.Retry;
using BerriesService.Models;


var builder = WebApplication.CreateBuilder(args);

builder.WebHost.ConfigureKestrel(serverOptions =>
{
    serverOptions.ListenAnyIP(80);
});


builder.Services.AddSingleton(PollyPolicy.GetGenericRetryPolicy());
builder.Services.AddScoped<IBerryService, BerryClient>();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApi();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.MapControllers();
app.Run();
