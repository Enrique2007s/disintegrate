const toggle = document.getElementById('toggle');

chrome.storage.local.get({'enabled': true}, ({enabled}) => {
  toggle.checked = enabled;
});

toggle.addEventListener('change', async () => {
    const enabled = toggle.checked;
    await chrome.declarativeNetRequest.updateEnabledRulesets({
      enableRulesetIds: enabled ? ["default_filters"] : [],
      disableRulesetIds: enabled ? [] : ["default_filters"]
    });
    await chrome.storage.local.set({ enabled });
  });
