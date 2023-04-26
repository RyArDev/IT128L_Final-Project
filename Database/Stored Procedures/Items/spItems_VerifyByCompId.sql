CREATE PROCEDURE [dbo].[spItems_VerifyByCompId]
	@itemId int,
	@compositionId int
AS
begin
	SELECT *
	FROM dbo.Items
	WHERE [Id] = @itemId
	AND [CompositionId] = @compositionId
end
RETURN 0
