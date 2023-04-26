CREATE PROCEDURE [dbo].[spCompositions_UpdateById]
	@compositionId int,
	@name NVARCHAR(MAX),
    @description NVARCHAR(MAX),
    @dateUpdated DATETIME2
AS
begin
	set nocount on;
	UPDATE dbo.Compositions
	SET 
		[Name] = @name, 
		[Description] = @description,  
		[DateUpdated] = @dateUpdated
	WHERE [Id] = @compositionId
end
RETURN 0
