CREATE PROCEDURE [dbo].[spPokemon_VerifyByCompId]
	@pokemonId int,
	@compositionId int
AS
begin
	SELECT *
	FROM dbo.Pokemon
	WHERE [Id] = @pokemonId
	AND [CompositionId] = @compositionId
end
RETURN 0
