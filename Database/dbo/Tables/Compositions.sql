CREATE TABLE [dbo].[Compositions]
(
	[Id] INT NOT NULL PRIMARY KEY IDENTITY, 
    [BuildId] INT NOT NULL, 
    [Name] NVARCHAR(MAX) NOT NULL, 
    [Description] NVARCHAR(MAX) NOT NULL, 
    [DateCreated] DATETIME2 NOT NULL,
    [DateUpdated] DATETIME2 NOT NULL, 
    CONSTRAINT [FK_Compositions_BuildId] FOREIGN KEY ([BuildId]) REFERENCES [Builds]([Id])
)
