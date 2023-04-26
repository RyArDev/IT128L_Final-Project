CREATE PROCEDURE [dbo].[spPokemon_GetByCompId]
	@compositionId int
AS
begin
	SELECT *
	FROM dbo.Pokemon
	WHERE [CompositionId] = @compositionId
end
RETURN 0
