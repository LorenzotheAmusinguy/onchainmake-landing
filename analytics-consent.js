(function () {
  "use strict";

  var MEASUREMENT_ID = "G-XLG2N4EMG5";
  var STORAGE_KEY = "ocm_cookie_consent_v1";
  var CONSENT_VERSION = "2026-07-30";
  var analyticsLoaded = false;

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () {
    window.dataLayer.push(arguments);
  };

  // Default state: no Google storage and no data transfer because the Google tag
  // itself is not loaded until analytics consent has been granted.
  window.gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
    functionality_storage: "granted",
    security_storage: "granted"
  });

  function readPreference() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;

      var parsed = JSON.parse(raw);
      if (!parsed || parsed.version !== CONSENT_VERSION) return null;
      if (parsed.analytics !== "granted" && parsed.analytics !== "denied") return null;

      return parsed;
    } catch (error) {
      return null;
    }
  }

  function savePreference(value) {
    var preference = {
      version: CONSENT_VERSION,
      analytics: value,
      updatedAt: new Date().toISOString()
    };

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preference));
    } catch (error) {
      // If local storage is unavailable, the privacy-preserving default remains active.
    }

    return preference;
  }

  function loadAnalytics() {
    if (analyticsLoaded || document.querySelector('script[data-ocm-ga4="true"]')) return;
    analyticsLoaded = true;

    window.gtag("consent", "update", {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "granted"
    });
    window.gtag("set", "ads_data_redaction", true);
    window.gtag("js", new Date());
    window.gtag("config", MEASUREMENT_ID, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      anonymize_ip: true,
      send_page_view: true
    });

    var script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(MEASUREMENT_ID);
    script.setAttribute("data-ocm-ga4", "true");
    document.head.appendChild(script);
  }

  function deleteCookie(name, domain) {
    var base = name + "=; Max-Age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax";
    document.cookie = domain ? base + "; domain=" + domain : base;
  }

  function removeAnalyticsCookies() {
    var host = window.location.hostname;
    var domains = ["", host, "." + host];
    var labels = host.split(".");

    if (labels.length >= 2) {
      var registrableDomain = labels.slice(-2).join(".");
      domains.push(registrableDomain, "." + registrableDomain);
    }

    var cookieNames = document.cookie
      .split(";")
      .map(function (entry) { return entry.split("=")[0].trim(); })
      .filter(function (name) {
        return name === "_ga" ||
          name === "_gid" ||
          name === "_gat" ||
          name.indexOf("_ga_") === 0 ||
          name.indexOf("_gac_") === 0 ||
          name.indexOf("_gcl_") === 0;
      });

    cookieNames.forEach(function (name) {
      domains.forEach(function (domain) {
        deleteCookie(name, domain || null);
      });
    });
  }

  function denyAnalytics(options) {
    var shouldReload = options && options.reload === true;

    savePreference("denied");
    window.gtag("consent", "update", {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "denied"
    });
    removeAnalyticsCookies();
    hideBanner();

    if (shouldReload) {
      window.setTimeout(function () {
        window.location.reload();
      }, 120);
    }
  }

  function acceptAnalytics() {
    savePreference("granted");
    loadAnalytics();
    hideBanner();
  }

  function getBanner() {
    return document.getElementById("ocm-consent-root");
  }

  function hideBanner() {
    var root = getBanner();
    if (root) root.hidden = true;
  }

  function showBanner() {
    var root = getBanner();
    if (root) {
      root.hidden = false;
      var title = root.querySelector("#ocm-consent-title");
      if (title) title.focus({ preventScroll: true });
    }
  }

  function createBanner() {
    if (getBanner()) return;

    var root = document.createElement("div");
    root.id = "ocm-consent-root";
    root.className = "ocm-consent-root";
    root.innerHTML = [
      '<section class="ocm-consent-panel" role="dialog" aria-modal="false" aria-labelledby="ocm-consent-title" aria-describedby="ocm-consent-copy">',
      '  <div class="ocm-consent-header">',
      '    <div>',
      '      <h2 class="ocm-consent-title" id="ocm-consent-title" tabindex="-1">Your privacy choices</h2>',
      '      <p class="ocm-consent-copy" id="ocm-consent-copy">We use necessary technologies to operate this website. With your permission, we also use Google Analytics 4 to understand visits and improve the Phase 0 pilot. Analytics remains off unless you accept. Read our <a href="cookies.html">Cookie Policy</a>.</p>',
      '    </div>',
      '    <button type="button" class="ocm-consent-close" data-consent-close aria-label="Close and keep optional cookies off">&times;</button>',
      '  </div>',
      '  <div class="ocm-consent-actions">',
      '    <button type="button" class="ocm-consent-btn ocm-consent-btn--reject" data-consent-reject>Reject optional</button>',
      '    <button type="button" class="ocm-consent-btn ocm-consent-btn--accept" data-consent-accept>Accept analytics</button>',
      '  </div>',
      '</section>'
    ].join("\n");

    document.body.appendChild(root);

    root.querySelector("[data-consent-accept]").addEventListener("click", acceptAnalytics);
    root.querySelector("[data-consent-reject]").addEventListener("click", function () {
      denyAnalytics({ reload: analyticsLoaded });
    });
    root.querySelector("[data-consent-close]").addEventListener("click", function () {
      denyAnalytics({ reload: analyticsLoaded });
    });
  }

  function bindSettingsButtons() {
    document.querySelectorAll("[data-cookie-settings]").forEach(function (button) {
      if (button.getAttribute("data-cookie-settings-bound") === "true") return;
      button.setAttribute("data-cookie-settings-bound", "true");
      button.addEventListener("click", function () {
        createBanner();
        showBanner();
      });
    });
  }

  function initialiseInterface() {
    createBanner();
    bindSettingsButtons();

    if (readPreference()) {
      hideBanner();
    } else {
      showBanner();
    }
  }

  var savedPreference = readPreference();
  if (savedPreference && savedPreference.analytics === "granted") {
    loadAnalytics();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialiseInterface, { once: true });
  } else {
    initialiseInterface();
  }

  window.OCMConsent = {
    open: function () {
      createBanner();
      bindSettingsButtons();
      showBanner();
    },
    acceptAnalytics: acceptAnalytics,
    rejectOptional: function () {
      denyAnalytics({ reload: analyticsLoaded });
    },
    getPreference: readPreference
  };
})();
