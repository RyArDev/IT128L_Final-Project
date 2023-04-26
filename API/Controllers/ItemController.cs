using API.Interfaces;
using API.Models.Pokemon;
using API.Services.Database;
using API.Services.Response;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ItemController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ISqlDataAccess _db;
        private readonly DatabaseConnectionHandler _connection = new();
        private readonly JSONHandler jsonHandler = new();
        private const string connectionStringName = "SqlDb";
        private readonly ILogger<ItemController> _logger;
        private readonly IWebHostEnvironment _env;

        public ItemController(ILogger<ItemController> logger, IWebHostEnvironment env)
        {
            _logger = logger;
            _db = _connection.GetAccess();
            _config = _connection.GetConfig();
            _env = env;
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("all")]
        public async Task<IActionResult> GetAllItems()
        {
            try
            {
                List<ItemModel> items = await Task.Run(() => _db.LoadData<ItemModel, dynamic>("dbo.spItems_GetAll",
                                                    new { },
                                                    connectionStringName,
                                                    true).ToList());

                return Ok(jsonHandler.ItemsMessage("List of All Items.", items.ToArray()));

            }
            catch (Exception e)
            {

                System.Diagnostics.Debug.WriteLine("Error in Getting All Items: " + e.Message);

            }

            return BadRequest(jsonHandler.SystemMessage("Error in Getting All Items."));
        }

        [Authorize]
        [HttpPost]
        [Route("add")]
        public async Task<IActionResult> AddItem([FromBody] ItemModel item)
        {
            try
            {

                if (!VerifyCompositionById(item.CompositionId))
                {
                    return BadRequest(jsonHandler.SystemMessage("Composition Not Found."));
                }

                await Task.Run(() => _db.SaveData<dynamic>("dbo.spItems_Add",
                new { item.PokeId, item.CompositionId, item.Name, item.Purpose, item.ImageURL, item.ApiURL },
                connectionStringName,
                true));

                return Ok(jsonHandler.SystemMessage("Item Added Successfully!"));

            }
            catch (Exception e)
            {

                System.Diagnostics.Debug.WriteLine("Error in Adding an Item: " + e.Message);

            }

            return BadRequest(jsonHandler.SystemMessage("Error in Adding an Item."));

        }

        [Authorize]
        [HttpGet]
        [Route("composition/{compositionId}")]
        public async Task<IActionResult> GetItemsByCompositionId(int compositionId)
        {
            try
            {

                if (!VerifyCompositionById(compositionId))
                {
                    return BadRequest(jsonHandler.SystemMessage("Composition Not Found."));
                }

                List<ItemModel> items = await Task.Run(() => _db.LoadData<ItemModel, dynamic>("dbo.spItems_GetByCompId",
                new { compositionId },
                connectionStringName,
                true).ToList());

                return Ok(jsonHandler.ItemsMessage("Items acquired from Composition ID: " + compositionId, items.ToArray()));

            }
            catch (Exception e)
            {

                System.Diagnostics.Debug.WriteLine("Error in Acquiring Items by Composition ID: " + e.Message);

            }

            return BadRequest(jsonHandler.SystemMessage("Error in Acquiring Items by Composition ID."));

        }

        [Authorize]
        [HttpGet]
        [Route("{itemId}")]
        public async Task<IActionResult> GetItemById(int itemId)
        {
            try
            {

                if (!VerifyItemById(itemId))
                {
                    return BadRequest(jsonHandler.SystemMessage("Item Not Found."));
                }

                ItemModel item = await Task.Run(() => _db.LoadData<ItemModel, dynamic>("dbo.spItems_GetById",
                new { itemId },
                connectionStringName,
                true).FirstOrDefault()!);

                return Ok(jsonHandler.ItemMessage("Item acquired from ID: " + itemId, item));

            }
            catch (Exception e)
            {

                System.Diagnostics.Debug.WriteLine("Error in Acquiring Item by ID: " + e.Message);

            }

            return BadRequest(jsonHandler.SystemMessage("Error in Acquiring Item by ID."));

        }

        [Authorize]
        [HttpPut]
        [Route("update/{itemId}/composition/{compositionId}")]
        public async Task<IActionResult> UpdateItemByCompositionId([FromBody] ItemModel item, int itemId, int compositionId)
        {
            try
            {

                if (!VerifyCompositionById(compositionId) || !VerifyItemById(itemId))
                {
                    return BadRequest(jsonHandler.SystemMessage("Composition/Item Not Found."));
                }

                if (!VerifyItemByCompositionId(itemId, compositionId))
                {
                    return BadRequest(jsonHandler.SystemMessage("Failed to Update Item."));
                }

                await Task.Run(() => _db.SaveData<dynamic>("dbo.spItems_UpdateByCompId",
                new { itemId, item.PokeId, compositionId, item.Name, item.Purpose, item.ImageURL, item.ApiURL },
                connectionStringName,
                true));

                return Ok(jsonHandler.SystemMessage("Item Updated Successfully!"));

            }
            catch (Exception e)
            {

                System.Diagnostics.Debug.WriteLine("Error in Updating Item by ID: " + e.Message);

            }

            return BadRequest(jsonHandler.SystemMessage("Error in Updating Item by ID."));

        }

        [Authorize]
        [HttpDelete]
        [Route("delete/{itemId}/composition/{compositionId}")]
        public async Task<IActionResult> DeleteItemByCompositionId(int itemId, int compositionId)
        {
            try
            {

                if (!VerifyCompositionById(compositionId) || !VerifyItemById(itemId))
                {
                    return BadRequest(jsonHandler.SystemMessage("Composition/Item Not Found."));
                }

                if (!VerifyItemByCompositionId(itemId, compositionId))
                {
                    return BadRequest(jsonHandler.SystemMessage("Failed to Delete Item."));
                }

                await Task.Run(() => _db.DeleteData<dynamic>("dbo.spItems_DeleteByCompId",
                new { itemId, compositionId },
                connectionStringName,
                true));

                return Ok(jsonHandler.SystemMessage("Item Deleted Successfully!"));

            }
            catch (Exception e)
            {

                System.Diagnostics.Debug.WriteLine("Error in Deleting Item by ID: " + e.Message);

            }

            return BadRequest(jsonHandler.SystemMessage("Error in Deleting Item by ID."));

        }

        private bool VerifyCompositionById(int? compositionId)
        {
            CompositionModel composition = _db.LoadData<CompositionModel, dynamic>("dbo.spCompositions_GetById",
                                               new { compositionId },
                                               connectionStringName,
                                               true).FirstOrDefault()!;

            if (composition == null)
            {
                return false;
            }

            return true;
        }

        private bool VerifyItemById(int? itemId)
        {
            ItemModel item = _db.LoadData<ItemModel, dynamic>("dbo.spItems_GetById",
                                               new { itemId },
                                               connectionStringName,
                                               true).FirstOrDefault()!;

            if (item == null)
            {
                return false;
            }

            return true;
        }

        private bool VerifyItemByCompositionId(int? itemId, int? compositionId)
        {
            ItemModel item = _db.LoadData<ItemModel, dynamic>("dbo.spItems_VerifyByCompId",
                                               new { itemId, compositionId },
                                               connectionStringName,
                                               true).FirstOrDefault()!;

            if (item == null)
            {
                return false;
            }

            return true;
        }

    }
}
