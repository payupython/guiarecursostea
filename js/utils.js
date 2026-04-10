/* ============================================
   UTILIDADES - Funciones auxiliares
   ============================================ */

// ALMACENAMIENTO LOCAL
function saveToLocalStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn('No se pudo guardar en localStorage:', e);
  }
}

function loadFromLocalStorage(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.warn('No se pudo cargar desde localStorage:', e);
    return null;
  }
}

// DEBOUNCE - Para búsqueda en tiempo real
function debounce(fn, delay = 300) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

// RENDERIZAR TARJETA
function renderCard(resource, categories = []) {
  const category = categories.find(cat => cat.id === resource.category) || {};
  const categoryIcon = getCategoryIcon(resource.category);

  const servicesHTML = resource.keyServices
    .map(service => `<div class="service-badge">${service}</div>`)
    .join('');

  const tagsHTML = resource.tags
    .map(tagId => `<div class="tag-label">#${tagId}</div>`)
    .join('');

  const contactsHTML = [
    resource.phone ? `<div class="contact-item">📞 <a href="tel:${resource.phone}" title="Llamar">${resource.phone}</a></div>` : '',
    resource.url ? `<div class="contact-item">🔗 <a href="${resource.url}" target="_blank" rel="noopener" title="Visitar sitio web">${resource.url.replace(/https?:\/\/(www\.)?/, '')}</a></div>` : '',
    resource.contact ? `<div class="contact-item">✉️ <a href="mailto:${resource.contact}" title="Enviar email">${resource.contact}</a></div>` : ''
  ].filter(html => html).join('');

  const html = `
    <article class="resource-card"
      data-resource-id="${resource.id}"
      data-resource-name="${escapeHtml(resource.name)}"
      data-category="${resource.category}"
      data-category-name="${category.name || 'Sin categoría'}"
      data-type="resource"
      ${resource.tags ? `data-tags="${resource.tags.join(',')}"` : ''}
      itemscope
      itemtype="https://schema.org/LocalBusiness"
      role="article">

      <header class="card-header" data-section="header">
        <div class="card-icon" aria-hidden="true">${categoryIcon}</div>
        <h3 class="card-title" itemprop="name" data-field="name">${escapeHtml(resource.name)}</h3>
      </header>

      <span class="card-category" data-field="category" data-category-id="${resource.category}">${category.name || 'Sin categoría'}</span>

      ${resource.location ? `
        <section class="card-section" data-section="location">
          <h4 class="card-section-title">📍 Ubicación</h4>
          <div class="card-section-content" itemprop="address" data-field="location">${escapeHtml(resource.location)}</div>
        </section>
      ` : ''}

      <div class="card-divider" aria-hidden="true"></div>

      ${resource.uniqueValueProp ? `
        <section class="card-section" data-section="value-prop">
          <h4 class="card-section-title">✨ Lo especial</h4>
          <div class="card-section-content" data-field="unique-value">${escapeHtml(resource.uniqueValueProp)}</div>
        </section>
      ` : ''}

      ${resource.description ? `
        <section class="card-section" data-section="description">
          <h4 class="card-section-title">📝 Descripción</h4>
          <div class="card-section-content" itemprop="description" data-field="description">${escapeHtml(resource.description)}</div>
        </section>
      ` : ''}

      ${servicesHTML ? `
        <section class="card-section" data-section="services">
          <h4 class="card-section-title">🎯 Servicios</h4>
          <div class="card-services" role="list" data-field="services">${servicesHTML}</div>
        </section>
      ` : ''}

      ${resource.ageRange ? `
        <section class="card-section" data-section="age-range">
          <div class="card-section-content"><strong>Edad:</strong> <span data-field="age-range" itemprop="targetGroup">${escapeHtml(resource.ageRange)}</span></div>
        </section>
      ` : ''}

      ${contactsHTML ? `
        <div class="card-divider" aria-hidden="true"></div>
        <section class="card-contact" data-section="contact" role="region" aria-label="Información de contacto">${contactsHTML}</section>
      ` : ''}

      ${tagsHTML ? `
        <footer class="card-tags" data-section="tags" role="list">${tagsHTML}</footer>
      ` : ''}
    </article>
  `;

  return html;
}

// RENDERIZAR GRID DE TARJETAS
function renderGrid(resources, categories = []) {
  if (resources.length === 0) {
    return '';
  }

  return resources
    .map(resource => renderCard(resource, categories))
    .join('');
}

// ICONOS POR CATEGORÍA
function getCategoryIcon(categoryId) {
  const icons = {
    'salud': '🏥',
    'educacion': '🎓',
    'entidades': '👥',
    'vida-adulta': '💼',
    'tramites': '📋'
  };
  return icons[categoryId] || '📌';
}

// ESCAPAR HTML
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// RESALTAR COINCIDENCIAS EN BÚSQUEDA
function highlightMatches(text, query) {
  if (!query || !text) return text;
  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<strong>$1</strong>');
}

// ACTUALIZAR CONTADOR DE RESULTADOS
function updateResultsCount(count) {
  const countEl = document.getElementById('resultCount');
  if (countEl) {
    countEl.textContent = count;
  }

  const titleEl = document.getElementById('resultsTitle');
  if (titleEl) {
    if (count === 0) {
      titleEl.textContent = 'No hay resultados';
    } else if (count === 1) {
      titleEl.textContent = '1 Recurso encontrado';
    } else {
      titleEl.textContent = `${count} Recursos para Padres tras Diagnóstico de TEA`;
    }
  }

  // Actualizar SEO dinámico
  updateDynamicSEO(count);
}

// ACTUALIZAR SEO DINÁMICO
function updateDynamicSEO(count) {
  // Actualizar og:title y og:description dinámicamente
  let metaTitle = `Guía de Recursos TEA - Directorio de ${count} Servicios`;
  let metaDescription = `Descubre ${count} recursos verificados para TEA: diagnóstico, educación, empleo, vivienda y ayudas sociales. Buscador accesible y filtros inteligentes.`;

  // Actualizar title
  document.title = metaTitle;
}

// MOSTRAR/OCULTAR ESTADO VACÍO
function toggleEmptyState(show) {
  const emptyState = document.getElementById('emptyState');
  if (emptyState) {
    emptyState.style.display = show ? 'block' : 'none';
  }

  const grid = document.getElementById('resourcesGrid');
  if (grid) {
    grid.style.display = show ? 'none' : 'grid';
  }
}

// GENERAR ENLACE MAILTO PARA PROPUESTAS
function generateProposeLink(email = 'recursos.tea@example.com') {
  const subject = encodeURIComponent('Propuesta de nuevo recurso TEA');
  const body = encodeURIComponent(`Nombre del Recurso:

Categoría (Salud/Educación/Entidades/Vida Adulta/Trámites):

Descripción:

Ubicación:

Teléfono/Web:

Servicios principales:

Observaciones:
`);

  return `mailto:${email}?subject=${subject}&body=${body}`;
}

// ENVIAR EVENTO AL DATALAYER
function pushEvent(eventName, params = {}) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: eventName, ...params });
}

// CAPITALIZAR TEXTO
function capitalize(text) {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// OBTENER PARÁMETRO URL
function getUrlParam(param) {
  const params = new URLSearchParams(window.location.search);
  return params.get(param);
}

// COPIAR AL PORTAPAPELES
function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text);
  } else {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    } finally {
      document.body.removeChild(textArea);
    }
  }
}

// CREAR NOTIFICACIÓN
function showNotification(message, type = 'info', duration = 3000) {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 16px 24px;
    background-color: ${type === 'success' ? '#6CAA96' : type === 'error' ? '#D2691E' : '#8B4513'};
    color: #fff5e6;
    border-radius: 6px;
    z-index: 2000;
    box-shadow: 0 4px 8px rgba(61, 40, 23, 0.3);
    animation: slideIn 0.3s ease;
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, duration);
}

// AGREGAR ESTILOS DE ANIMACIÓN DINÁMICAMENTE
function addAnimationStyles() {
  if (document.getElementById('animation-styles')) return;

  const style = document.createElement('style');
  style.id = 'animation-styles';
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(400px);
        opacity: 0;
      }
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    @keyframes levelUp {
      0% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.1);
      }
      100% {
        transform: scale(1);
      }
    }
  `;
  document.head.appendChild(style);
}

// INICIALIZAR ANIMACIONES
addAnimationStyles();

console.log('✅ Utils cargado');
