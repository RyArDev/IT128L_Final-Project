CREATE PROCEDURE [dbo].[spBuilds_Add]
	@userId int,
	@name NVARCHAR(MAX),
    @gameVersion NVARCHAR(MAX),
    @description NVARCHAR(MAX),
    @dateCreated DATETIME2,
    @dateUpdated DATETIME2
AS
begin
	set nocount on;
	INSERT INTO dbo.Builds
		(UserId, Name, GameVersion, Description, DateCreated, DateUpdated)
		VALUES (@userId, @name, @gameVersion, @description, @dateCreated, @dateUpdated)
end
RETURN 0