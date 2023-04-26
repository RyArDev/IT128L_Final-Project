CREATE PROCEDURE [dbo].[spItems_GetByCompId]
	@compositionId int
AS
begin
	SELECT *
	FROM dbo.Items
	WHERE [CompositionId] = @compositionId
end
RETURN 0
