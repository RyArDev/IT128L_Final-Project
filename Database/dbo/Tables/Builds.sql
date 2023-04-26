CREATE TABLE [dbo].[Builds]
(
	[Id] INT NOT NULL PRIMARY KEY IDENTITY, 
    [UserId] INT NOT NULL, 
    [Name] NVARCHAR(MAX) NOT NULL,
    [GameVersion] NVARCHAR(MAX) NOT NULL,
    [Description] NVARCHAR(MAX) NOT NULL, 
    [DateCreated] DATETIME2 NOT NULL,
    [DateUpdated] DATETIME2 NOT NULL, 
    CONSTRAINT [FK_Builds_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users]([Id])
)
