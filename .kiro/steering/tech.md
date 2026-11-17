# Tech guidelines

- The builder is a beginner who directs AI rather than writing code. Keep the stack simple and explain each step in plain words.
- One small web app, easy to deploy for free (e.g. Vercel or Netlify).
- Never put API keys in browser code; call the AI model through a small server/serverless function and read keys from environment variables.
- Never commit secrets. `.env` files stay out of git.
- The `/.kiro` folder must stay in the repo (hackathon rule). Never add it to `.gitignore`.
