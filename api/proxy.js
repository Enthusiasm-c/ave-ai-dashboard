export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Get the path and other params from the request
  const { path, ...otherParams } = req.query;
  
  // Construct the target URL
  const targetUrl = `http://209.38.85.196:8002${path || ''}`;
  
  console.log('Proxying to:', targetUrl);
  console.log('Query params:', otherParams);
  
  try {
    // Build query string from remaining params
    const queryString = Object.keys(otherParams).length > 0 
      ? '?' + new URLSearchParams(otherParams).toString()
      : '';
    
    // Forward the request
    const response = await fetch(targetUrl + queryString, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined
    });

    const text = await response.text();
    let data;
    
    try {
      data = JSON.parse(text);
    } catch (e) {
      data = { message: text };
    }
    
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Proxy error', details: error.message });
  }
}