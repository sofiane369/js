(function () {
  // Récupère la liste des domaines autorisés passée via script tag
  const scriptTag = document.currentScript;
  const allowedAttr = scriptTag?.getAttribute("data-allowed") || "";
  const debug = scriptTag?.hasAttribute("debug") || false;
  const ALLOWED_DOMAINS = allowedAttr
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  // Listener d’événement
  window.addEventListener("message", (e) => {
    //console.log("event recieved ********");
    try {
      const host = new URL(e.origin).hostname;
      if (!ALLOWED_DOMAINS.includes(host)) return;
    } catch (err) {
      if (debug) console.warn("Invalid origin in message event", e.origin);
      return;
    }

    const message = e.data || {};

    if (debug) {
      console.log("precore event message ==>", JSON.stringify(message));
    }

    const frame = document.getElementById("coreframe");
    if (!frame || !frame.contentWindow) return;

    const coreOrigin =
      frame.getAttribute("data-sync-origin") || "https://domain1.com";

    frame.contentWindow.postMessage(message, coreOrigin);
  });
})();
