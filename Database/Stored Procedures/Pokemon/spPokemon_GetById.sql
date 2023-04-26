CREATE PROCEDURE [dbo].[spPokemon_GetById]
	@pokemonId int
AS
begin
	SELECT *
	FROM dbo.Pokemon
	WHERE [Id] = @pokemonId
end
RETURN 0
