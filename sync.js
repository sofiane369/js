(function () {
  function getSyncOrigin() {
    const frame = document.getElementById('syncframe');
    return frame?.getAttribute('data-sync-origin') || 'https://domain.com';
  }

  function postSyncMessage(data) {
    const frame = document.getElementById('syncframe');
    if (!frame || !frame.contentWindow) return;
    frame.contentWindow.postMessage(data, getSyncOrigin());
  }

  // Standard Meta event
  window.sendStandardStep = function (name, params = {}) {
    postSyncMessage({ s: name, p: params });
  };

  // Custom Meta event
  window.sendCustomStep = function (name, params = {}) {
    postSyncMessage({ c: name, p: params });
  };
})();
