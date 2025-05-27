using Polly;

namespace Gateway;

public class ResilienceDelegatingHandler : DelegatingHandler
{
    private readonly IAsyncPolicy<HttpResponseMessage> _policy;

    public ResilienceDelegatingHandler()
    {
        _policy = Policy.WrapAsync(
            ResiliencePolicies.GetBulkheadPolicy(),
            ResiliencePolicies.GetRetryPolicy(),
            ResiliencePolicies.GetCircuitBreakerPolicy(),
            ResiliencePolicies.GetTimeoutPolicy(),
            ResiliencePolicies.GetFallbackPolicy()
        );
    }

    protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
    {
        return await _policy.ExecuteAsync(() => base.SendAsync(request, cancellationToken));
    }
}