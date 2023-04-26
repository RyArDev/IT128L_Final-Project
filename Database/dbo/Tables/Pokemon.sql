CREATE TABLE [dbo].[Pokemon]
(
	[Id] INT NOT NULL PRIMARY KEY IDENTITY, 
    [PokeId] INT NOT NULL, 
    [CompositionId] INT NOT NULL, 
    [Name] NVARCHAR(MAX) NOT NULL,
    [Purpose] NVARCHAR(MAX) NOT NULL,  
    [ImageURL] NVARCHAR(MAX) NOT NULL,
    [ApiURL] NVARCHAR(MAX) NOT NULL,
    CONSTRAINT [FK_Pokemon_CompId] FOREIGN KEY ([CompositionId]) REFERENCES [Compositions]([Id])
)
