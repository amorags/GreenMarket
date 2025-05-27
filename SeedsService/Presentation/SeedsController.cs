using BerryService.Models;
using Microsoft.AspNetCore.Mvc;

namespace SeedsService.Presentation;

[ApiController]
[Route("api/[controller]")]
public class SeedsController : ControllerBase
{
    private readonly ILogger<SeedsController> _logger;

    public SeedsController(ILogger<SeedsController> logger)
    {
        _logger = logger;
    }

    [HttpGet]
public IActionResult Get()
{
    var seeds = new List<FoodItem>
    {
        new() { Id = 7, Name = "Strawberry", Category = "Seeds", Color = "Red", Calories = 32, InSeason = true },
        new() { Id = 8, Name = "Blueberry", Category = "Seeds", Color = "Blue", Calories = 57, InSeason = false }
    };

    return Ok(seeds);
}

    [HttpHead]
    public IActionResult HealthCheck() => Ok();
}