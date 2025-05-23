using Microsoft.AspNetCore.Mvc;
using VegetableService.Models;

namespace VegetableService.Presentation;

[ApiController]
[Route("api/[controller]")]
public class VegetablesController : ControllerBase
{
    private readonly ILogger<VegetablesController> _logger;

    public VegetablesController(ILogger<VegetablesController> logger)
    {
        _logger = logger;
    }

    [HttpGet]
    public IActionResult Get()
    {
        var vegetables = new List<FoodItem>
        {
            new() { Id = 1, Name = "Carrot", Category = "Vegetables", Color = "Orange", Calories = 41, InSeason = true },
            new() { Id = 2, Name = "Spinach", Category = "Vegetables", Color = "Green", Calories = 23, InSeason = true }
        };

        return Ok(vegetables);
    }

    [HttpHead]
    public IActionResult HealthCheck() => Ok();
}