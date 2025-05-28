using Polly;
using BerriesService.Models;
using Polly.Retry;

namespace BerriesService.Services;

public class BerryClient : IBerryService
{
    private readonly AsyncRetryPolicy _retryPolicy;
    private static int _failCount = 0;

    public BerryClient(AsyncRetryPolicy retryPolicy)
    {
        _retryPolicy = retryPolicy;
    }

    public async Task<List<FoodItem>> GetBerriesAsync()
    {
        return await _retryPolicy.ExecuteAsync(async () =>
        {
            // Simulate failure on the first 2 calls
            if (_failCount < 2)
            {
                _failCount++;
                throw new Exception("Simulated transient failure.");
            }
            
            return new List<FoodItem>
            {
                new() { Id = 1, Name = "Strawberry", Category = "Berries", Color = "Red", Calories = 32, InSeason = true },
                new() { Id = 2, Name = "Blueberry", Category = "Berries", Color = "Blue", Calories = 57, InSeason = false }
            };
        });
    }
}