// Client-side search and filter buttons for the entry list. No libraries, works offline once loaded.
// Buttons work like the 23 October demo: within a group, any chosen value matches (e.g. Water or Food);
// across groups, all must match (e.g. Water and Strong).
//
// 22 November 2026 (Daniela): the search and the chosen buttons are kept in the page address
// (?q=…&category=Water), so opening an entry and pressing Back returns to the same results,
// and a search can be bookmarked or sent to someone.
// Search matches word forms (filtration finds filter, fertiliser finds fertilizer) and skips
// little words (for, the, during). It still reads only the title, summary, keywords and
// category, never the whole entry: entries also mention things in their "when it does not
// work" sections, and a search for "drought" must not offer a solution that drought breaks.
(function () {
  var q = document.getElementById("q");
  var cards = Array.prototype.slice.call(document.querySelectorAll("#cards .card"));
  var chips = Array.prototype.slice.call(document.querySelectorAll(".fchip"));
  var count = document.getElementById("count");
  var clear = document.getElementById("clearAll");
  if (!q || !cards.length) return;

  var SKIP = " a an and the of for to in on at by with from during how what when where which my our your i we is are it its or that this without no not de del la las el los un una unos unas y o para por con sin en que es son su sus al ";

  // Plain-letter, American-spelled, suffix-trimmed form of a word.
  function stem(w) {
    w = w.normalize ? w.normalize("NFD").replace(/[̀-ͯ]/g, "") : w;
    w = w.replace(/oea/g, "ea")                              // diarrhoea → diarrhea
         .replace(/is(e|ed|es|er|ers|ing|ation|ations)$/, "iz$1") // fertiliser → fertilizer
         .replace(/([a-z]{3,})our$/, "$1or");               // labour → labor
    var cut = w.replace(/(ations|ation|ings|ing|ers|ies|es|ed|s)$/, "");
    if (cut.length >= 3) w = cut;
    if (w.length > 5) w = w.replace(/er$/, "");             // filter → filt, cooler → cool
    return w;
  }
  function wordsOf(text) {
    return text.toLowerCase().split(/[^a-z0-9À-ɏ]+/).filter(function (w) {
      return w && SKIP.indexOf(" " + w + " ") === -1;
    });
  }
  cards.forEach(function (c) { c._stems = wordsOf(c.dataset.text || "").map(stem); });

  // A search word matches a card word if it appears inside it (water finds wastewater),
  // or the card word is the same word with a slightly different ending (filtration finds filter).
  function matches(c, s) {
    return c._stems.some(function (t) {
      return t.indexOf(s) !== -1 || (t.length >= 4 && s.indexOf(t) === 0 && s.length - t.length <= 2);
    });
  }

  function chosen() {
    var on = {};
    chips.forEach(function (b) {
      if (b.getAttribute("aria-pressed") === "true") (on[b.dataset.filter] = on[b.dataset.filter] || []).push(b.dataset.value);
    });
    return on;
  }
  function remember(on) {
    if (!window.history || !history.replaceState || !window.URLSearchParams) return;
    var p = new URLSearchParams();
    if (q.value.trim()) p.set("q", q.value.trim());
    Object.keys(on).forEach(function (k) { on[k].forEach(function (v) { p.append(k, v); }); });
    var s = p.toString();
    try { history.replaceState(history.state, "", location.pathname + (s ? "?" + s : "") + location.hash); } catch (e) {}
  }
  function restore() {
    if (!window.URLSearchParams || !location.search) return;
    var p = new URLSearchParams(location.search);
    if (p.has("q")) q.value = p.get("q");
    chips.forEach(function (b) {
      if (p.getAll(b.dataset.filter).indexOf(b.dataset.value) !== -1) b.setAttribute("aria-pressed", "true");
    });
  }
  function apply() {
    var stems = wordsOf(q.value).map(stem);
    var on = chosen(), any = Object.keys(on).length > 0, best = 0, shown = 0;
    cards.forEach(function (c) {
      var ok = true;
      Object.keys(on).forEach(function (k) {
        if (!ok) return;
        var have = (c.dataset[k] || "").split("|");
        ok = on[k].some(function (v) { return have.indexOf(v) !== -1; });
      });
      c._score = ok ? stems.filter(function (s) { return matches(c, s); }).length : -1;
      if (c._score > best) best = c._score;
    });
    // Normally every search word must match. If no entry matches them all, show the
    // entries that match the most of them, and say so: "water for a dry season" then
    // still finds something instead of a blank page.
    var need = stems.length, partial = false;
    if (need > 1 && best < need && best > 0) { need = best; partial = true; }
    cards.forEach(function (c) {
      var ok = c._score >= need;
      c.hidden = !ok;
      if (ok) shown++;
    });
    count.textContent = (partial ? (count.dataset.partial || "No entry matches every word. Closest matches: ") : "") +
      shown + " " + (count.dataset.of || "of") + " " + cards.length + " " + (count.dataset.noun || "entries");
    if (clear) clear.hidden = !(any || q.value);
    remember(on);
  }
  chips.forEach(function (b) {
    b.addEventListener("click", function () {
      b.setAttribute("aria-pressed", b.getAttribute("aria-pressed") === "true" ? "false" : "true");
      apply();
    });
  });
  if (clear) clear.addEventListener("click", function () {
    q.value = "";
    chips.forEach(function (b) { b.setAttribute("aria-pressed", "false"); });
    apply();
  });
  q.addEventListener("input", apply);
  // Coming back with Back: some browsers restore the page as it was, others reload it;
  // either way the address carries the search, so read it again.
  window.addEventListener("pageshow", function (e) { if (e.persisted) { restore(); apply(); } });
  restore();
  apply();
})();
