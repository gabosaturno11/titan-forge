module.exports = (req, res) => {
  res.status(200).json({ 
    ok: true,
    hasPassword: !!process.env.VAULT_PASSWORD,
    hasToken: !!process.env.VAULT_TOKEN,
    method: req.method,
    body: req.body
  });
};
