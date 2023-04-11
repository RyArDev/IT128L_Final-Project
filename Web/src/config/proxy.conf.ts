const PROXY_CONFIG = {
    context: [],
    target: "https://localhost:7235/api",
    changeOrigin: true,  // helps on CORS Error in F12
    logLevel: "debug",
    rejectUnauthorzied: true, // or false if ok for you
    secure: false,            // PROD must be "true", but DEV false else "UNABLE_TO_VERIFY_LEAF_SIGNATURE"
    strictSSL: true,          // false is default
    withCredentials: true     // required for Angular to send in cookie
}

export default PROXY_CONFIG
