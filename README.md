# Olivia Weiss Portfolio

This repository is a static portfolio site. The site's static assets (HTML, CSS, JS, images) live in the `public/` folder. There's also a small `server.js` which serves `public/` locally for development.

## Local development

Install dependencies and start the local Express server:

```bash
npm install
npm start
```

Then open http://localhost:3000 to preview the site.

## Deploying to Vercel (recommended)

The simplest path is to deploy the static `public/` folder to Vercel. This repository includes a `build` script that copies `public/` into `dist/` and a `vercel.json` config so Vercel will treat the repo as a static site.

Option A — Import the repository into Vercel
1. Go to https://vercel.com and import this Git repository.
2. Set the Build Command to:

```bash
npm run build
```

and the Output Directory to:

```
dist
```

3. Deploy. Vercel will run the build script, publish `dist/`, and host the static site.

Option B — CLI deploy

Install the Vercel CLI and run a production deploy from the repository root:

```bash
npm i -g vercel
vercel --prod
```

Vercel will run `npm run build` and publish the `dist/` folder.

Notes
- If you prefer to run the Node server on Vercel instead of deploying a static site, I can adjust `vercel.json` to deploy `server.js` as a serverless function. Tell me and I'll prepare that config.
- The project's static assets live in `public/`. If you add new static files, they'll be included automatically when you run the build.

---
Generated and prepared for Vercel deployment by the project maintainer.