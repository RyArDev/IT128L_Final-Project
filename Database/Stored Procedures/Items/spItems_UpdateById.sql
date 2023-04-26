CREATE PROCEDURE [dbo].[spItems_UpdateById]
	@itemId int,
	@pokeId int,
	@name NVARCHAR(MAX),
    @purpose NVARCHAR(MAX),
    @imageURL NVARCHAR(MAX),
	@apiURL NVARCHAR(MAX)
AS
begin
	set nocount on;
	UPDATE dbo.Items
	SET 
		[PokeId] = @pokeId,
		[Name] = @name, 
		[Purpose] = @purpose,  
		[ImageURL] = @imageURL,
		[ApiURL] = @apiURL
	WHERE [Id] = @itemId
end
RETURN 0
