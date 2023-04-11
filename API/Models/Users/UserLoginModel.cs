using System.ComponentModel.DataAnnotations;

namespace API.Models.Users
{
    public class UserLoginModel
    {
        [Required(ErrorMessage = "Username is required")]
        public string? UserName { get; set; }
        
        [Required(ErrorMessage = "Password is required")]
        public string? Password { get; set; }
    }
}
