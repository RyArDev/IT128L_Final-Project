CREATE PROCEDURE [dbo].[spUsers_Registration]
	@userName nvarchar(24),
	@firstName nvarchar(50),
	@lastName nvarchar(50),
	@password nvarchar(64),
	@email nvarchar(50),
	@ProfilePicName text,
	@ProfilePicUrl text
AS
begin
	set nocount on;
	INSERT INTO dbo.Users
		(UserName, FirstName, LastName, Password, Email, ProfilePicName, ProfilePicUrl)
		VALUES (@userName, @firstName, @lastName, @password, @email, @ProfilePicName, @ProfilePicUrl)
end
RETURN 0
