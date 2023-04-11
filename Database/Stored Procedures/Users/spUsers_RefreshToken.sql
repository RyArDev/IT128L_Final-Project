CREATE PROCEDURE [dbo].[spUsers_RefreshToken]
	@userId int,
	@refreshToken text
AS
begin
	set nocount on;

	IF @userId = (SELECT [Id] FROM dbo.Users WHERE RefreshToken LIKE @refreshToken) AND
	@refreshToken LIKE (SELECT [RefreshToken] FROM dbo.Users WHERE Id = @userId)
		UPDATE dbo.Users
		SET RefreshToken = @refreshToken
		WHERE Id = @userId;
	ELSE IF @userId = (SELECT [Id] FROM dbo.Users WHERE Id = @userId)
		UPDATE dbo.Users
		SET RefreshToken = @refreshToken
		WHERE Id = @userId;
end
RETURN 0
