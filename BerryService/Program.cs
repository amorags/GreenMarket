using BerriesService.Policies;
using BerriesService.Services;
using Polly.Wrap;
using Polly.Retry;
using BerriesService.Models;
using Polly;


var builder = WebApplication.CreateBuilder(args);

builder.WebHost.ConfigureKestrel(serverOptions =>
{
    serverOptions.ListenAnyIP(80);
});


builder.Services.AddSingleton<AsyncPolicyWrap>(sp =>
{
    var retry = PollyPolicy.GetGenericRetryPolicy();
    var bulkhead = PollyPolicy.GetDatabaseBulkheadPolicy();

    // Order: Bulkhead (outer) -> Retry (inner)
    // This means bulkhead controls access, retry handles failures within that access
    return Policy.WrapAsync(bulkhead, retry);
});

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
