# Get AutoEdit onto GitHub & build the installer (no command line)

Goal: put the `AutoEdit` folder on GitHub, then let GitHub build `AutoEdit-Setup.exe` for you on a cloud Windows machine.

---

## Step 1 — Make a GitHub account (skip if you have one)
Go to https://github.com and sign up (free).

## Step 2 — Create an empty repository
1. Click the **+** (top-right) → **New repository**.
2. Repository name: **`AutoEdit`**
3. Set it **Public** (required for free unlimited Actions minutes).
4. Do NOT add a README/license (we already have them).
5. Click **Create repository**. Leave that page open — note the URL, e.g. `https://github.com/<you>/AutoEdit`.

## Step 3 — Install GitHub Desktop
Download from https://desktop.github.com , install, and sign in with your GitHub account.

## Step 4 — Clone the empty repo
In GitHub Desktop: **File → Clone repository → URL tab →** paste your repo URL → choose a local folder → **Clone**.

## Step 5 — Copy the AutoEdit files in
1. Open the folder GitHub Desktop just cloned (it's empty).
2. Open `A:\_APP\auto_cut\AutoEdit`.
3. Select **everything inside** AutoEdit (including the hidden `.github` folder — turn on "Show hidden items" in Explorer's View menu) and copy it into the cloned folder.
   - Make sure `.github\workflows\build-installer.yml` came across — that's the build robot.

## Step 6 — Commit & push
Back in GitHub Desktop you'll see all the files listed. 
1. Bottom-left: type a summary like `Initial AutoEdit`.
2. Click **Commit to main** → then **Push origin** (top bar).

## Step 7 — Before the first build: two tiny edits on GitHub
On your repo page on github.com:
1. Open `installer/AutoEdit.iss` → click the pencil ✏️ → change `MyAppURL` to your repo URL → Commit.
2. (Recommended) Replace the `AppId` GUID with a fresh one — but the included one works fine for a first test, so you can skip this now.

## Step 8 — Run the build
1. On your repo page, click the **Actions** tab.
2. If asked, click **"I understand my workflows, enable them."**
3. Click **"Build AutoEdit Installer"** → **Run workflow** → **Run workflow** (green button).
4. Wait ~10–20 min. When the run shows a green check, open it and download **`AutoEdit-Setup`** from the **Artifacts** section at the bottom.

That downloaded `.exe` is your installer. 🎉

---

## If the build fails (normal on a first run)
Open the failed step's log, copy the red error text, and send it to me. First-build dependency tweaks are common and quick to fix. We then just re-run the workflow.

## Later: one-click releases
Once it builds cleanly, creating a **Release** with a tag like `v1.0.0` will auto-build and attach `AutoEdit-Setup.exe` to that release — that's the link you put on your website.
