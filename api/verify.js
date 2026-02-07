module.exports = function (req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const { password } = req.body || {};
  const token = process.env.VAULT_TOKEN;

  // Fallback if env var not set (shouldn't happen in production)
  if (!token) {
    return res.status(500).json({ ok: false, error: 'Server misconfigured' });
  }

  if (password === token) {
    // Set auth cookie — HttpOnly, Secure, SameSite=Lax, 30 days
    const maxAge = 30 * 24 * 60 * 60; // 30 days in seconds
    res.setHeader(
      'Set-Cookie',
      `vault_auth=${encodeURIComponent(token)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`
    );
    return res.status(200).json({ ok: true });
  }

  return res.status(401).json({ ok: false, error: 'Invalid code' });
};
