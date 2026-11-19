const { randomUUID } = require('node:crypto');
const MAX_BYTES = 12000;

exports.handler = async (event) => {
  const requestId = event.headers?.['x-nf-request-id'] || randomUUID();
  if (event.httpMethod !== 'POST') return response(405, requestId);
  if (!event.body || Buffer.byteLength(event.body) > MAX_BYTES) return response(413, requestId);

  let body;
  try { body = JSON.parse(event.body); } catch { return response(400, requestId); }
  if (!body.name || !body.email?.includes('@') || !body.message || body.message.length > 10000) return response(400, requestId);
  if (!process.env.EMAIL_BACKEND_URL || !process.env.EMAIL_BACKEND_TOKEN) return response(503, requestId);

  try {
    const result = await fetch(process.env.EMAIL_BACKEND_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.EMAIL_BACKEND_TOKEN}`
      },
      body: JSON.stringify({ name: body.name, email: body.email, message: body.message })
    });
    if (!result.ok) return response(502, requestId);
    return response(200, requestId);
  } catch {
    return response(502, requestId);
  }
};

function response(statusCode, requestId) {
  console.log(JSON.stringify({ event: 'contact_delivery', statusCode, requestId }));
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ok: statusCode === 200, requestId })
  };
}
