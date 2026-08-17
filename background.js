// Ändra denna om vänflödets URL visar sig vara en annan.
// Måste matcha redirect-URL:en i rules.json.
const TARGET = "https://www.facebook.com/?filter=friends&sk=h_chr";

// Sant om URL:en är Facebooks "Hem" — dvs roten utan vänfiltret.
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

// DNR-reglerna fångar bara riktiga sidladdningar. Facebook är en SPA:
// klick på hem-ikonen gör history.pushState, ingen ny request. Den här
// lyssnaren fångar just de fallen.
chrome.webNavigation.onHistoryStateUpdated.addListener(
  (details) => {
    if (details.frameId !== 0) return;
    if (!isBareHome(details.url)) return;
    chrome.tabs.update(details.tabId, { url: TARGET });
  },
  { url: [{ hostSuffix: "facebook.com" }] }
);
