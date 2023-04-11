using API.Interfaces;

namespace API.Services.Database
{
    public class DatabaseConnectionHandler
    {
        private static IConfigurationBuilder? builder;
        private static IConfiguration? config;
        private static ISqlDataAccess? dbAccess;

        public DatabaseConnectionHandler()
        {
            try
            {
                builder = new ConfigurationBuilder()
                .SetBasePath(Path.GetDirectoryName(System.AppContext.BaseDirectory))
                .AddJsonFile("appsettings.json");

                config = builder.Build();
                dbAccess = new SqlDataAccess(config);
            }
            catch (Exception e)
            {
                System.Diagnostics.Debug.WriteLine("Error Building Configuration: " + e.Message);
            }

        }

        public ISqlDataAccess GetAccess()
        {
            return dbAccess!;
        }

        public IConfiguration GetConfig()
        {
            return config!;
        }
    }
}
