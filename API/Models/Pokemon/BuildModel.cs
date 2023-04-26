using System.ComponentModel.DataAnnotations;

namespace API.Models.Pokemon
{
    public class BuildModel
    {

        [Key]
        public int? Id { get; set; }
        public int? UserId { get; set; }
        public string? Name { get; set; }
        public string? GameVersion { get; set; }
        public string? Description { get; set; }
        public DateTime? DateCreated { get; set; }
        public DateTime? DateUpdated { get; set; }
    }
}
