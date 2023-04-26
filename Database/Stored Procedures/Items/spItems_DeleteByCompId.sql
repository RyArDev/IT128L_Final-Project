CREATE PROCEDURE [dbo].[spItems_DeleteByCompId]
	@itemId int,
	@compositionId int
AS
begin
	DELETE FROM dbo.Items
	WHERE [Id] = @itemId
	AND [CompositionId] = @compositionId
end
RETURN 0
