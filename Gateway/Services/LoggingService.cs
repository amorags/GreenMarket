using Microsoft.Extensions.Logging;

namespace Gateway;

public class LoggingService
{
    private readonly ILogger<LoggingService> _logger;

    public LoggingService(ILogger<LoggingService> logger)
    {
        _logger = logger;
    }

    public void LogTimeout(string routeName)
    {
        _logger.LogWarning("Timeout occurred for route: {RouteName}", routeName);
    }

    public void LogRetry(string routeName, int attempt)
    {
        _logger.LogInformation("Retry {Attempt} for route: {RouteName}", attempt, routeName);
    }

    public void LogCircuitBreakerOpened(string routeName)
    {
        _logger.LogError("Circuit breaker opened for route: {RouteName}", routeName);
    }
}
