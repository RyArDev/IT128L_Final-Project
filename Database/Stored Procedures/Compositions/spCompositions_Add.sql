CREATE PROCEDURE [dbo].[spCompositions_Add]
	@buildId int,
	@name NVARCHAR(MAX),
    @description NVARCHAR(MAX),
    @dateCreated DATETIME2,
    @dateUpdated DATETIME2
AS
begin
	set nocount on;
	INSERT INTO dbo.Compositions
		(BuildId, Name, Description, DateCreated, DateUpdated)
		VALUES (@buildId, @name, @description, @dateCreated, @dateUpdated)
end
RETURN 0
