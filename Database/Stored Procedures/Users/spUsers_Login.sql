CREATE PROCEDURE [dbo].[spUsers_Login]
	@username nvarchar(24),
	@password nvarchar(64)
AS
begin

	set nocount on;
	SELECT [Id], [UserName], [Password], [RefreshToken]
	FROM dbo.Users
	WHERE UserName = @username
	AND Password = @password;

end
RETURN 0
