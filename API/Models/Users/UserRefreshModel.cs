using System.ComponentModel.DataAnnotations;

namespace API.Models.Users
{
    public class UserRefreshModel
    {
        [Key]
        public int? Id { get; set; }
        public string? RefreshToken { get; set; }
    }
}
