using API.Interfaces;
using API.Models.Pokemon;
using API.Models.Users;
using API.Services.Database;
using API.Services.Response;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CompositionController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ISqlDataAccess _db;
        private readonly DatabaseConnectionHandler _connection = new();
        private readonly JSONHandler jsonHandler = new();
        private const string connectionStringName = "SqlDb";
        private readonly ILogger<CompositionController> _logger;
        private readonly IWebHostEnvironment _env;

        public CompositionController(ILogger<CompositionController> logger, IWebHostEnvironment env)
        {
            _logger = logger;
            _db = _connection.GetAccess();
            _config = _connection.GetConfig();
            _env = env;
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("all")]
        public async Task<IActionResult> GetAllCompositions()
        {
            try
            {
                List<CompositionModel> compositions = await Task.Run(() => _db.LoadData<CompositionModel, dynamic>("dbo.spCompositions_GetAll",
                                                    new { },
                                                    connectionStringName,
                                                    true).ToList());

                return Ok(jsonHandler.CompositionsMessage("List of All Compositions.", compositions.ToArray()));

            }
            catch (Exception e)
            {

                System.Diagnostics.Debug.WriteLine("Error in Getting All Compositions: " + e.Message);

            }

            return BadRequest(jsonHandler.SystemMessage("Error in Getting All Compositions."));
        }

        [Authorize]
        [HttpPost]
        [Route("add")]
        public async Task<IActionResult> AddComposition([FromBody] CompositionModel composition)
        {
            try
            {

                if (!VerifyBuildById(composition.BuildId))
                {
                    return BadRequest(jsonHandler.SystemMessage("Build Not Found."));
                }

                await Task.Run(() => _db.SaveData<dynamic>("dbo.spCompositions_Add",
                new { composition.BuildId, composition.Name, composition.Description, composition.DateCreated, composition.DateUpdated },
                connectionStringName,
                true));

                return Ok(jsonHandler.SystemMessage("Composition Added Successfully!"));

            }
            catch (Exception e)
            {

                System.Diagnostics.Debug.WriteLine("Error in Adding a Composition: " + e.Message);

            }

            return BadRequest(jsonHandler.SystemMessage("Error in Adding a Composition."));

        }

        [Authorize]
        [HttpGet]
        [Route("build/{buildId}")]
        public async Task<IActionResult> GetCompositionsByBuildId(int buildId)
        {
            try
            {

                if (!VerifyBuildById(buildId))
                {
                    return BadRequest(jsonHandler.SystemMessage("Build Not Found."));
                }

                List<CompositionModel> compositions = await Task.Run(() => _db.LoadData<CompositionModel, dynamic>("dbo.spCompositions_GetByBuildId",
                new { buildId },
                connectionStringName,
                true).ToList());

                return Ok(jsonHandler.CompositionsMessage("Compositions acquired from Build ID: " + buildId, compositions.ToArray()));

            }
            catch (Exception e)
            {

                System.Diagnostics.Debug.WriteLine("Error in Acquiring Compositions by Build ID: " + e.Message);

            }

            return BadRequest(jsonHandler.SystemMessage("Error in Acquiring Compositions by Build ID."));

        }

        [Authorize]
        [HttpGet]
        [Route("{compositionId}")]
        public async Task<IActionResult> GetCompositionById(int compositionId)
        {
            try
            {

                if (!VerifyCompositionById(compositionId))
                {
                    return BadRequest(jsonHandler.SystemMessage("Composition Not Found."));
                }

                CompositionModel composition = await Task.Run(() => _db.LoadData<CompositionModel, dynamic>("dbo.spCompositions_GetById",
                new { compositionId },
                connectionStringName,
                true).FirstOrDefault()!);

                return Ok(jsonHandler.CompositionMessage("Composition acquired from ID: " + compositionId, composition));

            }
            catch (Exception e)
            {

                System.Diagnostics.Debug.WriteLine("Error in Acquiring Composition by ID: " + e.Message);

            }

            return BadRequest(jsonHandler.SystemMessage("Error in Acquiring Composition by ID."));

        }

        [Authorize]
        [HttpPut]
        [Route("update/{compositionId}/build/{buildId}")]
        public async Task<IActionResult> UpdateCompositionByBuildId([FromBody] CompositionModel composition, int compositionId, int buildId)
        {
            try
            {

                if (!VerifyBuildById(buildId) || !VerifyCompositionById(compositionId))
                {
                    return BadRequest(jsonHandler.SystemMessage("Build/Composition Not Found."));
                }

                if (!VerifyCompositionByBuildId(compositionId, buildId))
                {
                    return BadRequest(jsonHandler.SystemMessage("Failed to Update Composition."));
                }

                await Task.Run(() => _db.SaveData<dynamic>("dbo.spCompositions_UpdateByBuildId",
                new { compositionId, buildId, composition.Name, composition.Description, composition.DateUpdated },
                connectionStringName,
                true));

                return Ok(jsonHandler.SystemMessage("Composition Updated Successfully!"));

            }
            catch (Exception e)
            {

                System.Diagnostics.Debug.WriteLine("Error in Updating Composition by ID: " + e.Message);

            }

            return BadRequest(jsonHandler.SystemMessage("Error in Updating Composition by ID."));

        }

        [Authorize]
        [HttpDelete]
        [Route("delete/{compositionId}/build/{buildId}")]
        public async Task<IActionResult> DeleteCompositionByBuildId(int compositionId, int buildId)
        {
            try
            {

                if (!VerifyBuildById(buildId) || !VerifyCompositionById(compositionId))
                {
                    return BadRequest(jsonHandler.SystemMessage("Build/Composition Not Found."));
                }

                if (!VerifyCompositionByBuildId(compositionId, buildId))
                {
                    return BadRequest(jsonHandler.SystemMessage("Failed to Delete Composition."));
                }

                await Task.Run(() => _db.DeleteData<dynamic>("dbo.spCompositions_DeleteByBuildId",
                new { compositionId, buildId },
                connectionStringName,
                true));

                return Ok(jsonHandler.SystemMessage("Composition Deleted Successfully!"));

            }
            catch (Exception e)
            {

                System.Diagnostics.Debug.WriteLine("Error in Deleting Composition by ID: " + e.Message);

            }

            return BadRequest(jsonHandler.SystemMessage("Error in Deleting Composition by ID."));

        }

        private bool VerifyBuildById(int? buildId)
        {
            BuildModel build = _db.LoadData<BuildModel, dynamic>("dbo.spBuilds_GetById",
                                               new { buildId },
                                               connectionStringName,
                                               true).FirstOrDefault()!;

            if (build == null)
            {
                return false;
            }

            return true;
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

        private bool VerifyCompositionByBuildId(int? compositionId, int? buildId)
        {
            CompositionModel composition = _db.LoadData<CompositionModel, dynamic>("dbo.spCompositions_VerifyByBuildId",
                                               new { compositionId, buildId },
                                               connectionStringName,
                                               true).FirstOrDefault()!;

            if (composition == null)
            {
                return false;
            }

            return true;
        }
    }
}
