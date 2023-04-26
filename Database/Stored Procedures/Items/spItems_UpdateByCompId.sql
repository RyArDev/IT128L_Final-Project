CREATE PROCEDURE [dbo].[spItems_UpdateByCompId]
	@itemId int,
	@pokeId int,
	@compositionId int,
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
	AND [CompositionId] = @compositionId
end
RETURN 0
