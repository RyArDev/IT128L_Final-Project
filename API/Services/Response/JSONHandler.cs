using API.Models.Http;
using API.Models.Pokemon;
using API.Models.Users;
using Newtonsoft.Json;

namespace API.Services.Response
{
    public class JSONHandler
    {
        public string SystemMessage(string message)
        {
            return JsonConvert.SerializeObject(new HttpResponseModel { SystemMessage = message });
        }

        public string UserMessage(string message, UserModel user)
        {
            return JsonConvert.SerializeObject(new HttpResponseModel { SystemMessage = message, User = user });
        }

        public string UsersMessage(string message, UserModel[] users)
        {
            return JsonConvert.SerializeObject(new HttpResponseModel { SystemMessage = message, Users = users });
        }

        public string UserLoginMessage(string message, UserModel user, string accessToken)
        {
            return JsonConvert.SerializeObject(new HttpResponseModel { SystemMessage = message, User = user, AccessToken = accessToken });
        }

        public string PokemonMessage(string message, PokemonModel pokemon)
        {
            return JsonConvert.SerializeObject(new HttpResponseModel { SystemMessage = message, Pokemon = pokemon });
        }

        public string PokemonsMessage(string message, PokemonModel[] pokemons)
        {
            return JsonConvert.SerializeObject(new HttpResponseModel { SystemMessage = message, Pokemons = pokemons });
        }

        public string ItemMessage(string message, ItemModel item)
        {
            return JsonConvert.SerializeObject(new HttpResponseModel { SystemMessage = message, Item = item });
        }

        public string ItemsMessage(string message, ItemModel[] items)
        {
            return JsonConvert.SerializeObject(new HttpResponseModel { SystemMessage = message, Items = items });
        }

        public string CompositionMessage(string message, CompositionModel composition)
        {
            return JsonConvert.SerializeObject(new HttpResponseModel { SystemMessage = message, Composition = composition });
        }

        public string CompositionsMessage(string message, CompositionModel[] compositions)
        {
            return JsonConvert.SerializeObject(new HttpResponseModel { SystemMessage = message, Compositions = compositions });
        }

        public string BuildMessage(string message, BuildModel build)
        {
            return JsonConvert.SerializeObject(new HttpResponseModel { SystemMessage = message, Build = build });
        }

        public string BuildsMessage(string message, BuildModel[] builds)
        {
            return JsonConvert.SerializeObject(new HttpResponseModel { SystemMessage = message, Builds = builds });
        }
    }
}
