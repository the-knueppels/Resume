# HTML Resume — Senior QA Engineer

This repository contains a single-file HTML resume styled with `styles.css` and a small `script.js` to add interactions and a hidden QA-themed easter egg.

## What I built
- `index.html`: Semantic, editable HTML to display sections: contact info, summary, experience, skills, projects.
- `styles.css`: Responsive modern CSS with a light and dark theme and print-friendly settings.
- `script.js`: Small JS for theme toggle, print/download, and a multi-stage easter egg requiring console interactions.

## Quick setup
1. Open `index.html` in a web browser.
2. Edit `index.html` to update the resume content (experience, contact, projects).
3. Or update the `data/resume.json` file and reload the page; the page loads content from that JSON.

## Your updated address
I've set your address in the contact section to: **820 Hiawatha Trl, Waterloo, WI 53594**.

## How to edit
- Replace placeholders in `index.html` with your actual data.
- To add more sections, copy a `section` and adjust the `h2` and content.

## Easter Egg — QA Hunt
This easter egg is intentionally complex and requires multiple steps:
1. Click the "Find Easter Egg" button three times quickly.
2. Open the Developer Console and type `revealHint('alpha')`.
3. The console prints a base64 token. Copy it, then call `confirmBadge('<base64>')` with that code.
4. You're rewarded with a console success message, a short visual confetti, and a UI hint.

Hints & complexity:
- The page contains hidden comments that a QA engineer might inspect in the DOM (view-source or Elements panel).
- The first step is a UI action (three rapid clicks). The next steps require using the console (simulation of real bug hunting).
- There is also a Konami-like key sequence to give an extra clue.

This mimics a QA-style debugging flow and tests curiosity and debugging ability.

## Hosting
You can host this on GitHub Pages (or any static file host):

### Automatic deployments
This project includes a GitHub Actions workflow to automatically deploy the site to the `gh-pages` branch when you push to `main`/`master`. The workflow is located at:
 - `.github/workflows/deploy.yml`

### Manual deploy script (Windows PowerShell)
There is also a local PowerShell script that copies the current branch files into a `gh-pages` branch and pushes it for you. Use the script from the repo root:

PowerShell:
```powershell
.\deploy.ps1 -Repo https://github.com/the-knueppels/qa-resume.git -Branch gh-pages
```

If you omit `-Repo`, the script will attempt to use your `origin` remote. Use `-Force` to force push the branch if necessary.

## Local testing
You can test locally using any static server. Examples:

PowerShell (Windows):
```
python -m http.server 8080
```

Then open http://localhost:8080 in your browser.

## Deploying to GitHub Pages (quick start)
1. Create a new repo in GitHub (or use an existing one) — recommended repo name: `qa-resume`.
2. Add this project to the repo (push to `main`), or clone and add the repo as a remote and push.
3. If you want to use GitHub Actions automatic deploy, the included workflow will publish to `gh-pages` automatically after push.
4. If you'd like to run a one-off manual deploy, from PowerShell run:

```powershell
.\deploy.ps1 -Repo https://github.com/the-knueppels/qa-resume.git -Branch gh-pages
```

Note: If you push to `gh-pages`, you're all set. In GitHub repo Settings → Pages, configure the source to `gh-pages` if necessary. The site will be served under `https://the-knueppels.github.io/qa-resume/` once the `gh-pages` branch is deployed.

## Notes & Accessibility
- The page uses semantic sections and is keyboard accessible.
- Keep content concise; replace the sample content with your real job history and accolades.

---
If you want, I can also:
- Convert an existing Word document into the HTML format.
- Add a JSON data file to easily edit content and populate the HTML via JS.
- Add a deploy script to publish automatically to GitHub Pages.
