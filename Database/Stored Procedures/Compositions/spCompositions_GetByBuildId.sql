CREATE PROCEDURE [dbo].[spCompositions_GetByBuildId]
	@buildId int
AS
begin
	SELECT * 
	FROM dbo.Compositions
	WHERE [BuildId] = @buildId
end
RETURN 0
