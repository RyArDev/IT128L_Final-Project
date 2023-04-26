CREATE PROCEDURE [dbo].[spBuilds_VerifyByUserId]
	@buildId int,
	@userId int
AS
begin
	SELECT *
	FROM dbo.Builds
	WHERE [Id] = @buildId
	AND [UserId] = @userId
end
RETURN 0
