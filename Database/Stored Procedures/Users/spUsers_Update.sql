CREATE PROCEDURE [dbo].[spUsers_Update]
	@userId int,
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

	UPDATE dbo.Users
	SET 
		UserName = @userName, 
		FirstName = @firstName, 
		LastName = @lastName, 
		Password = @password, 
		Email = @email, 
		ProfilePicName = @ProfilePicName, 
		ProfilePicUrl = @ProfilePicUrl
	WHERE Id = @userId;
end
RETURN 0
