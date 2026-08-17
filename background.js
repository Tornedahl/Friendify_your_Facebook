// Change this if the friends feed URL ever turns out to be different.
// Must match the redirect URL in rules.json.
const TARGET = "https://www.facebook.com/?filter=friends&sk=h_chr";

// True if the URL is Facebook's "Home" — i.e. the root without the friends filter.
function isBareHome(urlString) {
  let url;
  try {
    url = new URL(urlString);
  } catch {
    return false;
  }
  if (!/(^|\.)facebook\.com$/.test(url.hostname)) return false;
  if (url.pathname !== "/") return false;
  return url.searchParams.get("filter") !== "friends";
}

// The DNR rules only catch real page loads. Facebook is an SPA: clicking
// the home icon calls history.pushState, issuing no new request. This
// listener catches exactly those cases.
chrome.webNavigation.onHistoryStateUpdated.addListener(
  (details) => {
    if (details.frameId !== 0) return;
    if (!isBareHome(details.url)) return;
    chrome.tabs.update(details.tabId, { url: TARGET });
  },
  { url: [{ hostSuffix: "facebook.com" }] }
);
