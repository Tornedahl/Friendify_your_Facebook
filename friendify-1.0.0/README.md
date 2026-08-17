# Friendify

**Facebook has a friends-only feed. It just refuses to make it your default.**

Buried under "See more" in the left sidebar, Facebook keeps a view called
**Feeds**, with a **Friends** tab showing only posts from people you're actually
connected with, in reverse chronological order. No suggested groups, no
recommended pages, no "you might like" filler.

It works well. The catch is that Facebook always reopens on Home, so you have to
navigate back to it by hand, every session, forever.

Friendify removes that step. Nothing else.

---

## What it does

- Opening `facebook.com` takes you straight to the friends feed
- Clicking the Facebook logo inside the app takes you there too
- Every other Facebook URL is untouched — Marketplace, groups, profiles,
  Messenger, notifications all behave exactly as before

## What it does not do

- **It does not block ads or hide posts.** It changes which view you land on,
  not what that view contains. If you want ads gone, use uBlock Origin or
  F.B. Purity alongside it.
- **It does not collect, transmit, or store any data.** No server, no
  analytics, no account, no telemetry.
- **It does not read page content.** No content scripts. It only looks at the
  address of the tab you're on.

## Why this exists

Somewhere along the way, opening Facebook stopped being a way to see what people
you know are up to. The default feed is now largely recommendations and ads, and
the friends feed survives as an option most people never find.

The gap between "the feature exists" and "the feature is one click away" isn't an
accident. An infinite recommendation feed holds more ad inventory than your
friends can ever post.

Friendify closes that gap on your own machine. It cannot change what Facebook
ranks, what your friends see, or how much anyone posts. It just decides where
your browser lands.

## Install

Not on the Chrome Web Store. Install it manually:

1. Download the latest `friendify-x.y.z.zip` from
   [Releases](../../releases), or clone this repo
2. Unzip it somewhere permanent — Chrome loads it from that folder every
   startup, so don't leave it in `~/Downloads`
3. Go to `chrome://extensions`
4. Turn on **Developer mode** (top right)
5. Click **Load unpacked** and select the folder

**Note:** on Windows and macOS, Chrome shows a "Disable developer mode
extensions" prompt at every startup while any unpacked extension is loaded.
That's Chrome's behaviour, not this extension's. On Linux it's quiet.

Works in Chrome, Edge, Brave, and other Chromium browsers. Firefox needs a
port — see below.

## How it works

Two mechanisms, because Facebook navigates in two ways.

`rules.json` — a [declarativeNetRequest](https://developer.chrome.com/docs/extensions/reference/api/declarativeNetRequest)
ruleset that redirects real page loads of the Facebook root URL before anything
renders, so you never see Home flash past. A second, higher-priority `allow`
rule stops the target from matching the first rule and looping.

`background.js` — Facebook is a single-page app. Clicking the home logo calls
`history.pushState` and issues no new request, so declarativeNetRequest can't
see it. `webNavigation.onHistoryStateUpdated` catches those. The cost is a full
page reload, which is visible. Fighting Facebook's own router would be faster
and much more fragile.

About 40 lines total. Read all of it before you install it.

## Permissions

| Permission | Why |
|---|---|
| `declarativeNetRequest` | Redirect the root URL to the friends feed. Declarative rules only. |
| `webNavigation` | Detect in-app navigations that issue no request. Scoped to `facebook.com`. |
| `*://*.facebook.com/*` | Required to redirect on that host. No content scripts, no page reads. |

## Known fragility

The whole thing rests on one URL:

```
https://www.facebook.com/?filter=friends&sk=h_chr
```

The day Meta changes that scheme, Friendify silently stops doing anything. If
that happens, open an issue — the fix is a one-line change to the constant in
`background.js` and the matching URL in `rules.json`.

## Firefox

Not ported. Firefox's declarativeNetRequest support is narrower, so `rules.json`
would have to go and both redirect paths move into `webNavigation`, at the cost
of Home briefly loading before the switch. PRs welcome.

## Not affiliated with Meta

Friendify is an independent, unofficial tool. "Facebook" and "Meta" are
trademarks of Meta Platforms, Inc. This project isn't endorsed by or connected
to them in any way.

## License

MIT — see [LICENSE](LICENSE).
