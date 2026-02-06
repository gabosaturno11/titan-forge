// Saturno Vault — password verification

module.exports = (req, res) => {
  // Only POST allowed
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  try {
    const password = process.env.VAULT_PASSWORD;
    const token = process.env.VAULT_TOKEN;

    if (!password || !token) {
      console.error('Missing env vars:', { hasPassword: !!password, hasToken: !!token });
      return res.status(500).json({ ok: false, error: 'Server config error' });
    }

    const body = req.body || {};
    const submitted = body.password || body.p || '';

    if (submitted !== password) {
      return res.status(401).json({ ok: false, error: 'Invalid password' });
    }

    res.setHeader(
      'Set-Cookie',
      `vault_auth=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=2592000`
    );
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Verify error:', err);
    return res.status(500).json({ ok: false, error: 'Server error' });
  }
};
