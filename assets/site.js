/* Light/dark switch, the phone menu, search, list filters and sharing.
   The site reads fine without any of this; it only adds conveniences. */
(function () {
  "use strict";

  var root = document.documentElement;
  var body = document.body;

  /* ---- Light / dark ---------------------------------------------------- */

  var systemDark = window.matchMedia("(prefers-color-scheme: dark)");

  function currentMode() {
    return root.getAttribute("data-mode") || (systemDark.matches ? "dark" : "light");
  }

  function saveMode(mode) {
    try {
      if (mode) localStorage.setItem("mode", mode);
      else localStorage.removeItem("mode");
    } catch (e) {}
  }

  document.querySelectorAll("[data-mode-toggle]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var next = currentMode() === "dark" ? "light" : "dark";
      var system = systemDark.matches ? "dark" : "light";
      // Back to matching the device? Then stop overriding it.
      if (next === system) {
        root.removeAttribute("data-mode");
        saveMode(null);
      } else {
        root.setAttribute("data-mode", next);
        saveMode(next);
      }
    });
  });

  /* ---- Phone menu ------------------------------------------------------ */

  var menuBtn = document.querySelector("[data-menu]");

  function setMenu(open) {
    body.classList.toggle("sidebar-open", open);
    if (menuBtn) menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
  }

  if (menuBtn) {
    menuBtn.addEventListener("click", function () {
      setMenu(!body.classList.contains("sidebar-open"));
    });
  }

  document.querySelectorAll("[data-menu-close]").forEach(function (el) {
    el.addEventListener("click", function () {
      setMenu(false);
    });
  });

  /* ---- Search ---------------------------------------------------------- */

  var input = document.getElementById("search-input");
  var form = document.querySelector("[data-search-form]");
  var results = document.querySelector("[data-search-results]");
  var pageContent = document.querySelector("[data-page-content]");
  var index = null;
  var loading = null;

  function norm(s) {
    s = String(s || "");
    if (s.normalize) s = s.normalize("NFC");
    return s.toLowerCase();
  }

  function loadIndex() {
    if (!loading) {
      loading = fetch(window.SEARCH_INDEX)
        .then(function (r) {
          return r.json();
        })
        .then(function (items) {
          index = items.map(function (item) {
            item.hay = norm([item.title, item.title_en, item.part, item.kind, item.lang_name, item.text].join(" "));
            return item;
          });
        })
        .catch(function () {
          index = [];
          loading = null; // try again next time
        });
    }
    return loading;
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function snippet(item, term) {
    var text = item.text || "";
    var at = norm(text).indexOf(term);
    if (at < 60 || norm(text).length !== text.length) return text.slice(0, 220);
    return "…" + text.slice(at - 50, at + 170);
  }

  function showResults(query) {
    var terms = norm(query).split(/\s+/).filter(Boolean);
    var hits = index.filter(function (item) {
      return terms.every(function (t) {
        return item.hay.indexOf(t) !== -1;
      });
    });

    results.textContent = "";
    var summary = el("p", "search-summary");
    summary.textContent =
      hits.length === 0
        ? "Nothing found for “" + query + "”."
        : hits.length + (hits.length === 1 ? " result" : " results") + " for “" + query + "”";
    results.appendChild(summary);

    var list = el("div", "card-list");
    hits.slice(0, 50).forEach(function (item) {
      var card = el("article", "card");
      var link = el("a", "card-link");
      link.href = item.url;

      var h = el("h2", "card-title");
      var title = el("span", "", item.title);
      title.lang = item.lang;
      h.appendChild(title);
      if (item.title_en) {
        h.appendChild(document.createTextNode(" "));
        h.appendChild(el("span", "title-en", item.title_en));
      }
      link.appendChild(h);

      if (item.part) {
        var part = el("p", "card-part", item.part);
        part.lang = item.lang;
        link.appendChild(part);
      }

      var excerpt = el("p", "card-excerpt", snippet(item, terms[0]));
      excerpt.lang = item.lang;
      link.appendChild(excerpt);

      var meta = el("div", "meta");
      meta.appendChild(el("span", "", item.date));
      meta.appendChild(el("span", "", item.kind));
      var lang = el("span", "lang-tag", item.lang_name);
      lang.lang = item.lang;
      meta.appendChild(lang);
      link.appendChild(meta);

      card.appendChild(link);
      list.appendChild(card);
    });
    results.appendChild(list);

    results.hidden = false;
    pageContent.hidden = true;
  }

  function clearResults() {
    results.hidden = true;
    results.textContent = "";
    pageContent.hidden = false;
  }

  function runSearch() {
    var query = input.value.trim();
    if (!query) {
      clearResults();
      return;
    }
    loadIndex().then(function () {
      // The box may have changed while the index was loading.
      if (input.value.trim() === query && index) showResults(query);
    });
  }

  function closeSearch() {
    input.value = "";
    clearResults();
    body.classList.remove("searching");
  }

  if (input && results && pageContent) {
    input.addEventListener("focus", loadIndex);
    input.addEventListener("input", runSearch);
    input.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        closeSearch();
        input.blur();
      }
    });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      runSearch();
      input.blur(); // hides the phone keyboard so the results can be seen
    });

    var openBtn = document.querySelector("[data-search-open]");
    if (openBtn) {
      openBtn.addEventListener("click", function () {
        body.classList.add("searching");
        input.focus();
      });
    }
    var cancelBtn = document.querySelector("[data-search-cancel]");
    if (cancelBtn) cancelBtn.addEventListener("click", closeSearch);

    // A search link like /archives/?q=moon fills in the box.
    var q = new URLSearchParams(location.search).get("q");
    if (q) {
      input.value = q;
      body.classList.add("searching");
      runSearch();
    }
  }

  /* ---- Filter chips ---------------------------------------------------- */

  document.querySelectorAll(".chips[data-filter]").forEach(function (bar) {
    var key = bar.getAttribute("data-filter");
    var list = bar.nextElementSibling;
    bar.hidden = false;
    bar.addEventListener("click", function (e) {
      var chip = e.target.closest("button[data-value]");
      if (!chip) return;
      var value = chip.getAttribute("data-value");
      bar.querySelectorAll("button").forEach(function (b) {
        b.setAttribute("aria-pressed", b === chip ? "true" : "false");
      });
      list.querySelectorAll(".card").forEach(function (card) {
        card.hidden = value !== "" && card.getAttribute("data-" + key) !== value;
      });
    });
  });

  /* ---- Sharing --------------------------------------------------------- */

  var shareBtn = document.querySelector("[data-share]");
  if (shareBtn && navigator.share) {
    shareBtn.hidden = false;
    shareBtn.addEventListener("click", function () {
      navigator.share({ title: document.title, url: location.href }).catch(function () {});
    });
  }

  var copyBtn = document.querySelector("[data-copy-link]");
  var copied = document.querySelector("[data-copied]");
  if (copyBtn && navigator.clipboard) {
    copyBtn.addEventListener("click", function () {
      navigator.clipboard.writeText(location.href).then(function () {
        if (!copied) return;
        copied.hidden = false;
        setTimeout(function () {
          copied.hidden = true;
        }, 2000);
      });
    });
  } else if (copyBtn) {
    copyBtn.hidden = true;
  }

  // WhatsApp gets the title as well as the link.
  var wa = document.querySelector("[data-share-whatsapp]");
  if (wa) {
    var title = document.querySelector(".piece-title");
    var text = (title ? title.textContent.trim() + "\n" : "") + location.href;
    wa.href = "https://wa.me/?text=" + encodeURIComponent(text);
  }

  /* ---- Back to top ----------------------------------------------------- */

  var topBtn = document.querySelector("[data-back-to-top]");
  if (topBtn) {
    var onScroll = function () {
      topBtn.hidden = window.scrollY < 700;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    topBtn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---- Keyboard: Escape closes the phone menu -------------------------- */

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && body.classList.contains("sidebar-open")) setMenu(false);
  });
})();
