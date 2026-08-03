/* ============================================
   Confetteria Avvignano — script condiviso
   ============================================ */

document.addEventListener("DOMContentLoaded", function () {

  /* ---------- Scroll-reveal: dissolvenza dal basso ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    // Fallback: nessun IntersectionObserver disponibile, mostra tutto subito
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Hero click-reveal: facciata -> interno ---------- */
  var heroReveal = document.querySelector(".hero-reveal");
  if (heroReveal) {
    heroReveal.addEventListener("click", function () {
      heroReveal.classList.toggle("is-open");
    });
    heroReveal.setAttribute("role", "button");
    heroReveal.setAttribute("tabindex", "0");
    heroReveal.setAttribute("aria-label", "Tocca per scoprire l'interno della bottega");
    heroReveal.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        heroReveal.classList.toggle("is-open");
      }
    });
  }

  /* ---------- Contenuti dinamici da Google Sheet (orari) ---------- */
  // NOTA PER IL TITOLARE: quando il Google Sheet è pronto, incolla qui sotto
  // l'URL "pubblicato sul web" in formato CSV (File -> Condividi -> Pubblica sul web -> CSV).
  // Finché questo URL è vuoto, il sito mostra gli orari scritti direttamente nel codice
  // (quelli reali forniti), che restano comunque un fallback sicuro in caso il foglio non risponda.
  var GOOGLE_SHEET_ORARI_CSV_URL = ""; // <-- INCOLLA QUI L'URL CSV DEL FOGLIO ORARI

  if (GOOGLE_SHEET_ORARI_CSV_URL) {
    fetch(GOOGLE_SHEET_ORARI_CSV_URL)
      .then(function (res) { return res.text(); })
      .then(function (csvText) {
        var righe = csvText.trim().split("\n").map(function (r) { return r.split(","); });
        var container = document.getElementById("orari-dinamici");
        if (!container) return;
        var html = "";
        righe.forEach(function (cols) {
          if (cols.length < 2) return;
          var giorno = cols[0].trim();
          var orario = cols[1].trim();
          var chiuso = orario.toLowerCase().indexOf("chius") !== -1;
          html += '<div class="hours-table__row' + (chiuso ? " closed" : "") + '">' +
                  "<span>" + giorno + "</span><span>" + orario + "</span></div>";
        });
        if (html) container.innerHTML = html;
      })
      .catch(function () {
        // In caso di errore di rete, restano gli orari scritti nel codice come fallback
        console.warn("Impossibile caricare gli orari dal Google Sheet, uso i valori di fallback nel codice.");
      });
  }

});
