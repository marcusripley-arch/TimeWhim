const ALLOWED_EVENTS = new Set([
  'playtest_landing_viewed',
  'playtest_cta_clicked',
  'playtest_language_changed',
  'lab_loaded',
  'game_opened',
  'game_started',
  'game_completed',
  'game_abandoned',
  'replay_clicked',
  'feedback_submitted',
  'feedback_skipped'
]);

const POSTHOG_HOST = 'https://eu.i.posthog.com';
const POSTHOG_TOKEN = 'phc_pw7bhR56gQyPRYrs42S5xxtvMpn98aEFPqbZvzFeYuGw';

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (_) { body = null; }
  }

  if (!body || typeof body !== 'object') {
    return res.status(400).json({ ok: false, error: 'invalid_body' });
  }

  const event = String(body.event || '');
  const distinctId = String(body.distinct_id || '').slice(0, 200);
  const properties = body.properties && typeof body.properties === 'object'
    ? body.properties
    : {};

  if (!ALLOWED_EVENTS.has(event) || !distinctId) {
    return res.status(400).json({ ok: false, error: 'invalid_event' });
  }

  const payload = {
    api_key: POSTHOG_TOKEN,
    event,
    distinct_id: distinctId,
    properties: {
      ...properties,
      '$process_person_profile': false
    }
  };

  try {
    const upstream = await fetch(POSTHOG_HOST + '/i/v0/e/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!upstream.ok) {
      return res.status(502).json({ ok: false, error: 'upstream_rejected', status: upstream.status });
    }

    return res.status(204).end();
  } catch (_) {
    return res.status(502).json({ ok: false, error: 'upstream_unreachable' });
  }
};
