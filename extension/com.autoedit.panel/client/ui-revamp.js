/* AutoEdit UI revamp
 * - Removes the left sidebar
 * - Adds a top brand bar (logo + "AutoEdit Studio" + version)
 * - Adds 4 big rounded tab buttons in one row (Cut / Captions / Video / Settings)
 *   which drive the existing (now hidden) nav-tabs, so all logic still works
 * - Puts version + a clickable GitHub link at the TOP of Settings
 * Self-contained + defensive. To rename a tab, edit the TABS array below.
 */
(function () {
  "use strict";

  var REPO = "rahulgautam-in/AutoEdit";
  var VERSION = "1.0.0";
  var TABS = [["cut", "Cut"], ["captions", "Captions"], ["video", "Video"], ["settings", "Settings"]];

  function openExternal(url) {
    try {
      if (window.cep && window.cep.util && window.cep.util.openURLInDefaultBrowser) {
        window.cep.util.openURLInDefaultBrowser(url); return;
      }
    } catch (e) {}
    try { window.open(url, "_blank"); } catch (e) {}
  }

  function build() {
    var app = document.querySelector(".app");
    var content = document.querySelector(".content-area");
    if (!app || !content) return setTimeout(build, 500);

    // ---- styles ----
    if (!document.getElementById("ae-ui-style")) {
      var st = document.createElement("style");
      st.id = "ae-ui-style";
      st.textContent =
        ".sidebar{display:none !important;}" +
        ".app{display:block !important;}" +
        ".content-area{width:100% !important;max-width:100% !important;}" +
        ".content-kicker-row{display:none !important;}" +               /* hide redundant chip */
        "#ae-topbar{display:flex;flex-direction:column;gap:12px;padding:14px 16px 6px;}" +
        "#ae-brand{display:flex;align-items:center;gap:10px;}" +
        "#ae-brand img{width:28px;height:28px;border-radius:7px;}" +
        "#ae-brand .ae-name{font-weight:700;font-size:15px;color:#eaf2ff;letter-spacing:.3px;}" +
        "#ae-brand .ae-ver{margin-left:auto;font-size:11px;color:#9fb2d0;background:#141c2b;" +
          "border:1px solid #223049;padding:3px 9px;border-radius:20px;cursor:pointer;}" +
        "#ae-tabs{display:flex;gap:10px;}" +
        "#ae-tabs .ae-tab{flex:1;text-align:center;padding:14px 8px;border-radius:14px;cursor:pointer;" +
          "font-weight:600;font-size:13px;color:#c7d5ea;background:#111a28;border:1px solid #1e2b40;transition:.15s;}" +
        "#ae-tabs .ae-tab:hover{border-color:#2f80ff;color:#fff;}" +
        "#ae-tabs .ae-tab.active{background:linear-gradient(180deg,#2f80ff,#2569d8);color:#fff;" +
          "border-color:#2f80ff;box-shadow:0 4px 14px rgba(47,128,255,.35);}";
      document.head.appendChild(st);
    }

    // ---- top brand + tab bar ----
    if (!document.getElementById("ae-topbar")) {
      var logoSrc = "";
      var lm = document.querySelector(".logo-mark");
      if (lm) logoSrc = lm.src;

      var bar = document.createElement("div");
      bar.id = "ae-topbar";
      bar.innerHTML =
        '<div id="ae-brand">' +
          (logoSrc ? '<img src="' + logoSrc + '" alt="AutoEdit"/>' : "") +
          '<span class="ae-name">AutoEdit Studio</span>' +
          '<span class="ae-ver" id="ae-ver" title="Open AutoEdit on GitHub">v' + VERSION + "</span>" +
        "</div>" +
        '<div id="ae-tabs"></div>';
      content.parentNode.insertBefore(bar, content);

      var host = bar.querySelector("#ae-tabs");
      TABS.forEach(function (t) {
        var b = document.createElement("div");
        b.className = "ae-tab" + (t[0] === "cut" ? " active" : "");
        b.dataset.nav = t[0];
        b.textContent = t[1];
        b.addEventListener("click", function () {
          var orig = document.querySelector('.nav-tab[data-nav="' + t[0] + '"]');
          if (orig) orig.click();
          host.querySelectorAll(".ae-tab").forEach(function (x) { x.classList.remove("active"); });
          b.classList.add("active");
        });
        host.appendChild(b);
      });

      // version chip -> GitHub
      var ver = bar.querySelector("#ae-ver");
      if (ver) ver.addEventListener("click", function () { openExternal("https://github.com/" + REPO); });
    }

    // ---- Settings: version + GitHub at the very top ----
    var settings = document.getElementById("panel-settings");
    if (settings && !document.getElementById("ae-settings-head")) {
      var head = document.createElement("div");
      head.id = "ae-settings-head";
      head.style.cssText =
        "display:flex;align-items:center;gap:12px;padding:14px;margin-bottom:14px;" +
        "background:#0f1826;border:1px solid #1e2b40;border-radius:12px;";
      head.innerHTML =
        '<span style="font-weight:700;color:#eaf2ff;font-size:15px;">AutoEdit</span>' +
        '<span style="font-size:12px;color:#9fb2d0;background:#141c2b;border:1px solid #223049;' +
          'padding:3px 10px;border-radius:20px;">v' + VERSION + "</span>" +
        '<a href="#" id="ae-gh" style="margin-left:auto;color:#4f9cf9;text-decoration:none;' +
          'font-weight:600;font-size:13px;">GitHub &#8599;</a>';
      settings.insertBefore(head, settings.firstChild);
      var gh = head.querySelector("#ae-gh");
      gh.addEventListener("click", function (e) { e.preventDefault(); openExternal("https://github.com/" + REPO); });
    }

    // ---- make any existing About links open in the real browser ----
    Array.prototype.forEach.call(document.querySelectorAll("a.about-link"), function (a) {
      a.addEventListener("click", function (e) { e.preventDefault(); openExternal(a.href); });
    });
  }

  build();
})();
