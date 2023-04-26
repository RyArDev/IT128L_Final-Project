CREATE PROCEDURE [dbo].[spItems_GetAll]
	AS
begin
	SELECT *
	FROM dbo.Items
end
RETURN 0
