using API.Interfaces;
using API.Models.Pokemon;
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
        private readonly ILogger<PokemonController> _logger;
        private readonly IWebHostEnvironment _env;

        public PokemonController(ILogger<PokemonController> logger, IWebHostEnvironment env)
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
                List<PokemonModel> pokemon = await Task.Run(() => _db.LoadData<PokemonModel, dynamic>("dbo.spPokemon_GetAll",
                                                    new { },
                                                    connectionStringName,
                                                    true).ToList());

                return Ok(jsonHandler.PokemonsMessage("List of All Pokemon.", pokemon.ToArray()));

            }
            catch (Exception e)
            {

                System.Diagnostics.Debug.WriteLine("Error in Getting All Pokemon: " + e.Message);

            }

            return BadRequest(jsonHandler.SystemMessage("Error in Getting All Pokemon."));
        }

        [Authorize]
        [HttpPost]
        [Route("add")]
        public async Task<IActionResult> AddPokemon([FromBody] PokemonModel pokemon)
        {
            try
            {

                if (!VerifyCompositionById(pokemon.CompositionId))
                {
                    return BadRequest(jsonHandler.SystemMessage("Composition Not Found."));
                }

                await Task.Run(() => _db.SaveData<dynamic>("dbo.spPokemon_Add",
                new { pokemon.PokeId, pokemon.CompositionId, pokemon.Name, pokemon.Purpose, pokemon.ImageURL, pokemon.ApiURL },
                connectionStringName,
                true));

                return Ok(jsonHandler.SystemMessage("Pokemon Added Successfully!"));

            }
            catch (Exception e)
            {

                System.Diagnostics.Debug.WriteLine("Error in Adding a Pokemon: " + e.Message);

            }

            return BadRequest(jsonHandler.SystemMessage("Error in Adding a Pokemon."));

        }

        [Authorize]
        [HttpGet]
        [Route("composition/{compositionId}")]
        public async Task<IActionResult> GetPokemonByCompositionId(int compositionId)
        {
            try
            {

                if (!VerifyCompositionById(compositionId))
                {
                    return BadRequest(jsonHandler.SystemMessage("Composition Not Found."));
                }

                List<PokemonModel> pokemon = await Task.Run(() => _db.LoadData<PokemonModel, dynamic>("dbo.spPokemon_GetByCompId",
                new { compositionId },
                connectionStringName,
                true).ToList());

                return Ok(jsonHandler.PokemonsMessage("Pokemon acquired from Composition ID: " + compositionId, pokemon.ToArray()));

            }
            catch (Exception e)
            {

                System.Diagnostics.Debug.WriteLine("Error in Acquiring Pokemon by Composition ID: " + e.Message);

            }

            return BadRequest(jsonHandler.SystemMessage("Error in Acquiring Pokemon by Composition ID."));

        }

        [Authorize]
        [HttpGet]
        [Route("{pokemonId}")]
        public async Task<IActionResult> GetPokemonById(int pokemonId)
        {
            try
            {

                if (!VerifyPokemonById(pokemonId))
                {
                    return BadRequest(jsonHandler.SystemMessage("Pokemon Not Found."));
                }

                PokemonModel pokemon = await Task.Run(() => _db.LoadData<PokemonModel, dynamic>("dbo.spPokemon_GetById",
                new { pokemonId },
                connectionStringName,
                true).FirstOrDefault()!);

                return Ok(jsonHandler.PokemonMessage("Pokemon acquired from ID: " + pokemonId, pokemon));

            }
            catch (Exception e)
            {

                System.Diagnostics.Debug.WriteLine("Error in Acquiring Pokemon by ID: " + e.Message);

            }

            return BadRequest(jsonHandler.SystemMessage("Error in Acquiring Pokemon by ID."));

        }

        [Authorize]
        [HttpPut]
        [Route("update/{pokemonId}/composition/{compositionId}")]
        public async Task<IActionResult> UpdatePokemonByCompositionId([FromBody] PokemonModel pokemon, int pokemonId, int compositionId)
        {
            try
            {

                if (!VerifyCompositionById(compositionId) || !VerifyPokemonById(pokemonId))
                {
                    return BadRequest(jsonHandler.SystemMessage("Composition/Pokemon Not Found."));
                }

                if (!VerifyPokemonByCompositionId(pokemonId, compositionId))
                {
                    return BadRequest(jsonHandler.SystemMessage("Failed to Update Pokemon."));
                }

                await Task.Run(() => _db.SaveData<dynamic>("dbo.spPokemon_UpdateByCompId",
                new { pokemonId, pokemon.PokeId, compositionId, pokemon.Name, pokemon.Purpose, pokemon.ImageURL, pokemon.ApiURL },
                connectionStringName,
                true));

                return Ok(jsonHandler.SystemMessage("Pokemon Updated Successfully!"));

            }
            catch (Exception e)
            {

                System.Diagnostics.Debug.WriteLine("Error in Updating Pokemon by ID: " + e.Message);

            }

            return BadRequest(jsonHandler.SystemMessage("Error in Updating Pokemon by ID."));

        }

        [Authorize]
        [HttpDelete]
        [Route("delete/{pokemonId}/composition/{compositionId}")]
        public async Task<IActionResult> DeletePokemonByCompositionId(int pokemonId, int compositionId)
        {
            try
            {

                if (!VerifyCompositionById(compositionId) || !VerifyPokemonById(pokemonId))
                {
                    return BadRequest(jsonHandler.SystemMessage("Composition/Pokemon Not Found."));
                }

                if (!VerifyPokemonByCompositionId(pokemonId, compositionId))
                {
                    return BadRequest(jsonHandler.SystemMessage("Failed to Delete Pokemon."));
                }

                await Task.Run(() => _db.DeleteData<dynamic>("dbo.spPokemon_DeleteByCompId",
                new { pokemonId, compositionId },
                connectionStringName,
                true));

                return Ok(jsonHandler.SystemMessage("Pokemon Deleted Successfully!"));

            }
            catch (Exception e)
            {

                System.Diagnostics.Debug.WriteLine("Error in Deleting Pokemon by ID: " + e.Message);

            }

            return BadRequest(jsonHandler.SystemMessage("Error in Deleting Pokemon by ID."));

        }

        private bool VerifyCompositionById(int? compositionId)
        {
            CompositionModel composition = _db.LoadData<CompositionModel, dynamic>("dbo.spCompositions_GetById",
                                               new { compositionId },
                                               connectionStringName,
                                               true).FirstOrDefault()!;

            if (composition == null)
            {
                return false;
            }

            return true;
        }

        private bool VerifyPokemonById(int? pokemonId)
        {
            PokemonModel pokemon = _db.LoadData<PokemonModel, dynamic>("dbo.spPokemon_GetById",
                                               new { pokemonId },
                                               connectionStringName,
                                               true).FirstOrDefault()!;

            if (pokemon == null)
            {
                return false;
            }

            return true;
        }

        private bool VerifyPokemonByCompositionId(int? pokemonId, int? compositionId)
        {
            PokemonModel pokemon = _db.LoadData<PokemonModel, dynamic>("dbo.spPokemon_VerifyByCompId",
                                               new { pokemonId, compositionId },
                                               connectionStringName,
                                               true).FirstOrDefault()!;

            if (pokemon == null)
            {
                return false;
            }

            return true;
        }
    }
}
