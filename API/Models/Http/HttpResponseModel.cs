using API.Models.Pokemon;
using API.Models.Users;

namespace API.Models.Http
{
    public class HttpResponseModel
    {
        public string? SystemMessage { get; set; }
        public string? AccessToken { get; set; }
        public UserModel? User { get; set; }
        public UserModel[]? Users { get; set; }
        public UserLoginModel? UserLogin { get; set; }
        public UserRegistrationModel? UserRegistration { get; set; }
        public UserUpdateModel? UserUpdate { get; set; }
        public UserRefreshModel? UserRefresh { get; set; }
        public PokemonModel? Pokemon { get; set; }
        public PokemonModel[]? Pokemons { get; set; }
        public ItemModel? Item { get; set; }
        public ItemModel[]? Items { get; set; }
        public CompositionModel? Composition { get; set; }
        public CompositionModel[]? Compositions { get; set; }
        public BuildModel? Build { get; set; }
        public BuildModel[]? Builds { get; set; }
    }
}
