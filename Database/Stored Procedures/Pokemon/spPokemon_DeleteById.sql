CREATE PROCEDURE [dbo].[spPokemon_DeleteById]
	@pokemonId int
AS
begin
	DELETE FROM dbo.Pokemon
	WHERE [Id] = @pokemonId
end
RETURN 0
