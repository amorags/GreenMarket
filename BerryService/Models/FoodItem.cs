namespace BerriesService.Models;

public class FoodItem
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required string Category { get; set; }
    public required string Color { get; set; }
    public int Calories { get; set; }
    public bool InSeason { get; set; }
}
