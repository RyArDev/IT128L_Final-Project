CREATE PROCEDURE [dbo].[spPokemon_Add]
	@pokeId int,
	@compositionId int,
	@name NVARCHAR(MAX),
    @purpose NVARCHAR(MAX),
    @imageURL NVARCHAR(MAX),
    @apiURL NVARCHAR(MAX)
AS
begin
	set nocount on;
	INSERT INTO dbo.Pokemon
		(PokeId, CompositionId, Name, Purpose, ImageURL, ApiURL)
		VALUES (@pokeId, @compositionId, @name, @purpose, @imageURL, @apiURL)
end
RETURN 0
