CREATE PROCEDURE [dbo].[spBuilds_DeleteByUserId]
	@buildId int,
	@userId int
AS
begin
	DELETE FROM dbo.Builds
	WHERE [Id] = @buildId
	AND [UserId] = @userId
end
RETURN 0
