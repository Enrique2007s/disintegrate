// Toggle the entire default ruleset on/off
async function setEnabled(enabled) {
  await chrome.declarativeNetRequest.updateEnabledRulesets({
    enableRulesetIds: enabled ? ["default_filters"] : [],
    disableRulesetIds: enabled ? [] : ["default_filters"]
  });
  await chrome.storage.local.set({ enabled });
}

// Add a user filter (dynamic)
async function addUserFilter(urlFilter, id) {
  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [id],
    addRules: [{
      id,
      priority: 1,
      action: { type: "block" },
      condition: {
        urlFilter,
        resourceTypes: ["script", "image", "xmlhttprequest", "sub_frame"]
      }
    }]
  });
}

// Allowlist a domain (higher priority "allow" overrides block)
async function allowDomain(domain, id) {
  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [id],
    addRules: [{
      id,
      priority: 100,
      action: { type: "allow" },
      condition: {
        initiatorDomains: [domain],
        resourceTypes: ["script", "image", "xmlhttprequest", "sub_frame"]
      }
    }]
  });
}

// Count blocked requests for the popup badge
chrome.declarativeNetRequest.onRuleMatchedDebug.addListener((info) => {
  // Only for debugging — doesn't fire in production builds without feedback permission
  console.log("Blocked:", info.request.url);
});

chrome.runtime.onInstalled.addListener(async () => {
  const { enabled = true } = await chrome.storage.local.get("enabled");
  await setEnabled(enabled);
});