export const ipfsConfig = {
  development: {
    apiAddress: '/ip4/127.0.0.1/tcp/5001',
    gatewayAddress: 'http://localhost:8080'
  },
  production: {
    // Use local node in production too
    apiAddress: '/ip4/127.0.0.1/tcp/5001',
    gatewayAddress: 'http://localhost:8080'
  }
}; 