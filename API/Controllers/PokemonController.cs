using API.Interfaces;
using API.Services.Database;
using API.Services.Response;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PokemonController : ControllerBase
    {        
        private readonly IConfiguration _config;
        private readonly ISqlDataAccess _db;
        private readonly DatabaseConnectionHandler _connection = new();
        private readonly JSONHandler jsonHandler = new();
        private const string connectionStringName = "SqlDb";
        private readonly ILogger<UserController> _logger;
        private readonly IWebHostEnvironment _env;

        public PokemonController(ILogger<UserController> logger, IWebHostEnvironment env)
        {
            _logger = logger;
            _db = _connection.GetAccess();
            _config = _connection.GetConfig();
            _env = env;
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("all")]
        public async Task<IActionResult> GetAllPokemon()
        {
            try
            {

                return Ok();

            }
            catch (Exception e)
            {

                System.Diagnostics.Debug.WriteLine("Error in Getting All Users: " + e.Message);

            }

            return BadRequest(jsonHandler.SystemMessage("Error in Getting All Users."));

        }
    }
}
