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

1. Click the drop down menu beside the run project button in the Visual Studio IDE and click Configure startup projects. 
2. Click multiple startup projects and put every action to start.

* Database - Start
* API - Start
* Web - Start

-----

Step 4: In your Git Bash terminal go to the directory of the Web project then type:

``` Git Bash Terminal
npm start
```

Wait for the terminal to completely display this output:

``` Git Bash Terminal
npm start

> web@0.0.0 prestart
> node aspnetcore-https


> web@0.0.0 start
> ng serve --ssl --ssl-cert https\%npm_package_name%.pem --ssl-key https\%npm_package_name%.key

✔ Browser application bundle generation complete.

Initial Chunk Files   | Names         |  Raw Size
vendor.js             | vendor        |   2.50 MB |
styles.css, styles.js | styles        | 399.43 kB |
main.js               | main          | 339.33 kB |
polyfills.js          | polyfills     | 314.26 kB |
runtime.js            | runtime       |   6.50 kB |

                      | Initial Total |   3.53 MB

Build at: 2023-04-24T18:31:27.150Z - Hash: e8c6359e14c303a9 - Time: 27797ms

** Angular Live Development Server is listening on localhost:4200, open your browser on https://localhost:4200/ **


√ Compiled successfully.
```

-----

Step 5: Starting the Project

1. Click the start button at the top of the Visual Studio IDE and wait for two browsers to pop up where 1 is SwaggerGen and 1 is the Angular Website.

-----

Step 6: Happy Coding :)
