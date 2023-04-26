﻿CREATE PROCEDURE [dbo].[spPokemon_UpdateByCompId]
	@pokemonId int,
	@pokeId int,
	@compositionId int,
	@name NVARCHAR(MAX),
    @purpose NVARCHAR(MAX),
    @imageURL NVARCHAR(MAX),
	@apiURL NVARCHAR(MAX)
AS
begin
	set nocount on;
	UPDATE dbo.Pokemon
	SET 
		[PokeId] = @pokeId,
		[Name] = @name, 
		[Purpose] = @purpose,  
		[ImageURL] = @imageURL,
		[ApiURL] = @apiURL
	WHERE [Id] = @pokemonId
	AND [CompositionId] = @compositionId
end
RETURN 0
