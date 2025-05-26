

// Test both the frontend health and gateway connectivity
import * as http from "node:http";

const checkFrontendHealth = () => {
  return new Promise((resolve, reject) => {
    const options = {
      host: 'localhost',
      port: 3000,
      path: '/api/health',
      timeout: 2000,
    };

    const request = http.request(options, (res) => {
      if (res.statusCode === 200) {
        resolve('Frontend healthy');
      } else {
        reject(new Error(`Frontend unhealthy: ${res.statusCode}`));
      }
    });

    request.on('error', reject);
    request.on('timeout', () => {
      request.destroy();
      reject(new Error('Frontend timeout'));
    });

    request.end();
  });
};

// Test gateway connectivity
const checkGatewayConnectivity = () => {
  return new Promise((resolve, reject) => {
    const options = {
      host: 'gateway-service', // Use service name within Docker network
      port: 8080,
      path: '/health',
      timeout: 2000,
    };

    const request = http.request(options, (res) => {
      if (res.statusCode === 200) {
        resolve('Gateway reachable');
      } else {
        reject(new Error(`Gateway unhealthy: ${res.statusCode}`));
      }
    });

    request.on('error', reject);
    request.on('timeout', () => {
      request.destroy();
      reject(new Error('Gateway timeout'));
    });

    request.end();
  });
};

// Run both health checks
Promise.all([checkFrontendHealth(), checkGatewayConnectivity()])
    .then((results) => {
      console.log('Health check passed:', results);
      process.exit(0);
    })
    .catch((error) => {
      console.error('Health check failed:', error.message);
      process.exit(1);
    });