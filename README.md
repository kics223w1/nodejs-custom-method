const http = require('http');

const PORT = process.env.PORT || 3000;

// Create a raw HTTP server that doesn't reject custom methods
const server = http.createServer();

// Handle all incoming requests
server.on('request', (req, res) => {
  const { method, url } = req;
  
  console.log(`${method} request received at ${url}`);
  
  // Set comprehensive CORS headers for all responses
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS, MYFETCH, SUPER');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, X-Custom-Header');
  res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight requests
  if (method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }
  
  // Endpoint for GET method
  if (method === 'GET' && url === '/api/data') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      message: 'This is a GET endpoint',
      data: { id: 1, name: 'Sample Data' }
    }));
  }
  // Endpoint for MYFETCH custom method
  else if (method === 'MYFETCH' && url === '/api/custom') {
    console.log('MYFETCH request being processed...');
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      message: 'This is a MYFETCH endpoint',
      method: 'MYFETCH',
      status: 'success'
    }));
  }
  // Endpoint for SUPER custom method
  else if (method === 'SUPER' && url === '/api/special') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      message: 'This is a SUPER endpoint',
      method: 'SUPER',
      data: { special: true, priority: 'high' }
    }));
  }
  // For any unhandled method/path, return useful info with 200 status
  else {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      message: 'Endpoint not found',
      requestedMethod: method,
      requestedUrl: url,
      availableEndpoints: [
        { method: 'GET', url: '/api/data' },
        { method: 'MYFETCH', url: '/api/custom' },
        { method: 'SUPER', url: '/api/special' }
      ]
    }));
  }
});

// Add extra error handling
server.on('clientError', (err, socket) => {
  console.error('Client error:', err);
  socket.end('HTTP/1.1 200 OK\r\n\r\nError: Bad Request');
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Custom methods server ready (MYFETCH, SUPER supported)`);
});# nodejs-custom-method
