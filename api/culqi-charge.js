// Vercel Serverless Function — procesa el cargo Culqi server-side.
// La secret key vive solo en el servidor (process.env.CULQI_SECRET_KEY),
// NUNCA se expone al navegador. El frontend solo envía el token público.
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const secretKey = process.env.CULQI_SECRET_KEY;
  if (!secretKey || secretKey.includes('tu_llave')) {
    return res.status(500).json({ error: 'Culqi secret key no configurada en el servidor' });
  }

  const { token_id, amount, email, description } = req.body || {};
  if (!token_id || !amount || !email) {
    return res.status(400).json({ error: 'Faltan datos del cargo (token_id, amount, email)' });
  }

  const amountCents = Math.round(Number(amount) * 100);
  if (!Number.isFinite(amountCents) || amountCents < 100) {
    return res.status(400).json({ error: 'Monto inválido' });
  }

  try {
    const culqiResp = await fetch('https://api.culqi.com/v2/charges', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${secretKey}`,
      },
      body: JSON.stringify({
        amount: amountCents,
        currency_code: 'PEN',
        email,
        description: description || 'Pedido EcoAndes',
        source: { token_id },
      }),
    });

    const data = await culqiResp.json();
    if (data.object !== 'charge') {
      return res.status(402).json({ error: data.user_message || 'Pago rechazado' });
    }

    return res.status(200).json({ ok: true, chargeId: data.id });
  } catch {
    return res.status(500).json({ error: 'Error al procesar el pago' });
  }
}
