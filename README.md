# Tech Product Guide

Independent public-source technology product comparison site.

The first content vertical is AI voice recorders, with TicNote as the initial product cluster.

## Local Preview

Open:

`site/index.html`

## Verification

Run from the parent workspace:

```bash
node ai-recorder-guide/tests/site-check.mjs
```

Or from this project directory:

```bash
node tests/site-check.mjs
```

## Deployment

Recommended path:

GitHub repository -> Vercel project -> custom domain later.

Set Vercel's project root directory to:

`site`

The public site files are static HTML/CSS and do not require a build command.
