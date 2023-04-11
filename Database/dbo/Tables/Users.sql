CREATE TABLE [dbo].[Users]
(
	[Id] INT NOT NULL PRIMARY KEY IDENTITY, 
    [UserName] NVARCHAR(24) NOT NULL UNIQUE, 
    [FirstName] NVARCHAR(50) NOT NULL, 
    [LastName] NVARCHAR(50) NOT NULL, 
    [Password] NVARCHAR(64) NOT NULL, 
    [Email] NVARCHAR(50) NOT NULL UNIQUE, 
    [ProfilePicName] TEXT NULL, 
    [ProfilePicUrl] TEXT NULL, 
    [RefreshToken] TEXT NULL
)
