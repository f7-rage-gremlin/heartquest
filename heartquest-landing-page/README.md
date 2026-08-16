# HeartQuest landing page

This is a standalone export of the public HeartQuest signup page from Zo Space.

It uses only one file: `index.html`. No React, Tailwind, npm, or external libraries are required.

## Get it from GitHub

The landing page is included in the `export/heartquest-latest` branch of the HeartQuest repository:

```bash
git clone -b export/heartquest-latest https://github.com/f7-rage-gremlin/heartquest.git
cd heartquest/heartquest-landing-page
```

If you already cloned the repository:

```bash
git fetch origin
git switch export/heartquest-latest
```

## Preview locally

Open `index.html` in a browser, or run a local server:

```bash
python3 -m http.server 8080
```

Then visit <http://localhost:8080>.

## Important

The signup form currently shows a confirmation message in the browser only. It does not save email addresses or send them anywhere, matching the original Zo Space page's current behaviour. A backend or form provider would be needed to collect signups.
