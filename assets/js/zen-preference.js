(() => {
  const script = document.currentScript;
  const storageKey = "aki-zen-mode-enabled";
  const siteDefault = script?.dataset.defaultZen === "true";

  const readPreference = () => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved !== null) return saved === "true";

      const a11ySettings = JSON.parse(localStorage.getItem("a11ySettings") || "{}");
      if (Object.prototype.hasOwnProperty.call(a11ySettings, "zenMode")) {
        return Boolean(a11ySettings.zenMode);
      }
    } catch {
      // Storage can be unavailable in strict privacy modes; use the site default.
    }

    return siteDefault;
  };

  const syncPreference = (enabled) => {
    try {
      localStorage.setItem(storageKey, String(enabled));
    } catch {
      // Zen mode still works for the current page when storage is unavailable.
    }

    const button = document.getElementById("zen-mode-button");
    if (button) {
      button.setAttribute("aria-pressed", String(enabled));
      button.setAttribute(
        "aria-label",
        button.getAttribute(enabled ? "data-title-i18n-enable" : "data-title-i18n-disable"),
      );
    }

    document.querySelectorAll('input[id$="-zen-mode"]').forEach((control) => {
      control.checked = enabled;
    });

    if (window.A11yPanel && window.A11yPanel.getSettings().zenMode !== enabled) {
      window.A11yPanel.updateSetting("zenMode", enabled);
    }
  };

  window.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("zen-mode-button");
    if (!button || typeof window._toggleZenMode !== "function") return;

    const preferred = readPreference();
    const active = document.body.classList.contains("zen-mode-enable");
    if (preferred !== active) {
      window._toggleZenMode(button, { scrollToHeader: false });
    }
    syncPreference(preferred);

    new MutationObserver(() => {
      syncPreference(document.body.classList.contains("zen-mode-enable"));
    }).observe(document.body, { attributes: true, attributeFilter: ["class"] });
  });
})();
