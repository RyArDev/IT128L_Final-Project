using System.ComponentModel.DataAnnotations;

namespace API.Models.Pokemon
{
    public class ItemModel
    {
        [Key]
        public int? Id { get; set; }
        public int? PokeId { get; set; }
        public int? CompositionId { get; set; }
        public string? Name { get; set; }
        public string? Purpose { get; set; }
        public string? ImageURL { get; set; }
        public string? ApiURL { get; set; }
    }
}
