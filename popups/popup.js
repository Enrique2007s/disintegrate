const toggle = document.getElementById('toggle');

// Load persisted state
(async () => {
  const { enabled = true } = await chrome.storage.local.get('enabled');
  toggle.checked = enabled;
})();

toggle.addEventListener('change', async () => {
  const enabled = toggle.checked;

  // 1. Persist first — survives popup closing mid-await
  await chrome.storage.local.set({ enabled });

  // 2. Then update the ruleset — log if it fails
  try {
    await chrome.declarativeNetRequest.updateEnabledRulesets({
      enableRulesetIds: enabled ? ['default_filters'] : [],
      disableRulesetIds: enabled ? [] : ['default_filters']
    });
  } catch (err) {
    console.error('updateEnabledRulesets failed:', err);
  }
});