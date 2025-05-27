using Microsoft.AspNetCore.Mvc;
using NutService.Models;

namespace NutService.Presentation;

[ApiController]
[Route("api/[controller]")]
public class NutsController : ControllerBase
{
    private readonly ILogger<NutsController> _logger;

    public NutsController(ILogger<NutsController> logger)
    {
        _logger = logger;
    }

    [HttpGet]
    public IActionResult Get()
    {
        var nuts = new List<FoodItem>
        {
            new() { Id = 5, Name = "Almond", Category = "Nuts", Color = "Brown", Calories = 579, InSeason = false },
            new() { Id = 6, Name = "Walnut", Category = "Nuts", Color = "Brown", Calories = 654, InSeason = false }
        };


        return Ok(nuts);
    }

    [HttpHead]
    public IActionResult HealthCheck() => Ok();
}