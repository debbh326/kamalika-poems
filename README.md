# লেখার খাতা — a writing site for Maa

A GitHub Pages site for her poems, short stories and story series, in Bengali and English, with a phone-friendly writing screen at `/admin/`. Everything she writes is saved as a small text file in this repo, and GitHub rebuilds the site a minute or two after each save.

- **Public site:** https://debbh326.github.io/kamalika-poems/
- **Writing screen:** https://debbh326.github.io/kamalika-poems/admin/

Nothing to install, no build step, no monthly cost.

The look follows Jekyll's Chirpy theme: sidebar with photo and menu, cards for each piece, a right-hand column with recent pieces, search, and a light/dark switch. It's built directly into this site rather than using the Chirpy theme itself, because Chirpy needs a GitHub Actions build. This keeps the plain "Deploy from a branch" setup.

The menu and labels are in English with Bengali alongside, so visitors who don't read Bengali can find their way around.

---

## Updating the live site to this version

The repo already has the earlier, poems-only version, and this folder is a clone of it. From this folder:

```bash
git pull                     # first, in case she has saved anything from her phone
git add -A                   # -A also records the three removed files listed below
git commit -m "Chirpy-style layout; stories, series and English writing"
git push
```

**In the browser instead:** repo page → *Add file → Upload files* → drag in everything inside `kobita-site` except the hidden `.git` folder. Afterwards, delete these three old files, which are no longer used (they do no harm if left):
`_layouts/poem.html`, `_includes/bn-date.html`, `assets/kobita.css`.

**`_data/about.yml` holds what she types under খাতার পরিচয় (About).** On 25 Sep 2026 the live copy was still the untouched default, so replacing it is fine. If she has filled it in since, `git pull` will stop and name that file. Run `git restore --source=HEAD --staged --worktree _data/about.yml` to drop this folder's copy, then `git pull` again. Her text stays, and the new optional fields (tagline, photo, English about) show up empty in the form.

After the push, watch the **Actions** tab. When "pages build and deployment" turns green, the new site is live. On her phone, open the writing app once and pull down to refresh so it picks up the new lists.

---

## What she can write

Each kind of writing is its own list in the writing screen, so she picks the kind by tapping the list. There's no "type" field to get wrong.

| List in the writing screen | Folder | Shown on the site at |
|---|---|---|
| কবিতা (Poems) | `_poems/` | `/poems/` |
| ছোটগল্প (Short Stories) | `_stories/` | `/stories/` |
| ধারাবাহিক — পর্ব (Series: Parts) | `_parts/` | on its series' page, and in the lists |
| ধারাবাহিক — নাম (Series: Names) | `_series/` | `/series/` and one page per series |
| খাতার পরিচয় (About) | `_data/about.yml` | sidebar, `/about/`, footer |

Every poem, story and series has a **ভাষা (Language)** choice, বাংলা or English (default বাংলা). A part takes its language from its series. The **English** and **Bengali** pages in the menu collect everything in that language, and the Poems and Short Stories pages get All / Bengali / English filter buttons once both languages exist.

Bengali pieces can have an optional **English title**, shown in small italics beside the Bengali one.

**How series work:** she writes the series name once under *Series: Names*. Then each part picks that series from a dropdown and gets a part number. On the site, each series has a page listing its parts in order with a *Start reading* button. Each part page has Previous/Next part links and an "In This Series" list. Parts are linked to their series by the series name, so renaming a series means re-picking it in its old parts. The hint in the form says so.

---

## How things work

| Where | What |
|---|---|
| `_poems/`, `_stories/`, `_parts/`, `_series/` | One file per piece. File names are the save time, e.g. `20260925-143012.md`. |
| `_config.yml` | The four collections, the labels for each kind (`kinds`), the two languages, and the sidebar menu (`nav`). |
| `_data/about.yml` | Site name, tagline, her name, photo, about text (Bengali and English), optional email/Facebook/Instagram/YouTube links. Edited from the phone. |
| `admin/config.yml` | The writing screen: its lists, fields and Bengali labels. |
| `admin/index.html` | Loads Sveltia CMS from its CDN. |
| `_layouts/default.html` | The page frame: sidebar, top bar with search, right-hand column, footer. |
| `_layouts/piece.html`, `_layouts/series.html` | One poem / story / part, and one series. |
| `index.html`, `poems.html`, `stories.html`, `series.html`, `english.html`, `bangla.html`, `archives.html`, `about.html`, `404.html` | The other pages. |
| `_includes/writings.html` | Collects every piece, newest first. Pieces with the same date are ordered by save time, so backdated notebook pieces still land in order. |
| `_includes/doc-info.html` | Works out a piece's heading, language and part label. |
| `search.json` | The search index, built with the site. Search runs in the browser and matches Bengali or English. |
| `assets/site.css`, `assets/site.js` | All styling (colours are variables at the top: light, then dark) and the small bits of JavaScript: light/dark switch, phone menu, search, filter buttons, share buttons. |

Light or dark follows the visitor's phone/computer setting. The round button at the bottom of the sidebar flips it and remembers the choice on that device.

You can also add a piece by hand: create e.g. `_poems/anything.md` with front matter `title`, `lang` and `date`, and write the text in a `poem:` block (or as the Markdown body).

### Adding another kind of writing (e.g. essays)

1. `_config.yml`: add an `essays` entry under `collections` (copy `stories`, permalink `/essays/:name/`), a matching `defaults` entry with `layout: piece`, an entry under `kinds`, and a menu item under `nav`.
2. Copy `stories.html` to `essays.html`; change `title`, `section`, `permalink` and `kind`.
3. `admin/config.yml`: copy the whole `stories` block, change `name`, the labels and `folder: _essays`. Keep the text field named `story`.
4. Create `_essays/.gitkeep` so the folder exists.

### Preview locally (optional)

GitHub Pages builds with Jekyll 3.10, so preview with the same version:

```bash
gem install jekyll -v 3.10.0 kramdown-parser-gfm webrick
jekyll serve --baseurl /kamalika-poems   # then open http://localhost:4000/kamalika-poems/
```

On macOS's built-in Ruby 2.6, a few dependencies need older versions first:
`gem install ffi -v 1.15.5 && gem install public_suffix -v 4.0.7 && gem install i18n -v 1.14.1`.

---

## Setting it up from scratch (for reference)

1. Create a **public** repo and put this folder's contents in it.
2. Set `repo` and `display_url` in `admin/config.yml` (the two lines marked ✏️).
3. Repo → **Settings → Pages** → Source: **Deploy from a branch**, branch **main**, folder **/ (root)**.
4. Make a sign-in token: GitHub → **Settings → Developer settings → Personal access tokens → Fine-grained tokens**. Name it *Maa's phone*, choose the longest expiry (set a calendar reminder to renew), *Only select repositories* → this repo, and **Contents: Read and write**. The token can only touch this one repo. If her phone is lost, delete the token and the phone loses access immediately.
5. On her phone, in person: open `…/admin/` in Chrome → **Sign In with Token** → paste. Then Chrome menu (⋮) → **Add to Home screen**. It appears as a red **ক** icon called *কবিতা লিখুন*. On an iPhone, sign in *inside* the home-screen app, since it keeps separate storage from Safari.
6. Fill in খাতার পরিচয় (About) together and write one piece, so she sees the site update a minute later.
7. Check she has a Bengali keyboard she's comfortable with (Gboard → Languages → Bengali: the বাংলা layout, transliteration, or handwriting; the mic key does Bengali voice typing).

Then send her `GUIDE-bn.md` (a Bengali how-to), or go through it with her.

---

## When something goes wrong

**She saved something but it isn't on the site.** Check the Actions tab. A red build usually means a broken file: open the newest file in `_poems/`, `_stories/`, `_parts/` or `_series/` and look for anything odd at the top. Otherwise the build just hasn't finished yet, or her browser is showing a cached page (pull down to refresh).

**A part shows the wrong series name, or its series page doesn't list it.** The part's `series:` must match the series `title` exactly. Re-pick the series in the part and save.

**The writing screen asks her to sign in again.** The token expired or the browser data was cleared. Make a new token and sign in again.

**The writing screen won't load at all.** It pulls Sveltia CMS from `unpkg.com`. Check that the site loads on another network. Sveltia CMS is still in beta; if an update ever breaks something, pin a version in `admin/index.html`, e.g. `https://unpkg.com/@sveltia/cms@0.221.1/dist/sveltia-cms.js` (the version this was checked against).

**Want to undo a change she made?** Every save is a commit. Open the file's history on GitHub and restore the earlier version.
