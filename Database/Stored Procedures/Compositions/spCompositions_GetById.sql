CREATE PROCEDURE [dbo].[spCompositions_GetById]
	@compositionId int
AS
begin
	SELECT *
	FROM dbo.Compositions
	WHERE [Id] = @compositionId
end
RETURN 0
