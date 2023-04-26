CREATE PROCEDURE [dbo].[spItems_GetById]
	@itemId int
AS
begin
	SELECT *
	FROM dbo.Items
	WHERE [Id] = @itemId
end
RETURN 0
