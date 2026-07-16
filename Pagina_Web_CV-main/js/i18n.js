// Lee el idioma guardado, por defecto español
let idiomaActual = localStorage.getItem('idioma') || 'es';

// Aplica las traducciones a todos los elementos con data-i18n
function aplicarIdioma(idioma) {
    idiomaActual = idioma;
    localStorage.setItem('idioma', idioma); // Lo recuerda al cambiar de página

    // Traduce texto normal
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const clave = el.getAttribute('data-i18n');
        if (translations[idioma][clave] !== undefined) {
            el.innerHTML = translations[idioma][clave];
        }
    });

    // Traduce placeholders de inputs y textareas
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
        const clave = el.getAttribute('data-i18n-ph');
        if (translations[idioma][clave] !== undefined) {
            el.placeholder = translations[idioma][clave];
        }
    });

    // Resalta el botón de idioma activo
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('activo', btn.getAttribute('data-lang') === idioma);
    });
}

// Al cargar la página aplica el idioma guardado
document.addEventListener('DOMContentLoaded', () => {
    aplicarIdioma(idiomaActual);
});