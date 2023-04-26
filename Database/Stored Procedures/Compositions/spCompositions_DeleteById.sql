CREATE PROCEDURE [dbo].[spCompositions_DeleteById]
	@compositionId int
AS
begin
	DELETE FROM dbo.Compositions
	WHERE [Id] = @compositionId
end
RETURN 0
