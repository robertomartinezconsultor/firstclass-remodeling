# Continue Here

Open this file first before making changes.

Last saved: `2026-04-02 10:27 AM CDT`

## Project

- Path: `/Users/cashamerica/FirstClassRemodelingTX`
- Public homepage in workspace: `index.html`
- Client launcher: `app.html`
- Client portal: `portal.html`
- Service workers: `sw.js`, `app-sw.js`
- Search control: `robots.txt`

## What Happened Today

- The user wanted all pending work closed out fast.
- The old homepage was too crowded, still had outdated lead copy, and was not safely published.
- The public contact email needed to be `estimates@firstclassremodelingtx.com`.
- The homepage needed to center on:
  - video first
  - `Ask Juan`
  - fast lead capture
  - no pricing, ROI, or budget talk
  - better iPhone behavior

## Local Changes Completed

- `index.html` was fully replaced with a lighter homepage focused on:
  - `Call Now`
  - `Ask Juan`
  - `WhatsApp`
  - `Private consultation request`
  - `Client Portal`
- The homepage now:
  - uses `videos/project-showcase.mp4` as the hero video
  - shows `Ask Juan` as a warm on-site advisor
  - avoids price/budget/ROI language
  - advertises `estimates@firstclassremodelingtx.com`
  - keeps the portal access small instead of dominating the page
  - is much simpler and easier to publish
- `robots.txt` was added locally to keep internal routes out of search:
  - `/app.html`
  - `/portal.html`
  - `/portal-admin.html`
  - `/ops-app.html`
  - `/monitor.html`
  - `/OPERATIONS_GUIDE.html`
- `sw.js` and `app-sw.js` are aligned on cache `first-class-portal-v6`

## Publish Status

- Two repos were involved:
  - `robertomartinezconsultor/firstclassremodelingtx`
  - `robertomartinezconsultor/firstclass-remodeling`
- The custom domain `firstclassremodelingtx.com` is actually served by:
  - `robertomartinezconsultor/firstclass-remodeling`
- `robertomartinezconsultor/firstclassremodelingtx` was updated first:
  - commit `36f4956d771e84f4b44852a5613cfc7b62b4c108`
  - message `Publish Ask Juan homepage and harden indexing`
- The real production repo was then synced directly via the GitHub API:
  - `index.html` commit `be0ada84a7adb199cf6ef8b815242bb3b095bc37`
  - `robots.txt` commit `376257b5a0eb8f637b84e1ac777e65361eba3337`
  - `sw.js` commit `2d79bdc3164b3efde3dd8c85fa8cef566de6c13d`
  - `app-sw.js` commit `6f42842ac226a14243753290b96b6cfbe1fd7c09`
- A GitHub Pages rebuild was explicitly requested on the live repo.
- Pages finished `built` for commit:
  - `6f42842ac226a14243753290b96b6cfbe1fd7c09`

## Live Verification

- As of `2026-04-02 10:19 AM CDT`, `https://firstclassremodelingtx.com/` returned the new markers:
  - `Ask Juan`
  - `Call, text, or ask Juan.`
  - `estimates@firstclassremodelingtx.com`
  - `Private consultation request`
- Old markers were no longer present in the live verification:
  - `Get Free Estimate`
  - `Avg. 78% ROI on home value`
- Live response headers showed:
  - HTTP `200`
  - `last-modified: Thu, 02 Apr 2026 15:19:16 GMT`
  - `etag: "69ce88f4-9635"`

## Later Homepage Rebalance

- The homepage was then refocused again so the main message is:
  - stylish kitchens
  - bathrooms with style
  - design-first remodeling
  - `Ask Juan` as support, not the main pitch
- Local/live homepage markers after the rebalance:
  - `Stylish kitchens and bathrooms, done right.`
  - `Questions? Ask Juan`
  - `Need a quick answer?`
  - `Kitchens and bathrooms with a stronger point of view.`
- Sync commits for the rebalance:
  - live repo `firstclass-remodeling`: `916951239f6f8a8bb96354e16f4015817cfd8f0b`
  - preview repo `firstclassremodelingtx`: `67c7c0c7c692d9bc6e2b59406c6dc2a7d37dfae3`
- Latest GitHub Pages build reported:
  - status `built`
  - commit `d640ca9369994433e24a580f8454b7f107016071`
  - updated at `2026-04-02T15:26:48Z`

## What To Check Next

1. Open `https://firstclassremodelingtx.com`
2. Test on iPhone Safari:
   - hero video loads
   - mobile sticky bar shows `Call / Ask Juan / WhatsApp`
   - Juan modal opens cleanly
   - consultation form submits
3. Confirm FormSubmit is activated for:
   - `estimates@firstclassremodelingtx.com`
4. Recheck search hardening:
   - `robots.txt` is live
   - internal routes are not indexable
5. Long-term cleanup:
   - keep `firstclass-remodeling` as the live source of truth, or move Pages cleanly and then remove duplicate-domain confusion

## Security Notes

- The public homepage no longer contains the old hidden marketing-hub logic.
- Internal admin URL/password references were scrubbed from the local operations docs.
- `robots.txt` now blocks internal routes from indexing.
- Residual risk still worth reviewing later:
  - `portal.html` depends on frontend access-code flow and backend Firestore rules
  - those rules were not audited from the server side in this session

## Access Notes

- Do not paste GitHub or API secrets into chats.
- GitHub publish in this session used authenticated connector access, not exposed raw tokens.
- Public website contact email is now:
  - `estimates@firstclassremodelingtx.com`

## If The User Asks "Did It Go Live?"

- Answer:
  - yes
  - the domain was fixed by publishing to the repo that actually serves production
  - the live repo is `robertomartinezconsultor/firstclass-remodeling`
  - the Pages rebuild completed on commit `6f42842ac226a14243753290b96b6cfbe1fd7c09`
