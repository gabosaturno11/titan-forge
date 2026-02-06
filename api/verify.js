// Saturno Vault — password verification

module.exports = (req, res) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Only POST allowed
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const password = process.env.VAULT_PASSWORD;
  const token = process.env.VAULT_TOKEN;

  // Debug: check what we have
  if (!password || !token) {
    return res.status(500).json({ 
      ok: false, 
      error: 'Missing env vars',
      debug: { hasPassword: !!password, hasToken: !!token }
    });
  }

  // Parse body
  let submitted = '';
  if (req.body) {
    submitted = req.body.password || req.body.p || '';
  }

  if (!submitted) {
    return res.status(400).json({ ok: false, error: 'No password provided' });
  }

  if (submitted !== password) {
    return res.status(401).json({ ok: false, error: 'Invalid password' });
  }

  // Success - set cookie
  res.setHeader(
    'Set-Cookie',
    `vault_auth=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=2592000`
  );
  return res.status(200).json({ ok: true });
};
