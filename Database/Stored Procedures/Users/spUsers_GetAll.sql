CREATE PROCEDURE [dbo].[spUsers_GetAll]
	AS
begin

	SELECT [Id], [UserName], [FirstName], [LastName], [Email], [ProfilePicName], [ProfilePicUrl]
	FROM dbo.Users

end
RETURN 0
