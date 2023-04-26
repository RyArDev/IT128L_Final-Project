CREATE PROCEDURE [dbo].[spItems_DeleteById]
	@itemId int
AS
begin
	DELETE FROM dbo.Items
	WHERE [Id] = @itemId
end
RETURN 0
