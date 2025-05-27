using Microsoft.AspNetCore.Mvc;
using FruitService.Models;

namespace FruitService.Presentation;

[ApiController]
[Route("api/[controller]")]
public class FruitsController : ControllerBase
{
    private readonly ILogger<FruitsController> _logger;

    public FruitsController(ILogger<FruitsController> logger)
    {
        _logger = logger;
    }

    [HttpGet]
    public IActionResult Get()
    {
        var fruits = new List<FoodItem>
        {
            new() { Id = 2, Name = "Apple", Category = "Fruits", Color = "Green", Calories = 52, InSeason = true },
            new() { Id = 3, Name = "Banana", Category = "Fruits", Color = "Yellow", Calories = 89, InSeason = true }
        };


        return Ok(fruits);
    }

    [HttpHead]
    public IActionResult HealthCheck() => Ok();
}