using API.Models.Http;
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

    }
}
