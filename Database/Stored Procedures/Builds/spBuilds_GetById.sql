CREATE PROCEDURE [dbo].[spBuilds_GetById]
	@buildId int
AS
begin
	SELECT *
	FROM dbo.Builds
	WHERE [Id] = @buildId
end
RETURN 0
