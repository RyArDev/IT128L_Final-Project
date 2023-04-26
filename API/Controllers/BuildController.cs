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
    public class BuildController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ISqlDataAccess _db;
        private readonly DatabaseConnectionHandler _connection = new();
        private readonly JSONHandler jsonHandler = new();
        private const string connectionStringName = "SqlDb";
        private readonly ILogger<BuildController> _logger;
        private readonly IWebHostEnvironment _env;

        public BuildController(ILogger<BuildController> logger, IWebHostEnvironment env)
        {
            _logger = logger;
            _db = _connection.GetAccess();
            _config = _connection.GetConfig();
            _env = env;
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("all")]
        public async Task<IActionResult> GetAllBuilds()
        {
            try
            {
                List<BuildModel> builds = await Task.Run(() => _db.LoadData<BuildModel, dynamic>("dbo.spBuilds_GetAll",
                                                    new { },
                                                    connectionStringName,
                                                    true).ToList());

                return Ok(jsonHandler.BuildsMessage("List of All Builds.", builds.ToArray()));

            }
            catch (Exception e)
            {

                System.Diagnostics.Debug.WriteLine("Error in Getting All Builds: " + e.Message);

            }

            return BadRequest(jsonHandler.SystemMessage("Error in Getting All Builds."));
        }

        [Authorize]
        [HttpPost]
        [Route("add")]
        public async Task<IActionResult> AddBuild([FromBody] BuildModel build)
        {
            try
            {

                if(!VerifyUserById(build.UserId))
                {
                    return BadRequest(jsonHandler.SystemMessage("User Not Found."));
                }

                await Task.Run(() => _db.SaveData<dynamic>("dbo.spBuilds_Add",
                new { build.UserId, build.Name, build.GameVersion, build.Description, build.DateCreated, build.DateUpdated },
                connectionStringName,
                true));

                return Ok(jsonHandler.SystemMessage("Build Added Successfully!"));

            }
            catch (Exception e)
            {

                System.Diagnostics.Debug.WriteLine("Error in Adding a Build: " + e.Message);

            }

            return BadRequest(jsonHandler.SystemMessage("Error in Adding a Build."));

        }

        [Authorize]
        [HttpGet]
        [Route("user/{userId}")]
        public async Task<IActionResult> GetBuildsByUserId(int userId)
        {
            try
            {

                if (!VerifyUserById(userId))
                {
                    return BadRequest(jsonHandler.SystemMessage("User Not Found."));
                }

                List<BuildModel> builds = await Task.Run(() => _db.LoadData<BuildModel, dynamic>("dbo.spBuilds_GetByUserId",
                new { userId },
                connectionStringName,
                true).ToList());

                return Ok(jsonHandler.BuildsMessage("Builds acquired from User ID: " + userId, builds.ToArray()));

            }
            catch (Exception e)
            {

                System.Diagnostics.Debug.WriteLine("Error in Acquiring Build by User ID: " + e.Message);

            }

            return BadRequest(jsonHandler.SystemMessage("Error in Acquiring Build by User ID."));

        }

        [Authorize]
        [HttpGet]
        [Route("{buildId}")]
        public async Task<IActionResult> GetBuildById(int buildId)
        {
            try
            {

                if (!VerifyBuildById(buildId))
                {
                    return BadRequest(jsonHandler.SystemMessage("Build Not Found."));
                }

                BuildModel build = await Task.Run(() => _db.LoadData<BuildModel, dynamic>("dbo.spBuilds_GetById",
                new { buildId },
                connectionStringName,
                true).FirstOrDefault()!);

                return Ok(jsonHandler.BuildMessage("Build acquired from ID: " + buildId, build));

            }
            catch (Exception e)
            {

                System.Diagnostics.Debug.WriteLine("Error in Acquiring Build by ID: " + e.Message);

            }

            return BadRequest(jsonHandler.SystemMessage("Error in Acquiring Build by ID."));

        }

        [Authorize]
        [HttpPut]
        [Route("update/{buildId}/user/{userId}")]
        public async Task<IActionResult> UpdateBuildByUserId([FromBody] BuildModel build, int buildId, int userId)
        {
            try
            {

                if (!VerifyUserById(userId) || !VerifyBuildById(buildId))
                {
                    return BadRequest(jsonHandler.SystemMessage("User/Build Not Found."));
                }

                if (!VerifyBuildByUserId(buildId, userId))
                {
                    return BadRequest(jsonHandler.SystemMessage("Failed to Update Build."));
                }

                await Task.Run(() => _db.SaveData<dynamic>("dbo.spBuilds_UpdateByUserId",
                new { buildId, userId, build.Name, build.GameVersion, build.Description, build.DateUpdated },
                connectionStringName,
                true));

                return Ok(jsonHandler.SystemMessage("Build Updated Successfully!"));

            }
            catch (Exception e)
            {

                System.Diagnostics.Debug.WriteLine("Error in Updating Build by ID: " + e.Message);

            }

            return BadRequest(jsonHandler.SystemMessage("Error in Updating Build by ID."));

        }

        [Authorize]
        [HttpDelete]
        [Route("delete/{buildId}/user/{userId}")]
        public async Task<IActionResult> DeleteBuildByUserId(int buildId, int userId)
        {
            try
            {

                if (!VerifyUserById(userId) || !VerifyBuildById(buildId))
                {
                    return BadRequest(jsonHandler.SystemMessage("User/Build Not Found."));
                }

                if (!VerifyBuildByUserId(buildId, userId))
                {
                    return BadRequest(jsonHandler.SystemMessage("Failed to Delete Build."));
                }

                await Task.Run(() => _db.DeleteData<dynamic>("dbo.spBuilds_DeleteByUserId",
                new { buildId, userId },
                connectionStringName,
                true));

                return Ok(jsonHandler.SystemMessage("Build Deleted Successfully!"));

            }
            catch (Exception e)
            {

                System.Diagnostics.Debug.WriteLine("Error in Deleting Build by ID: " + e.Message);

            }

            return BadRequest(jsonHandler.SystemMessage("Error in Deleting Build by ID."));

        }

        private bool VerifyUserById(int? userId)
        {
            UserModel user = _db.LoadData<UserModel, dynamic>("dbo.spUsers_GetById",
                                               new { userId },
                                               connectionStringName,
                                               true).FirstOrDefault()!;

            if (user == null)
            {
                return false;
            }

            return true;
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

        private bool VerifyBuildByUserId(int? buildId, int? userId)
        {
            BuildModel build = _db.LoadData<BuildModel, dynamic>("dbo.spBuilds_VerifyByUserId",
                                               new { buildId, userId },
                                               connectionStringName,
                                               true).FirstOrDefault()!;

            if (build == null)
            {
                return false;
            }

            return true;
        }

    }
}
