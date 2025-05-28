using BerriesService.Models;

public interface IBerryService
{
    Task<List<FoodItem>> GetBerriesAsync();
}
