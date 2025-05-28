using Polly;
using Polly.Retry;
using Polly.Bulkhead;
using System;
using System.Net.Http;
using System.Threading.Tasks;

namespace BerriesService.Policies
{
    public static class PollyPolicy
    {
        public static AsyncRetryPolicy<HttpResponseMessage> GetHttpRetryPolicy()
        {
            return Policy
                .HandleResult<HttpResponseMessage>(r => !r.IsSuccessStatusCode)
                .WaitAndRetryAsync(
                    retryCount: 3,
                    sleepDurationProvider: attempt => TimeSpan.FromSeconds(Math.Pow(2, attempt)),
                    onRetry: (outcome, timespan, attempt, context) =>
                    {
                        Console.WriteLine($"Retry {attempt} after {timespan.TotalSeconds}s due to {outcome.Result?.StatusCode}");
                    });
        }


        public static AsyncBulkheadPolicy GetDatabaseBulkheadPolicy()
        {
            return Policy.BulkheadAsync(
                maxParallelization: 2, 
                maxQueuingActions: 3, 
                onBulkheadRejectedAsync: context =>
                {
                    Console.WriteLine("Database bulkhead rejected - too many concurrent operations");
                    return Task.CompletedTask;
                });
        }

        public static AsyncRetryPolicy GetGenericRetryPolicy()
        {
            return Policy
                .Handle<Exception>()
                .WaitAndRetryAsync(
                    retryCount: 3,
                    sleepDurationProvider: attempt => TimeSpan.FromSeconds(1),
                    onRetry: (exception, timeSpan, retryCount, context) =>
                    {
                        Console.WriteLine($"Retry {retryCount} due to: {exception.Message}");
                    });
        }
    }
}
