const http = require('http');

const PORT = process.env.PORT || 3000;

// Define handlers for different HTTP methods
const handlers = {
  TRACE: (req, res) => {
    const requestData = {
      method: req.method,
      url: req.url,
      headers: req.headers,
      httpVersion: req.httpVersion,
    };

    sendResponse(res, 200, {
      message: 'TRACE request echo',
      request: requestData,
    });
  },
};

// List of supported HTTP methods
const supportedMethods = Object.keys(handlers);

// Create an HTTP server
const server = http.createServer((req, res) => {
  const { method, url } = req;
  logRequest(method, url);

  setCORSHeaders(res);

  if (handlers[method]) {
    handlers[method](req, res);
  } else {
    sendResponse(res, 200, {
      message: 'Endpoint not found',
      requestedMethod: method,
      requestedUrl: url,
      availableEndpoints: supportedMethods.map((m) => ({ method: m, url: '/api/data' })),
    });
  }
});

// Error handling for client errors
server.on('clientError', (err, socket) => {
  console.error('[ERROR] Client error:', err);
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Supported methods: ${supportedMethods.join(', ')}`);
});

/**
 * Logs incoming requests
 */
function logRequest(method, url) {
  console.log(`[${new Date().toISOString()}] ${method} request received at ${url}`);
}

/**
 * Sends a JSON response
 */
function sendResponse(res, statusCode, data) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data, null, 2));
}

/**
 * Sets CORS headers for all responses
 */
function setCORSHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', supportedMethods.join(', '));
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, X-Custom-Header');
  res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours
  res.setHeader('Access-Control-Allow-Credentials', 'true');
}