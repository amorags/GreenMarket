using BerryService.Models;
using Microsoft.AspNetCore.Mvc;

namespace BerryService.Presentation;

[ApiController]
[Route("api/[controller]")]
public class BerriesController : ControllerBase
{
    private readonly ILogger<BerriesController> _logger;

    public BerriesController(ILogger<BerriesController> logger)
    {
        _logger = logger;
    }

    [HttpGet]
public async Task<IActionResult> Get()
{

    var berries = new List<FoodItem>
    {
        new() { Id = 1, Name = "Strawberry", Category = "Berries", Color = "Red", Calories = 32, InSeason = true },
        new() { Id = 2, Name = "Blueberry", Category = "Berries", Color = "Blue", Calories = 57, InSeason = false }
    };

    return Ok(berries);
}

    [HttpHead]
    public IActionResult HealthCheck() => Ok();
}