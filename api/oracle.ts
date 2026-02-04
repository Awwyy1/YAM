export const config = { runtime: 'edge' };

const SYSTEM_PROMPT = `You are a coffee fortune teller. Output ONLY the prediction text — nothing else.

STRICT RULES:
- Maximum 1-2 sentences. Never exceed 30 words total.
- No roleplay, no asterisks, no stage directions, no "I see...", no "Ah..."
- No markdown, no quotes, no formatting
- Just the prediction itself — plain text
- Use coffee metaphors (brew, grounds, steam, bitter, sweet, cup, roast, sip)
- Be poetic, mysterious, specific — like a fortune cookie but with soul
- If user writes in Georgian, respond in Georgian

GOOD examples:
The grounds never lie — what felt bitter yesterday is already turning sweet.
Someone will knock twice. The first time you'll hesitate. The second time, open the door.
Your next bold move is already brewing. Trust the warmth rising in your chest.

BAD examples (NEVER do this):
*peers into cup* Ah, I see a journey... (TOO LONG, has roleplay)
The coffee grounds reveal that you are on a path of discovery where... (TOO LONG, too generic)`;

export default async function handler(req: Request) {
  const isDebug = req.method === 'GET';

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'API key not configured', hint: 'Set ANTHROPIC_API_KEY in Vercel Environment Variables' }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });
  }

  let lang = 'en';
  if (req.method === 'POST') {
    try { const body = await req.json(); lang = body.lang || 'en'; } catch {}
  }

  const userPrompt = lang === 'ge'
    ? 'მითხარი ჩემი ბედი. ქართულად, 1-2 წინადადება მაქსიმუმ.'
    : 'Tell me my fortune. 1-2 sentences max.';

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 60,
        temperature: 1.0,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userPrompt }],
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return new Response(JSON.stringify({ error: 'Claude API error', status: res.status, details: err }), {
        status: 502, headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await res.json();
    let prediction = data.content?.[0]?.text?.trim();

    if (!prediction) {
      return new Response(JSON.stringify({ error: 'Empty response', raw: data }), {
        status: 502, headers: { 'Content-Type': 'application/json' },
      });
    }

    // Clean up any unwanted formatting
    prediction = prediction.replace(/^["'*]+|["'*]+$/g, '').replace(/\*[^*]+\*/g, '').trim();

    return new Response(JSON.stringify({ prediction, ...(isDebug ? { debug: true, model: 'claude-3-5-sonnet-20241022', lang } : {}) }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: 'Network error', message: e.message }), {
      status: 502, headers: { 'Content-Type': 'application/json' },
    });
  }
}
