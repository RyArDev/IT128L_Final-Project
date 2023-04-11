using System.ComponentModel.DataAnnotations;

namespace API.Models.Users
{
    public class UserModel
    {
        [Key]
        public int? Id { get; set; }
        public string? UserName { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Email { get; set; }
        public string? ProfilePicName { get; set; }
        public string? ProfilePicUrl { get; set; }
        public string? RefreshToken { get; set; }
    }
}
