const config = {
  env: process.env.NODE_ENV,
  apiURL: process.env.REACT_APP_BACKENND_URL,
  socketURL: process.env.REACT_APP_SOCKET_URL,
  crypto: {
    algorithm: process.env.REACT_APP_CRYPTO_ALGORITHM,
    secretKey: process.env.REACT_APP_CRYPTO_SECRET_KEY,
  },
};
export default config;
