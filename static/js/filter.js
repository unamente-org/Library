// Client-side search and filter buttons for the entry list. No libraries, works offline once loaded.
// Buttons work like the 23 October demo: within a group, any chosen value matches (e.g. Water or Food);
// across groups, all must match (e.g. Water and Strong).
(function () {
  var q = document.getElementById("q");
  var cards = Array.prototype.slice.call(document.querySelectorAll("#cards .card"));
  var chips = Array.prototype.slice.call(document.querySelectorAll(".fchip"));
  var count = document.getElementById("count");
  var clear = document.getElementById("clearAll");
  if (!q || !cards.length) return;

  function chosen() {
    var on = {};
    chips.forEach(function (b) {
      if (b.getAttribute("aria-pressed") === "true") (on[b.dataset.filter] = on[b.dataset.filter] || []).push(b.dataset.value);
    });
    return on;
  }
  function apply() {
    var words = q.value.toLowerCase().split(/\s+/).filter(Boolean);
    var on = chosen(), shown = 0, any = false;
    Object.keys(on).forEach(function () { any = true; });
    cards.forEach(function (c) {
      var ok = words.every(function (w) { return c.dataset.text.indexOf(w) !== -1; });
      Object.keys(on).forEach(function (k) {
        if (!ok) return;
        var have = (c.dataset[k] || "").split("|");
        ok = on[k].some(function (v) { return have.indexOf(v) !== -1; });
      });
      c.hidden = !ok;
      if (ok) shown++;
    });
    count.textContent = shown + " of " + cards.length + " entries";
    if (clear) clear.hidden = !(any || q.value);
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
  apply();
})();
