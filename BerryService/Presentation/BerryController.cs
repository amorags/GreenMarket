using BerriesService.Models;
using Microsoft.AspNetCore.Mvc;

namespace BerryService.Presentation;

[ApiController]
[Route("api/[controller]")]
public class BerriesController : ControllerBase
{
    private readonly ILogger<BerriesController> _logger;
    private readonly IBerryService _berryClient;


    public BerriesController(ILogger<BerriesController> logger, IBerryService berryClient)
    {
        _logger = logger;
        _berryClient = berryClient;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var berries = await _berryClient.GetBerriesAsync();
        return Ok(berries);
    }

    [HttpHead]
    public IActionResult HealthCheck() => Ok();
}