# Browser Extension Template

## Changelog

See the [changelog](CHANGELOG.md).

## Extension features

Template includes:
- background script,
- content scripts injection,
- options page,
- browser action with popup,
- lodash library.

To change [browser action](https://developer.chrome.com/extensions/browserAction)
to [page action](https://developer.chrome.com/extensions/pageAction),
replace `browser_action` with `page_action` in `manifest.json`
and add page action activation [event rules](https://developer.chrome.com/extensions/manifest/event_rules).

## Development

Extension uses Webpack to bundle and build sources.

Install dependencies:

```bash
npm install
```

Run in auto-refresh mode - this will refresh not only bundle on every change,
but also reload extension and refresh current page:

```bash
npm run watch
```

Add extension at [chrome://extensions/](chrome://extensions/)
using "load unpacked" button and selecting `dist` directory. 

For the auto-refresh to work background page must be active.
To assure it, open inspector for "background page" item
from "inspect views" section in extension details.

## Build for Chrome Web Store

```bash
npm run build:prod
```

`release.zip` file is generated in the `dist/` directory.
