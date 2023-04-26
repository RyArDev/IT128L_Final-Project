CREATE PROCEDURE [dbo].[spBuilds_UpdateByUserId]
	@buildId int,
	@userId int,
	@name NVARCHAR(MAX),
    @gameVersion NVARCHAR(MAX),
    @description NVARCHAR(MAX),
    @dateUpdated DATETIME2
AS
begin
	set nocount on;
	UPDATE dbo.Builds
	SET 
		[Name] = @name, 
		[GameVersion] = @gameVersion, 
		[Description] = @description,  
		[DateUpdated] = @dateUpdated
	WHERE [Id] = @buildId
	AND [UserId] = @userId
end
RETURN 0