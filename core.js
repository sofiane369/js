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
    console.log("event recieved ********");
    const host = new URL(e.origin).hostname;
    if (!ALLOWED_DOMAINS.includes(host)) return;

    const msg = e.data || {};
    const type = msg.t;
    const name = msg.n;
    const params = msg.d || {};
    const route = msg.r || {};

    if (!name) return;

    if (debug) {
      if (route.a !== false) {
        console.log("posthog ==> ", name, JSON.stringify(params));
        posthog.capture(name, params);
      }
      if (route.x !== false) {
        let x = "";
        if (type === "s") x = "track";
        if (type === "c") x = "trackCustom";
        console.log("meta ==>", x, name, JSON.stringify(params));
      }
      return;
    }

    if (route.a !== false) posthog.capture(name, params);
    if (route.x !== false) {
      if (type === "s") fbq("track", name, params);
      if (type === "c") fbq("trackCustom", name, params);
    }
  });
})();
