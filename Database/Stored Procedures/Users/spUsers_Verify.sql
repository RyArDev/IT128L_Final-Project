CREATE PROCEDURE [dbo].[spUsers_Verify]
	@username nvarchar(24),
	@email nvarchar(50)
AS
begin
	set nocount on;
	SELECT [Id], [UserName], [Email] FROM dbo.Users WHERE UserName = @username AND Email = @email;

	IF @username LIKE (SELECT [UserName] FROM dbo.Users WHERE Email = @email) AND
	@email LIKE (SELECT [Email] FROM dbo.Users WHERE UserName = @username)
		SELECT [Id], [UserName], [Email]
		FROM dbo.Users
		WHERE UserName = @username
		AND Email = @email;
		
end
RETURN 0
