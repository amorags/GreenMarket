using FruitService.Models;
using Microsoft.AspNetCore.Mvc;

namespace NutService.Presentation;

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
            new() { Id = 1, Name = "Apple", Color = "Green", Calories = 52, InSeason = true },
            new() { Id = 2, Name = "Banana", Color = "Yellow", Calories = 89, InSeason = true }
        };

        return Ok(fruits);
    }

    [HttpHead]
    public IActionResult HealthCheck() => Ok();
}