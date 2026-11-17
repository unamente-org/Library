// Client-side search and filters for the entry list. No libraries, works offline once loaded.
(function () {
  var q = document.getElementById("q");
  var cards = Array.prototype.slice.call(document.querySelectorAll("#cards .card"));
  var selects = Array.prototype.slice.call(document.querySelectorAll("select[data-filter]"));
  var count = document.getElementById("count");
  if (!q || !cards.length) return;

  function apply() {
    var words = q.value.toLowerCase().split(/\s+/).filter(Boolean);
    var shown = 0;
    cards.forEach(function (c) {
      var ok = words.every(function (w) { return c.dataset.text.indexOf(w) !== -1; });
      selects.forEach(function (s) {
        if (ok && s.value) ok = (c.dataset[s.dataset.filter] || "").split("|").indexOf(s.value) !== -1;
      });
      c.hidden = !ok;
      if (ok) shown++;
    });
    count.textContent = shown + " of " + cards.length + " entries";
  }
  q.addEventListener("input", apply);
  selects.forEach(function (s) { s.addEventListener("change", apply); });
  apply();
})();
