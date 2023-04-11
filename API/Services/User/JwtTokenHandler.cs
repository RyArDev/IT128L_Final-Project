using API.Interfaces;
using API.Models.Users;
using API.Services.Database;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace API.Services.User
{
    public class JwtTokenHandler
    {
        private IConfiguration _config;
        private DatabaseConnectionHandler _connection = new DatabaseConnectionHandler();

        public JwtTokenHandler()
        {
            _config = _connection.GetConfig();
        }

        public string GenerateToken(UserModel user)
        {
            try
            {
                var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
                var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
                string userIdStr = user.Id.ToString()!;
                var claims = new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, userIdStr),
                };
                var token = new JwtSecurityToken(_config["Jwt:Issuer"],
                _config["Jwt:Audience"],
                claims,
                expires: DateTime.Now.AddMinutes(Convert.ToDouble(_config["Jwt:expiryInMinutes"])),
                signingCredentials: credentials);
                return new JwtSecurityTokenHandler().WriteToken(token);
            }
            catch (Exception e)
            {
                System.Diagnostics.Debug.WriteLine("Error in Generating Token: " + e.Message);
            }

            return "Error in Generating Token.";

        }
    }
}
