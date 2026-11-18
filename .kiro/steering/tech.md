# Tech guidelines

- The builder is a beginner who directs AI rather than writing code. Keep the stack simple and explain each step in plain words.
- One small web app, easy to deploy for free (e.g. Vercel or Netlify).
- Never put API keys in browser code; call the AI model through a small server/serverless function and read keys from environment variables.
- Never commit secrets. `.env` files stay out of git.
- The `/.kiro` folder must stay in the repo (hackathon rule). Never add it to `.gitignore`.

## AI storyteller (Gemini)

- Model: Google **Gemini 3.5 Flash-Lite**, API model code `gemini-3.5-flash-lite`, on the **Gemini API free tier** (free input and output tokens). Verified on ai.google.dev model and pricing pages, Nov 2026.
- One model does all three jobs: (1) narrate scenes and offer 3 choices, (2) rewrite classical-Chinese lines into plain modern Chinese, (3) translate them into English. Ask for **structured JSON output** so the UI can parse narration, choices, and translations reliably.
- SDK: the official Google Gen AI JavaScript SDK (`@google/genai`), called **only from the serverless function** (e.g. `/api/story`), never from the browser.
- API key: read from the environment variable `GEMINI_API_KEY` (set in `.env` locally and in the hosting dashboard, e.g. Vercel). Never hard-code it, log it, or commit it. Keep `.env.example` in the repo with a placeholder.
- Free-tier limits are per Google Cloud project, not per key; daily quota resets at midnight Pacific. Plan for roughly **10–15 requests per minute and ~500 requests per day** (third-party reports; the exact numbers show in Google AI Studio). Design to use few calls:
  - one call per scene (narration + choices + translations together), not one call per sentence;
  - cache translations already fetched in the browser (e.g. sessionStorage) so tapping the same sentence again costs nothing;
  - keep prompts short.
- Error handling:
  - on HTTP 429 or 5xx, retry up to 3 times with backoff (about 2s, 5s, 15s; honor a `retry-after` / retry delay if the error gives one);
  - after that, show a friendly in-world message (e.g. "The candle flickers… the storyteller needs a breath. Try again in a minute.") instead of a crash;
  - have a few **pre-written fallback scenes/endings** in the code so the demo still works if the quota runs out;
  - set a request timeout (~20s).
- Free-tier prompts may be used by Google to improve its products, so never send users' personal data to the model.
