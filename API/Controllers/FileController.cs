using API.Services.Response;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Net.Http.Headers;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FileController : ControllerBase
    {
        private readonly JSONHandler jsonHandler = new();
        private readonly ILogger<FileController> _logger;
        private readonly IWebHostEnvironment _env;

        public FileController(ILogger<FileController> logger, IWebHostEnvironment env)
        {

            _logger = logger;
            _env = env;

        }

        [Authorize]
        [HttpPost, DisableRequestSizeLimit]
        [Route("upload/profile/{userId}")]
        public async Task<IActionResult> ProfilePicUpload(int userId)
        {
            try
            {
                var formCollection = await Request.ReadFormAsync();
                var file = formCollection.Files.First();

                if (file.Length <= 0)
                {
                    return BadRequest(jsonHandler.SystemMessage("Unknown File."));
                }

                var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.ToString();
                var path = Path.Combine(_env.WebRootPath, "Assets", "Images", "Users", "Profiles", userId.ToString());
                var imagePath = Path.Combine(_env.WebRootPath, "Assets", "Images", "Users", "Profiles", userId.ToString(), fileName);

                if (!Directory.Exists(path))
                {
                    Directory.CreateDirectory(path);
                }

                using (var stream = new FileStream(imagePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                    stream.Close();
                }

                return Ok(jsonHandler.SystemMessage("File Uploaded Successfully."));

            }
            catch (Exception e)
            {
                System.Diagnostics.Debug.WriteLine("Error in File Upload: " + e.Message);
            }

            return BadRequest(jsonHandler.SystemMessage("Error in File Upload."));

        }
    }
}
