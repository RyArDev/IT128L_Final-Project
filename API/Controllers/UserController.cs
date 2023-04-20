using API.Interfaces;
using API.Models.Users;
using API.Services.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using API.Services.Database;
using API.Services.Response;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ISqlDataAccess _db;
        private readonly JwtTokenHandler jwtToken = new();
        private readonly PasswordHandler passHandler = new();
        private readonly DatabaseConnectionHandler _connection = new();
        private readonly JSONHandler jsonHandler = new();
        private const string connectionStringName = "SqlDb";
        private readonly ILogger<UserController> _logger;
        private readonly IWebHostEnvironment _env;

        public UserController(ILogger<UserController> logger, IWebHostEnvironment env)
        {
            _logger = logger;
            _db = _connection.GetAccess();
            _config = _connection.GetConfig();
            _env = env;
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("register")]
        public async Task<IActionResult> RegisterUser([FromBody] UserRegistrationModel user)
        {

            try
            {
                if (ExistingUser(user.UserName!, user.Email!))
                {                    
                    return BadRequest(jsonHandler.SystemMessage("Username or Email already exists!"));
                }

                var profilePicUrl = Path.Combine(_config["Api:Url"], "Assets", "Images", "Users", "Default_Profile_Picture.jpg");
                var profilePicName = "Default_Profile_Picture.jpg";

                new SqlParameter("@Password", user.Password = passHandler.EncryptPassword(user.Password!));

                await Task.Run(() => _db.SaveData<dynamic>("dbo.spUsers_Registration",
                new { user.UserName, user.FirstName, user.LastName, user.Password, user.Email, profilePicName, profilePicUrl },
                connectionStringName,
                true));

                return Ok(jsonHandler.SystemMessage("Registered Successfully!"));

            }
            catch (Exception e)
            {

                System.Diagnostics.Debug.WriteLine("Error in User Registration: " + e.Message);

            }

            return BadRequest(jsonHandler.SystemMessage("Error in User Registration."));

        }

        [AllowAnonymous]
        [HttpPost]
        [Route("login")]
        public async Task<IActionResult> LoginUser([FromBody] UserLoginModel user)
        {

            try
            {
                new SqlParameter("@Password", user.Password = passHandler.EncryptPassword(user.Password!));

                UserModel u = await Task.Run(() => _db.LoadData<UserModel, dynamic>("dbo.spUsers_Login",
                                                    new { user.UserName, user.Password },
                                                    connectionStringName,
                                                    true).FirstOrDefault()!);

                if (u != null)
                {

                    var token = jwtToken.GenerateToken(u);
                    var userId = u.Id;

                    new SqlParameter("@RefreshToken", u.RefreshToken = Guid.NewGuid().ToString());

                    await Task.Run(() => _db.SaveData<dynamic>("dbo.spUsers_RefreshToken",
                    new { userId, u.RefreshToken },
                    connectionStringName,
                    true));

                    HttpContext.Response.Cookies.Append("Access-Token", token, new CookieOptions() { HttpOnly = true, SameSite = SameSiteMode.Strict });
                    HttpContext.Response.Cookies.Append("UserId", userId.ToString()!, new CookieOptions() { HttpOnly = true, SameSite = SameSiteMode.Strict });
                    HttpContext.Response.Cookies.Append("Refresh-Token", u.RefreshToken, new CookieOptions() { HttpOnly = true, SameSite = SameSiteMode.Strict });

                    return Ok(jsonHandler.UserLoginMessage("Successful Login.", u, token));
                }

                return BadRequest(jsonHandler.SystemMessage("Incorrect Username or Password!"));

            }
            catch (Exception e)
            {

                System.Diagnostics.Debug.WriteLine("Error in User Login: " + e.Message);

            }

            return BadRequest(jsonHandler.SystemMessage("Error in User Login."));

        }

        [Authorize]
        [HttpPut]
        [Route("update")]
        public async Task<IActionResult> UpdateUser([FromBody] UserUpdateModel updatedUser)
        {

            try
            {

                var userId = updatedUser.Id;

                UserUpdateModel existingUser = await Task.Run(() => _db.LoadData<UserUpdateModel, dynamic>("dbo.spUsers_GetById",
                                                    new { userId },
                                                    connectionStringName,
                                                    true).FirstOrDefault()!);

                if (existingUser == null)
                {
                    return BadRequest(jsonHandler.SystemMessage("User does not exists!"));
                }

                if (updatedUser.UserName != existingUser.UserName || updatedUser.Email != existingUser.Email)
                {
                    if (ExistingUser(updatedUser.UserName!, updatedUser.Email!))
                    {
                        return BadRequest(jsonHandler.SystemMessage("Username or Email already exists!"));
                    }
                }

                if (updatedUser.Password != null || updatedUser.Password != "")
                {

                    updatedUser.Password = passHandler.EncryptPassword(updatedUser.Password!);

                    if (updatedUser.Password == existingUser.Password)
                    {
                        updatedUser.Password = existingUser.Password;
                    }

                }

                if (updatedUser.ProfilePicName != null && updatedUser.ProfilePicName != "")
                {
                    if (updatedUser.ProfilePicName != existingUser.ProfilePicName)
                    {
                        updatedUser.ProfilePicUrl = Path.Combine(_config["Api:Url"], "Assets", "Images", "Users", "Profiles", existingUser.Id.ToString()!, updatedUser.ProfilePicName);

                        var imagePath = Path.Combine(_env.WebRootPath, "Assets", "Images", "Users", "Profiles", existingUser.Id.ToString()!, existingUser.ProfilePicName!);
                        FileInfo file = new FileInfo(imagePath);

                        if (file.Exists)
                        {
                            file.Delete();
                        }
                    }
                    else
                    {
                        updatedUser.ProfilePicUrl = Path.Combine(_config["Api:Url"], "Assets", "Images", "Users", "Profiles", existingUser.Id.ToString()!, existingUser.ProfilePicName);
                    }

                }
                else
                {
                    updatedUser.ProfilePicUrl = existingUser.ProfilePicUrl;
                }

                await Task.Run(() => _db.SaveData<dynamic>("dbo.spUsers_Update",
                new { userId, updatedUser.UserName, updatedUser.FirstName, updatedUser.LastName, updatedUser.Password, updatedUser.Email, updatedUser.ProfilePicName, updatedUser.ProfilePicUrl },
                connectionStringName,
                true));

                return Ok(jsonHandler.SystemMessage("Updated Account Successfully!"));

            }
            catch (Exception e)
            {

                System.Diagnostics.Debug.WriteLine("Error in User Account Update: " + e.Message);

            }

            return BadRequest(jsonHandler.SystemMessage("Error in User Account Update."));
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("all")]
        public async Task<IActionResult> GetAllUsers()
        {
            try
            {
                List<UserModel> users = await Task.Run(() => _db.LoadData<UserModel, dynamic>("dbo.spUsers_GetAll",
                                                    new { },
                                                    connectionStringName,
                                                    true).ToList());

                return Ok(jsonHandler.UsersMessage("List of All Users.", users.ToArray()));

            }
            catch (Exception e)
            {

                System.Diagnostics.Debug.WriteLine("Error in Getting All Users: " + e.Message);

            }

            return BadRequest(jsonHandler.SystemMessage("Error in Getting All Users."));

        }

        [AllowAnonymous]
        [HttpGet]
        [Route("{userId}")]
        public async Task<IActionResult> GetUserById(int userId)
        {
            try
            {
                UserModel user = await Task.Run(() => _db.LoadData<UserModel, dynamic>("dbo.spUsers_GetById",
                                               new { userId },
                                               connectionStringName,
                                               true).FirstOrDefault()!);

                if(user == null)
                {
                    return BadRequest(jsonHandler.SystemMessage("Invalid User."));
                }

                return Ok(jsonHandler.UserMessage("Current User.", user));
            }
            catch (Exception e)
            {
                System.Diagnostics.Debug.WriteLine("Error in Getting User By Id: " + e.Message);
            }

            return BadRequest(jsonHandler.SystemMessage("Error in Getting User By Id."));

        }

        [AllowAnonymous]
        [HttpPost]
        [Route("refresh")]
        public async Task<IActionResult> Refresh([FromBody] UserRefreshModel user)
        {
            try
            {
                if (user.Id < 0 || user.RefreshToken == null)
                    return BadRequest(jsonHandler.SystemMessage("Invalid Username or Refresh Token!"));

                var userId = user.Id;

                UserModel existingUser = await Task.Run(() => _db.LoadData<UserModel, dynamic>("dbo.spUsers_GetById",
                                                    new { userId },
                                                    connectionStringName,
                                                    true).FirstOrDefault()!);

                if (existingUser == null)
                {
                    return BadRequest(jsonHandler.SystemMessage("User does not exists!"));
                }

                userId = existingUser.Id;
                var token = jwtToken.GenerateToken(existingUser);

                new SqlParameter("@RefreshToken", existingUser.RefreshToken = Guid.NewGuid().ToString());
                await Task.Run(() => _db.SaveData<dynamic>("dbo.spUsers_RefreshToken",
                    new { userId, existingUser.RefreshToken },
                    connectionStringName,
                    true));

                HttpContext.Response.Cookies.Append("Access-Token", token, new CookieOptions() { HttpOnly = true, SameSite = SameSiteMode.Strict });
                HttpContext.Response.Cookies.Append("UserId", existingUser.Id.ToString()!, new CookieOptions() { HttpOnly = true, SameSite = SameSiteMode.Strict });
                HttpContext.Response.Cookies.Append("Refresh-Token", existingUser.RefreshToken, new CookieOptions() { HttpOnly = true, SameSite = SameSiteMode.Strict });

                return Ok(jsonHandler.UserLoginMessage("Token Refreshed.", existingUser, token));
            }
            catch (Exception e)
            {
                System.Diagnostics.Debug.WriteLine("Error in Refreshing Token: " + e.Message);
            }

            return BadRequest(jsonHandler.SystemMessage("Error in Refreshing Token."));

        }

        private bool ExistingUser(string username, string email)
        {
            try
            {

                UserModel user = _db.LoadData<UserModel, dynamic>("dbo.spUsers_Verify",
                                                    new { username, email },
                                                    connectionStringName,
                                                    true).FirstOrDefault()!;

                if(user == null)
                {
                    return false;
                }

                if (user.UserName!.ToLower() == username.ToLower() && user.Email!.ToLower() == email.ToLower())
                {
                    return true;
                }

            }
            catch (Exception e)
            {
                System.Diagnostics.Debug.WriteLine("Error in Getting Existing Users: " + e.Message);
            }

            return false;

        }

    }
}
