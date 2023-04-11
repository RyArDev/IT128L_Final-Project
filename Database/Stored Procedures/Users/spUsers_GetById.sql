CREATE PROCEDURE [dbo].[spUsers_GetById]
	@userId int
AS
begin

	set nocount on;
	SELECT [Id], [UserName], [FirstName], [LastName], [Email], [ProfilePicName], [ProfilePicUrl]
	FROM dbo.Users
	WHERE Id = @userId

end
RETURN 0
