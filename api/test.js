export default function handler(req, res) {
  res.status(200).json({
    message: 'Proxy is working!',
    query: req.query,
    method: req.method,
    headers: req.headers,
  });
}