# IT128L_Final-Project

* API - ASP .NET Core
* Database - Microsoft SQL
* Web - Angular 15

## How to Open

Step 1: Open Porject Solution

1. Open the project use the M2_Final-Project.sln in the [API folder](API).

-----

Step 2: Publish Database

1. Publish the database into the (localdb)\MSSQLLocalDB server, use the existing profile of Database.publish.xml, otherwise use the parameters:

* Target database connection: Data Source=(localdb)\MSSQLLocalDB;Integrated Security=True;Persist Security Info=False;Pooling=False;Multiple Active Result Sets=False;Connect Timeout=60;Encrypt=False;Trust Server Certificate=False
* Database name: M2_Final-Project_DB
* Publich script name: M2_Final-Project_DB-Publish.sql

-----

Step 3: Configure Startup Projects

1. Click the drop down menu beside the run button in the Visual Studio IDE and click Configure startup projects 
2. Click multiple startup projects and put every action to start.

* Database - Start
* API - Start
* Web - Start

-----

Step 4: In your Git Bash terminal go to the directory of the Web project then type:

```Git Bash Terminal
npm start
```

-----

Step 5: Starting the Project

1. Click start at the top of the Visual Studio IDE and wait for two browsers to pop up where 1 is SwaggerGen and 1 is the Angular Website.

-----

Step 6: Happy Coding :)
