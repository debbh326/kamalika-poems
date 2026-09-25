# কবিতার খাতা — a poetry site for Maa

A GitHub Pages site for Bengali poems, with a phone-friendly writing screen at `/admin/`.
Poems are saved as small text files in this repo; GitHub rebuilds the site a minute or two after each save.

- **Public site:** `https://YOUR-GITHUB-USERNAME.github.io/YOUR-REPO-NAME/`
- **Writing screen:** the same address + `admin/`

Nothing to install, no build step, no monthly cost.

---

## Setup (about 15 minutes)

### 1. Put the files on GitHub

Create a new **public** repository (GitHub Pages is free for public repos), for example `maa-kobita`. Then either:

**With git:**
```bash
cd kobita-site
git init -b main
git add .
git commit -m "Poetry site"
git remote add origin https://github.com/YOUR-GITHUB-USERNAME/maa-kobita.git
git push -u origin main
```

**Or in the browser:** on the empty repo page choose *uploading an existing file* and drag in everything inside the `kobita-site` folder (not the folder itself). If the empty `_poems` folder gets skipped, that's fine; it's created with the first poem.

### 2. Point the writing screen at your repo

Open `admin/config.yml` and change the two lines marked ✏️:

```yaml
repo: YOUR-GITHUB-USERNAME/maa-kobita
display_url: https://YOUR-GITHUB-USERNAME.github.io/maa-kobita/
```

(If you named the repo `YOUR-GITHUB-USERNAME.github.io`, the site lives at the root and `display_url` is just `https://YOUR-GITHUB-USERNAME.github.io/`.)

### 3. Turn on GitHub Pages

Repo → **Settings → Pages → Build and deployment** → Source: **Deploy from a branch** → Branch: **main**, folder **/ (root)** → Save.

Watch the **Actions** tab: when "pages build and deployment" turns green, the site is live. It shows an empty-state message until the first poem arrives.

### 4. Make a sign-in token for her phone

GitHub → your avatar → **Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token**

- **Token name:** `Maa's phone`
- **Expiration:** the longest option offered (put a reminder in your calendar to renew it)
- **Repository access:** *Only select repositories* → this repo only
- **Permissions → Repository permissions → Contents:** **Read and write**
  (Metadata: read is added automatically. Nothing else is needed.)

Copy the token. It's shown only once.

The token can only touch this one repository. Anyone holding her unlocked phone could edit the poems, which is the same trust level as her WhatsApp. If the phone is lost, delete the token on that same GitHub page and the phone loses access immediately.

### 5. Set up her phone (do this in person)

1. Open `https://…/admin/` in Chrome.
2. Tap **Sign In with Token**, paste the token, sign in. The browser remembers it.
3. Chrome menu (⋮) → **Add to Home screen**. It appears as a red **ক** icon called *কবিতা লিখুন* and opens like an app.
4. Open **খাতার পরিচয় (About)** and fill in her name, a site name if she wants a different one, and a few lines about herself. Save.
5. Write one poem together so she sees the whole loop, including the site updating a minute later.
6. Make sure she has a Bengali keyboard she's comfortable with: Gboard → Settings → Languages → Add keyboard → Bengali. Pick whichever layout suits her: the full বাংলা layout, the transliteration layout (type *amar* → আমার), or handwriting, where she writes letters with her finger. The mic key does Bengali voice typing too.

**iPhone:** the home-screen app keeps separate storage from Safari, so sign in with the token *inside* the home-screen app, not just in Safari.

Then send her `GUIDE-bn.md` (a one-page Bengali how-to), or read through it with her.

---

## How things work

| Where | What |
|---|---|
| `_poems/*.md` | One file per poem. Fields: `title`, `poem` (plain text, line breaks kept), `date`. File names are the save time, e.g. `20260925-143012.md`. |
| `_data/about.yml` | Site name, her name, the about text. Edited from the phone. |
| `admin/config.yml` | The writing screen's fields and labels. |
| `admin/index.html` | Loads Sveltia CMS from its CDN. |
| `_layouts/`, `index.html`, `404.html` | Page templates. |
| `_includes/bn-date.html` | Turns dates into ২৫ সেপ্টেম্বর ২০২৬. |
| `assets/kobita.css` | All styling. Colours are the five variables at the top (light and dark). |

Poems are listed newest first. Poems with the same date are ordered by the time they were saved, so old notebook poems can be backdated and still land in a sensible order.

You can also add a poem by hand: create `_poems/anything.md` with front matter `title` and `date`, and write the poem as the Markdown body. Single line breaks are kept there too.

### Preview locally (optional)

```bash
gem install jekyll   # once
jekyll serve         # then open http://localhost:4000
```

### Custom domain (optional)

Settings → Pages → Custom domain. After that, update `display_url` in `admin/config.yml`.

---

## When something goes wrong

**She saved a poem but it isn't on the site.** Check the Actions tab. A red build usually means a broken file; open the newest file in `_poems/` and look for anything odd at the top. Otherwise the build just hasn't finished yet, or her browser is showing a cached page (pull down to refresh).

**The writing screen asks her to sign in again.** The token expired or the browser data was cleared. Make a new token (step 4) and sign in again (step 5.2).

**The writing screen won't load at all.** It pulls Sveltia CMS from `unpkg.com`; check that the site loads on another network. Sveltia CMS is still in beta; if an update ever breaks something, you can pin a version in `admin/index.html`, e.g. `https://unpkg.com/@sveltia/cms@0.221.1/dist/sveltia-cms.js` (the version this was built and tested against).

**Want to undo a change she made?** Every save is a commit. Open the file's history on GitHub and restore the earlier version.
