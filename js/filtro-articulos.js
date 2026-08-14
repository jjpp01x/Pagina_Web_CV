// Filtro de artículos por tema.
// La rejilla se sirve completa en el HTML: sin JS se ven los 17 artículos,
// que es el comportamiento correcto. Este script solo añade la capa de filtrado.

(function () {
    'use strict';

    const barra = document.querySelector('.filtro-temas');
    const rejilla = document.querySelector('.articulos-grid');
    if (!barra || !rejilla) return;

    const botones = Array.from(barra.querySelectorAll('.filtro-chip'));
    const tarjetas = Array.from(rejilla.querySelectorAll('.articulo-card-link'));
    const aviso = document.querySelector('.filtro-vacio');

    function aplicar(tema, actualizarHash) {
        let visibles = 0;

        tarjetas.forEach(function (tarjeta) {
            const coincide = tema === 'todos' || tarjeta.dataset.tema === tema;
            tarjeta.hidden = !coincide;
            if (coincide) visibles++;
        });

        botones.forEach(function (boton) {
            const activo = boton.dataset.tema === tema;
            boton.classList.toggle('activo', activo);
            boton.setAttribute('aria-pressed', activo ? 'true' : 'false');
        });

        if (aviso) aviso.hidden = visibles > 0;

        // El lector de pantalla necesita que le digan que la lista cambió:
        // ocultar tarjetas no genera ningún anuncio por sí solo.
        rejilla.setAttribute('aria-label',
            visibles === tarjetas.length
                ? 'Todos los artículos, ' + visibles + ' en total'
                : visibles + (visibles === 1 ? ' artículo' : ' artículos') + ' sobre este tema');

        if (actualizarHash) {
            const nuevo = tema === 'todos' ? ' ' : '#tema=' + tema;
            history.replaceState(null, '', tema === 'todos'
                ? location.pathname + location.search
                : nuevo);
        }
    }

    barra.addEventListener('click', function (e) {
        const boton = e.target.closest('.filtro-chip');
        if (boton) aplicar(boton.dataset.tema, true);
    });

    // Permite compartir un tema concreto: articulos.html#tema=ingenieria-ia
    function temaDeLaUrl() {
        const t = (location.hash.match(/^#tema=([\w-]+)$/) || [])[1];
        return t && botones.some(function (b) { return b.dataset.tema === t; }) ? t : 'todos';
    }

    // Sin esto, llegar a un #tema= con la página ya abierta no filtra nada:
    // el hash cambia y la rejilla se queda como estaba.
    window.addEventListener('hashchange', function () {
        aplicar(temaDeLaUrl(), false);
    });

    aplicar(temaDeLaUrl(), false);
})();
