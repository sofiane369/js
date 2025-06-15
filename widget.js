(function () {
  const scriptTag = document.currentScript;
  const allowedAttr = scriptTag?.getAttribute("data-allowed") || "";
  const debug = scriptTag?.hasAttribute("debug") || false;

  const ALLOWED_DOMAINS = allowedAttr
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  window.addEventListener("message", (e) => {
    try {
      const host = new URL(e.origin).hostname;
      if (!ALLOWED_DOMAINS.includes(host)) return;

      const msg = e.data || {};
      const type = msg.type || msg.t;
      const iframeId = msg.iframeId;
      const height = msg.height;
      const name = msg.n;
      const params = msg.d || {};
      const route = msg.r || {};

      if (debug) console.log("📩 Message received:", msg);

      // 🔁 Resize iframe
      if (type === "setHeight" && typeof height === "number" && iframeId) {
        const iframe = document.getElementById(iframeId);
        if (iframe) {
          iframe.style.height = `${height}px`;
          if (debug) console.log(`📏 Resized iframe #${iframeId} to ${height}px`);
        } else if (debug) {
          console.warn(`⚠️ iframe with id "${iframeId}" not found`);
        }
        return;
      }

      // 📊 Event tracking (iframeId facultatif)
      if ((type === "event" || type === "s" || type === "c") && name) {
        // posthog
        if (route.a !== false && typeof posthog !== "undefined") {
          posthog.capture(name, params);
          if (debug) console.log("🪪 posthog.capture:", name, params);
        }

        // fbq
        if (route.x !== false && typeof fbq !== "undefined") {
          if (type === "s") {
            fbq("track", name, params);
            if (debug) console.log("📈 fbq.track:", name, params);
          }
          if (type === "c") {
            fbq("trackCustom", name, params);
            if (debug) console.log("📈 fbq.trackCustom:", name, params);
          }
        }
      }
    } catch (err) {
      if (debug) console.error("❌ Error in widget-bridge handler:", err);
    }
  });
})();
