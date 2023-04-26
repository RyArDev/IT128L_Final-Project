CREATE PROCEDURE [dbo].[spBuilds_UpdateById]
	@buildId int,
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
end
RETURN 0
