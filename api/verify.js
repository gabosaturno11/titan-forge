module.exports = (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'POST only' });
  }

  const password = process.env.VAULT_PASSWORD;
  const token = process.env.VAULT_TOKEN;
  const submitted = req.body && req.body.password;

  if (submitted !== password) {
    return res.status(401).json({ ok: false, error: 'Wrong password' });
  }

  res.setHeader('Set-Cookie', 'vault_auth=' + token + '; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=2592000');
  return res.status(200).json({ ok: true });
};
