CREATE PROCEDURE [dbo].[spPokemon_DeleteByCompId]
	@pokemonId int,
	@compositionId int
AS
begin
	DELETE FROM dbo.Pokemon
	WHERE [Id] = @pokemonId
	AND [CompositionId] = @compositionId
end
RETURN 0
