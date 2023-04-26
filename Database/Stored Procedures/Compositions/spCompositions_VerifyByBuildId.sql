CREATE PROCEDURE [dbo].[spCompositions_VerifyByBuildId]
	@compositionId int,
	@buildId int
AS
begin
	SELECT *
	FROM dbo.Compositions
	WHERE [Id] = @compositionId
	AND [BuildId] = @buildId
end
RETURN 0
