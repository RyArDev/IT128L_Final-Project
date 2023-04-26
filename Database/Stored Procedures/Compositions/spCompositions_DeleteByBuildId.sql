CREATE PROCEDURE [dbo].[spCompositions_DeleteByBuildId]
	@compositionId int,
	@buildId int
AS
begin
	DELETE FROM dbo.Compositions
	WHERE [Id] = @compositionId
	AND [BuildId] = @buildId
end
RETURN 0
