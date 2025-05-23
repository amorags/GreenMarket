namespace FruitService.Models;

public class FoodItem
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Color { get; set; }
    public int Calories { get; set; }
    public bool InSeason { get; set; }
}
