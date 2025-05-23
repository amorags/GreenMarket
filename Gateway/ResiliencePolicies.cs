using System.Net;
using System.Text;
using Polly;
using Polly.Extensions.Http;

namespace Gateway;

public static class ResiliencePolicies
{
    public static IAsyncPolicy<HttpResponseMessage> GetRetryPolicy() =>
        HttpPolicyExtensions
            .HandleTransientHttpError()
            .RetryAsync(3);

    public static IAsyncPolicy<HttpResponseMessage> GetCircuitBreakerPolicy() =>
        HttpPolicyExtensions
            .HandleTransientHttpError()
            .CircuitBreakerAsync(2, TimeSpan.FromSeconds(30));

    public static IAsyncPolicy<HttpResponseMessage> GetTimeoutPolicy() =>
        Policy.TimeoutAsync<HttpResponseMessage>(3);
    
    public static IAsyncPolicy<HttpResponseMessage> GetFallbackPolicy() =>
        Policy<HttpResponseMessage>
            .Handle<Exception>()
            .FallbackAsync(new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent("[hey]", Encoding.UTF8, "application/json")
            });

}
