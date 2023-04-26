CREATE PROCEDURE [dbo].[spBuilds_GetByUserId]
	@userId int
AS
begin
	SELECT * 
	FROM dbo.Builds
	WHERE [UserId] = @userId
end
RETURN 0
