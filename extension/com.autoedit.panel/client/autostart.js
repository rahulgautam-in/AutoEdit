/* AutoEdit auto-start
 * Ensures the local AI backend is running — with NO console window — the moment
 * the panel opens. Runs inside the CEP panel (Node enabled via --enable-nodejs).
 * Fully defensive: if anything is unavailable it does nothing and lets main.js
 * handle connection/reconnect as usual.
 */
(function () {
  "use strict";

  var BACKEND = "http://127.0.0.1:5679";
  var HEALTH = BACKEND + "/health";

  function hasNode() {
    try { return typeof require === "function"; } catch (e) { return false; }
  }

  function ping(cb) {
    try {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", HEALTH, true);
      xhr.timeout = 1500;
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) cb(xhr.status >= 200 && xhr.status < 500);
      };
      xhr.ontimeout = function () { cb(false); };
      xhr.onerror = function () { cb(false); };
      xhr.send();
    } catch (e) { cb(false); }
  }

  // Read the install folder the installer recorded: HKCU\Software\AutoEdit\InstallPath
  function getInstallPath(cb) {
    if (!hasNode()) { cb(null); return; }
    try {
      var cp = require("child_process");
      cp.exec('reg query "HKCU\\Software\\AutoEdit" /v InstallPath', function (err, stdout) {
        if (err || !stdout) { cb(null); return; }
        var m = stdout.match(/InstallPath\s+REG_SZ\s+(.+)/);
        cb(m ? m[1].trim() : null);
      });
    } catch (e) { cb(null); }
  }

  // Launch the server hidden via the bundled VBS launcher (no console window).
  function launchServer() {
    if (!hasNode()) return;
    getInstallPath(function (dir) {
      if (!dir) return; // dev install without registry key — main.js shows Reconnect
      try {
        var cp = require("child_process");
        cp.spawn("wscript.exe", [dir + "\\AutoEdit-Launcher.vbs"],
                 { detached: true, stdio: "ignore", windowsHide: true }).unref();
      } catch (e) {}
    });
  }

  function waitUntilUp(tries) {
    if (tries <= 0) return;
    ping(function (ok) {
      if (ok) return; // up — main.js takes over from here
      setTimeout(function () { waitUntilUp(tries - 1); }, 1500);
    });
  }

  // On panel load: if the backend isn't already reachable, start it hidden and wait.
  ping(function (ok) {
    if (ok) return;
    launchServer();
    waitUntilUp(24); // ~36s budget for a cold first start
  });
})();
