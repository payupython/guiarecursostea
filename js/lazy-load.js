/* ============================================
   LAZY LOADING - Optimización de Carga de Imágenes
   ============================================ */

// Inicializar lazy loading para imágenes
function initializeLazyLoading() {
  const images = document.querySelectorAll('img[loading="lazy"]');

  if ('IntersectionObserver' in window) {
    // Usar IntersectionObserver si está disponible (mejor rendimiento)
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.addEventListener('load', () => {
            img.classList.add('loaded');
          });
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px 0px'
    });

    images.forEach(img => imageObserver.observe(img));
  } else {
    // Fallback para navegadores sin IntersectionObserver
    images.forEach(img => {
      img.addEventListener('load', () => {
        img.classList.add('loaded');
      });
    });
  }

  console.log(`📦 Lazy loading inicializado para ${images.length} imágenes`);
}

// Ejecutar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeLazyLoading);
} else {
  initializeLazyLoading();
}

// Re-inicializar cuando se carguen nuevas tarjetas dinámicamente
if (typeof window !== 'undefined') {
  window.reinitializeLazyLoading = initializeLazyLoading;
}

console.log('✅ Lazy Load cargado');
