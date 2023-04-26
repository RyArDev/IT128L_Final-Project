CREATE PROCEDURE [dbo].[spBuilds_DeleteById]
	@buildId int
AS
begin
	DELETE FROM dbo.Builds
	WHERE [Id] = @buildId
end
RETURN 0
