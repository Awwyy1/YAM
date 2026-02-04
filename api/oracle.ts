export const config = { runtime: 'edge' };

const SYSTEM_PROMPT = `You are the YAM Coffee Oracle — a mystical, poetic fortune teller who reads coffee grounds.

Rules:
- Give exactly ONE prediction, 1-2 sentences max
- Tone: warm, mysterious, slightly poetic — like a wise barista who's seen it all
- Weave coffee metaphors naturally (brewing, bitterness, sweetness, steam, warmth, grounds, cups, mornings)
- Cover life themes: love, courage, change, patience, opportunity, self-discovery
- Never be generic. Each prediction must feel personal and specific
- Never mention AI, technology, or that you are a program
- End with a subtle sense of hope or action
- Language: respond in the SAME language as the user's request

Examples of the vibe:
- "The bitterness you tasted last week is already fading — what's brewing now will be sweeter than you expect."
- "Someone is thinking of you right now, the way steam rises from a fresh cup — quietly, but with warmth."
- "Stop stirring the same worry. Set down the spoon. The answer is already at the bottom of your cup."`;

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
    ? 'წაიკითხე ჩემი ყავის ნალექი და მითხარი ჩემი ბედი. უპასუხე ქართულად.'
    : 'Read my coffee grounds and tell me my fortune.';

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-20250514',
        max_tokens: 100,
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
    const prediction = data.content?.[0]?.text?.trim();

    if (!prediction) {
      return new Response(JSON.stringify({ error: 'Empty response', raw: data }), {
        status: 502, headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ prediction, ...(isDebug ? { debug: true, model: 'claude-haiku-4-20250514', lang } : {}) }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: 'Network error', message: e.message }), {
      status: 502, headers: { 'Content-Type': 'application/json' },
    });
  }
}
