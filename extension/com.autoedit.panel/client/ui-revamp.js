/* AutoEdit UI revamp (v4)
 * - Hides left sidebar + old section-title header
 * - Website-style top bar (scrolls away): logo + "AutoEdit Studio", with the
 *   reload + CONNECTED controls (shrunk) and the version chip on the right
 * - 5 big rounded tabs: Media | Cut | Captions | Video | Settings
 *     Media tab reveals the media picker (#clipSection + #workspaceStage);
 *     it is hidden on the other tabs so they stay clean.
 * - Footer: History + Outputs on ONE line
 * - Settings: version + clickable GitHub at the top
 */
(function () {
  "use strict";

  var REPO = "rahulgautam-in/AutoEdit";
  var VERSION = "1.0.0";
  // First entry is the default view.
  var TABS = [["media", "Media"], ["cut", "Cut"], ["captions", "Captions"], ["video", "Video"], ["settings", "Settings"]];
  var REAL = { cut: 1, captions: 1, video: 1, settings: 1 };  // tabs backed by a real nav-panel

  function openExternal(url) {
    try {
      if (window.cep && window.cep.util && window.cep.util.openURLInDefaultBrowser) {
        window.cep.util.openURLInDefaultBrowser(url); return;
      }
    } catch (e) {}
    try { window.open(url, "_blank"); } catch (e) {}
  }

  function build() {
    var main = document.querySelector(".main");
    if (!main) return setTimeout(build, 500);

    if (!document.getElementById("ae-ui-style")) {
      var st = document.createElement("style");
      st.id = "ae-ui-style";
      st.textContent =
        ".sidebar{display:none !important;}" +
        ".content-header{display:none !important;}" +
        /* Media picker: shown only in Media mode */
        ".main:not(.ae-media-mode) #clipSection,.main:not(.ae-media-mode) #workspaceStage{display:none !important;}" +
        ".main.ae-media-mode .nav-panel{display:none !important;}" +
        /* Top bar */
        "#ae-topbar{display:flex;flex-direction:column;gap:12px;margin:2px 0 14px;}" +
        "#ae-brand{display:flex;align-items:center;gap:10px;}" +
        "#ae-brand img{width:28px;height:28px;border-radius:7px;}" +
        "#ae-brand .ae-name{font-weight:700;font-size:15px;color:#eaf2ff;letter-spacing:.3px;}" +
        "#ae-brand .ae-right{margin-left:auto;display:flex;align-items:center;gap:6px;}" +
        "#ae-brand .ae-right #refreshAllBtn{transform:scale(.78);transform-origin:center;}" +
        "#ae-brand .ae-right #connStatus{transform:scale(.85);transform-origin:center;}" +
        "#ae-brand .ae-ver{font-size:11px;color:#9fb2d0;background:#141c2b;border:1px solid #223049;" +
          "padding:3px 9px;border-radius:20px;cursor:pointer;}" +
        "#ae-tabs{display:flex;gap:8px;}" +
        "#ae-tabs .ae-tab{flex:1;text-align:center;padding:12px 6px;border-radius:13px;cursor:pointer;" +
          "font-weight:600;font-size:12.5px;color:#c7d5ea;background:#111a28;border:1px solid #1e2b40;transition:.15s;}" +
        "#ae-tabs .ae-tab:hover{border-color:#2f80ff;color:#fff;}" +
        "#ae-tabs .ae-tab.active{background:linear-gradient(180deg,#2f80ff,#2569d8);color:#fff;" +
          "border-color:#2f80ff;box-shadow:0 4px 14px rgba(47,128,255,.35);}" +
        /* Footer: History + Outputs on one line */
        ".content-footer{display:flex !important;flex-wrap:wrap;align-items:center;column-gap:8px;}" +
        ".content-footer .job-history-bar{order:1;}" +
        ".content-footer .output-toggle-bar{order:2;margin-left:auto;}" +
        ".content-footer .job-history,.content-footer .job-queue-bar,.content-footer .output-browser{order:3;flex:1 0 100%;}";
      document.head.appendChild(st);
    }

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
          '<span class="ae-right"><span class="ae-ver" id="ae-ver" title="Open AutoEdit on GitHub">v' + VERSION + "</span></span>" +
        "</div>" +
        '<div id="ae-tabs"></div>';
      main.insertBefore(bar, main.firstChild);

      var right = bar.querySelector(".ae-right");
      var ver = bar.querySelector("#ae-ver");
      var refresh = document.getElementById("refreshAllBtn");
      var conn = document.getElementById("connStatus");
      if (refresh) right.insertBefore(refresh, ver);
      if (conn) right.insertBefore(conn, ver);

      var host = bar.querySelector("#ae-tabs");
      function activate(nav, btn) {
        if (nav === "media") {
          main.classList.add("ae-media-mode");
        } else {
          main.classList.remove("ae-media-mode");
          var orig = document.querySelector('.nav-tab[data-nav="' + nav + '"]');
          if (orig) orig.click();
        }
        host.querySelectorAll(".ae-tab").forEach(function (x) { x.classList.remove("active"); });
        btn.classList.add("active");
        try { main.scrollTop = 0; } catch (e) {}
      }
      TABS.forEach(function (t, i) {
        var b = document.createElement("div");
        b.className = "ae-tab" + (i === 0 ? " active" : "");
        b.dataset.nav = t[0];
        b.textContent = t[1];
        b.addEventListener("click", function () { activate(t[0], b); });
        host.appendChild(b);
      });

      // default view = Media
      main.classList.add("ae-media-mode");

      if (ver) ver.addEventListener("click", function () { openExternal("https://github.com/" + REPO); });
    }

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
      head.querySelector("#ae-gh").addEventListener("click", function (e) {
        e.preventDefault(); openExternal("https://github.com/" + REPO);
      });
    }

    Array.prototype.forEach.call(document.querySelectorAll("a.about-link"), function (a) {
      a.addEventListener("click", function (e) { e.preventDefault(); openExternal(a.href); });
    });
  }

  build();
})();
