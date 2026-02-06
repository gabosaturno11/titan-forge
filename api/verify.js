// Saturno Vault — server-side password verification
// Password stored in VAULT_PASSWORD env var (never in source)
// Cookie value from VAULT_TOKEN env var

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const password = process.env.VAULT_PASSWORD;
  const token = process.env.VAULT_TOKEN;

  if (!password || !token) {
    return res.status(500).json({ ok: false, error: 'Server configuration error' });
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  const submitted = body?.password || body?.p || '';

  if (submitted !== password) {
    return res.status(401).json({ ok: false, error: 'Invalid password' });
  }

  res.setHeader(
    'Set-Cookie',
    `vault_auth=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=2592000`
  );
  return res.status(200).json({ ok: true });
}
