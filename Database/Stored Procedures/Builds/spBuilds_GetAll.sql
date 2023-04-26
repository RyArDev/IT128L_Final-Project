CREATE PROCEDURE [dbo].[spBuilds_GetAll]
	AS
begin
	SELECT *
	FROM dbo.Builds
end
RETURN 0
