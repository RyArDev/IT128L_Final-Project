using System.Text;
using System.Security.Cryptography;
using API.Services.Database;
using System.Reflection.Emit;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace API.Services.User
{
    public class PasswordHandler
    {
        private IConfiguration _config;
        private DatabaseConnectionHandler _connection = new DatabaseConnectionHandler();

        public PasswordHandler()
        {
            _config = _connection.GetConfig();
        }

        public string EncryptPassword(string password)
        {         
            try
            {
                if (string.IsNullOrEmpty(password)) { return ""; }

                byte[] data = Encoding.UTF8.GetBytes(password);
                using (MD5 md5 = MD5.Create())
                {
                    byte[] keys = md5.ComputeHash(Encoding.UTF8.GetBytes(_config["Password:Hash"]));
                    using (TripleDES tripleDes = TripleDES.Create())
                    {
                        tripleDes.Key = keys;
                        tripleDes.Mode = CipherMode.ECB;
                        tripleDes.Padding = PaddingMode.PKCS7;
                        ICryptoTransform transform = tripleDes.CreateEncryptor();
                        byte[] results = transform.TransformFinalBlock(data, 0, data.Length);
                        return Convert.ToBase64String(results);
                    }
                }
            }
            catch (Exception e)
            {
                System.Diagnostics.Debug.WriteLine("Error in Encrypting Password: " + e.Message);
            }

            return "Error in Encrypting Password.";
        }

        public string DecryptPassword(string password)
        {
            try
            {

                if (string.IsNullOrEmpty(password)) { return ""; }

                byte[] data = Convert.FromBase64String(password);
                using (MD5 md5 = MD5.Create())
                {
                    byte[] keys = md5.ComputeHash(Encoding.UTF8.GetBytes(_config["Password:Hash"]));
                    using (TripleDES tripleDes = TripleDES.Create())
                    {
                        tripleDes.Key = keys;
                        tripleDes.Mode = CipherMode.ECB;
                        tripleDes.Padding = PaddingMode.PKCS7;
                        ICryptoTransform transform = tripleDes.CreateDecryptor();
                        byte[] results = transform.TransformFinalBlock(data, 0, data.Length);
                        return Encoding.UTF8.GetString(results);
                    }
                }

            }
            catch (Exception e)
            {
                System.Diagnostics.Debug.WriteLine("Error in Decrypting Password: " + e.Message);
            }

            return "Error in Decrypting Password.";
        }

    }
}
