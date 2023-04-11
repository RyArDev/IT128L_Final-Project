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
    }
}
