/* AutoEdit auto-update checker
 * On panel load, asks GitHub for the latest AutoEdit release. If it's newer
 * than this build, shows a small dismissible banner with a one-click link to
 * download the new installer. Fully defensive: any failure = silent no-op.
 */
(function () {
  "use strict";

  var REPO = "rahulgautam-in/AutoEdit";     // <-- your GitHub repo
  var CURRENT = "1.0.0";                      // <-- bump to match each release
  var API = "https://api.github.com/repos/" + REPO + "/releases/latest";

  function parseVer(v) {
    return String(v || "").replace(/^v/i, "").split(".").map(function (n) {
      return parseInt(n, 10) || 0;
    });
  }
  function isNewer(latest, current) {
    var a = parseVer(latest), b = parseVer(current);
    for (var i = 0; i < Math.max(a.length, b.length); i++) {
      if ((a[i] || 0) > (b[i] || 0)) return true;
      if ((a[i] || 0) < (b[i] || 0)) return false;
    }
    return false;
  }

  function openExternal(url) {
    try {
      // CEP: open in the user's default browser
      if (window.cep && window.cep.util && window.cep.util.openURLInDefaultBrowser) {
        window.cep.util.openURLInDefaultBrowser(url);
        return;
      }
    } catch (e) {}
    try { window.open(url, "_blank"); } catch (e) {}
  }

  function showBanner(tag, url) {
    if (document.getElementById("ae-update-banner")) return;
    var bar = document.createElement("div");
    bar.id = "ae-update-banner";
    bar.style.cssText =
      "position:fixed;left:0;right:0;top:0;z-index:99999;display:flex;" +
      "align-items:center;gap:10px;padding:8px 12px;font:12px/1.4 system-ui,sans-serif;" +
      "color:#eaf2ff;background:linear-gradient(90deg,#2f80ff,#4f9cf9);box-shadow:0 2px 8px rgba(0,0,0,.3)";
    var msg = document.createElement("span");
    msg.style.flex = "1";
    msg.textContent = "AutoEdit " + tag + " is available (you have " + CURRENT + ").";
    var btn = document.createElement("button");
    btn.textContent = "Download update";
    btn.style.cssText =
      "cursor:pointer;border:0;border-radius:6px;padding:5px 10px;font-weight:600;" +
      "background:#0a0e16;color:#fff";
    btn.onclick = function () { openExternal(url); };
    var x = document.createElement("button");
    x.textContent = "✕";
    x.title = "Dismiss";
    x.style.cssText = "cursor:pointer;border:0;background:transparent;color:#eaf2ff;font-size:14px";
    x.onclick = function () { bar.remove(); };
    bar.appendChild(msg); bar.appendChild(btn); bar.appendChild(x);
    document.body.appendChild(bar);
  }

  function check() {
    try {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", API, true);
      xhr.setRequestHeader("Accept", "application/vnd.github+json");
      xhr.timeout = 8000;
      xhr.onreadystatechange = function () {
        if (xhr.readyState !== 4) return;
        if (xhr.status < 200 || xhr.status >= 300) return;
        try {
          var data = JSON.parse(xhr.responseText);
          var tag = data.tag_name;
          if (tag && isNewer(tag, CURRENT)) {
            showBanner(tag, data.html_url || ("https://github.com/" + REPO + "/releases/latest"));
          }
        } catch (e) {}
      };
      xhr.send();
    } catch (e) {}
  }

  // Delay a moment so it never competes with panel startup.
  setTimeout(check, 4000);
})();
