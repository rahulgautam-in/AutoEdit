/* AutoEdit sidebar collapse
 * Click the logo/brand to collapse the left sidebar to icons-only (and click
 * again to expand). Remembers the choice. Self-contained and defensive.
 */
(function () {
  "use strict";

  function init() {
    var sidebar = document.querySelector(".sidebar");
    var brand = document.querySelector(".sidebar-brand") || document.querySelector(".logo-mark");
    if (!sidebar || !brand) { return setTimeout(init, 600); }

    // Inject collapse styles once
    if (!document.getElementById("ae-sidebar-style")) {
      var st = document.createElement("style");
      st.id = "ae-sidebar-style";
      st.textContent =
        ".sidebar.ae-collapsed { width: 60px !important; min-width:60px !important; }" +
        ".sidebar.ae-collapsed .nav-tab span," +
        ".sidebar.ae-collapsed .logo-text," +
        ".sidebar.ae-collapsed .sidebar-brand .brand-sub { display:none !important; }" +
        ".sidebar.ae-collapsed .nav-tab { justify-content:center !important; }" +
        ".sidebar-brand { cursor:pointer; }" +
        ".ae-collapse-hint { font-size:10px; opacity:.5; }";
      document.head.appendChild(st);
    }

    // Restore saved state
    try {
      if (localStorage.getItem("ae_sidebar_collapsed") === "1") {
        sidebar.classList.add("ae-collapsed");
      }
    } catch (e) {}

    brand.title = "Click to collapse / expand the sidebar";
    brand.addEventListener("click", function (ev) {
      ev.preventDefault();
      var collapsed = sidebar.classList.toggle("ae-collapsed");
      try { localStorage.setItem("ae_sidebar_collapsed", collapsed ? "1" : "0"); } catch (e) {}
    });
  }

  init();
})();
