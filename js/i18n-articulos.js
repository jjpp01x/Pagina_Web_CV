// Los botones ES/EN/DE de un articulo o del indice NAVEGAN a su equivalente.
// En el CV el conmutador reescribe la misma pagina con JavaScript, y ahi esta bien.
// Aqui no puede: cada idioma tiene su propia URL para que Google indexe las tres, asi
// que cambiar de idioma es un cambio de pagina, no un cambio de texto.
//
// Las URL equivalentes no se codifican aqui: se leen de las etiquetas <link hreflang>
// que ya lleva la pagina, que son la misma fuente que consume el buscador. Si el
// generador cambia una ruta, esto la sigue sin tocar una linea.
(function () {
  function alternativas() {
    var mapa = {};
    document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(function (l) {
      var h = l.getAttribute('hreflang');
      if (h !== 'x-default') mapa[h] = l.getAttribute('href');
    });
    return mapa;
  }

  // El idioma de ESTA pagina no se puede leer de <html lang>: i18n.js lo sobrescribe con
  // el idioma guardado en localStorage nada mas cargar. Se deduce comparando la ruta
  // actual con las alternativas declaradas, que no cambian.
  function hoja(u) {
    return u.split('?')[0].split('#')[0].split('/').filter(Boolean).pop() || '';
  }

  function idiomaDeLaPagina(alt) {
    // se compara por nombre de fichero, no por ruta completa: el slug es distinto en cada
    // idioma, y asi funciona igual servido desde el dominio que abierto en local
    var aqui = hoja(window.location.pathname);
    for (var l in alt) {
      if (hoja(alt[l]) === aqui) return l;
    }
    return 'es';
  }

  document.addEventListener('DOMContentLoaded', function () {
    var alt = alternativas();
    var actual = idiomaDeLaPagina(alt);
    // i18n.js ya habra puesto lang al idioma guardado; se devuelve al real de la pagina
    if (Object.keys(alt).length) document.documentElement.lang = actual;

    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      var destino = alt[btn.dataset.lang];
      btn.classList.toggle('activo', btn.dataset.lang === actual);
      if (!destino) return;
      btn.onclick = function (e) {
        e.preventDefault();
        // se recuerda la eleccion para que el CV abra en el mismo idioma
        try { localStorage.setItem('idioma', btn.dataset.lang); } catch (err) {}
        window.location.href = destino;
      };
    });

    // Si no hay alternativas declaradas (paginas del CV), al menos el enlace a los
    // articulos lleva al indice del idioma guardado.
    if (Object.keys(alt).length === 0) {
      var guardado;
      try { guardado = localStorage.getItem('idioma'); } catch (err) {}
      var indices = { en: 'en/articles.html', de: 'de/artikel.html' };
      if (guardado && indices[guardado]) {
        document.querySelectorAll('a[href$="articulos.html"]').forEach(function (a) {
          var prefijo = a.getAttribute('href').replace(/articulos\.html$/, '');
          a.setAttribute('href', prefijo + indices[guardado]);
        });
      }
    }
  });
})();
