/* ============================================
   APP - Orquestación Principal
   ============================================ */

// VARIABLES GLOBALES
let appData = {
  resources: [],
  categories: [],
  tags: []
};

// Compartir globalmente para que otros scripts las accedan
window.appData = appData;
window.allResources = [];
window.allCategories = [];
window.allTags = [];

// CARGAR DATOS JSON
async function loadData() {
  try {
    // Construir ruta absoluta desde el directorio raíz
    const basePath = window.location.pathname.includes('/pages/')
      ? '../data/resources.json'
      : './data/resources.json';

    const response = await fetch(basePath);
    if (!response.ok) {
      throw new Error(`Error loading data: ${response.status}`);
    }
    appData = await response.json();
    console.log('✅ Datos cargados:', {
      recursos: appData.resources.length,
      categorías: appData.categories.length,
      etiquetas: appData.tags.length
    });
    return true;
  } catch (error) {
    console.error('❌ Error cargando datos:', error);
    showErrorState(error);
    return false;
  }
}

// MOSTRAR ERROR DE CARGA
function showErrorState(error) {
  const main = document.querySelector('.main-content');
  if (main) {
    main.innerHTML = `
      <div style="text-align: center; padding: 40px;">
        <div style="font-size: 48px; margin-bottom: 16px;">⚠️</div>
        <h2 style="color: #8B4513; margin-bottom: 8px;">Error cargando recursos</h2>
        <p style="color: #5C4033; margin-bottom: 16px;">No se pudieron cargar los datos. Por favor intenta recargar la página.</p>
        <button class="btn btn-primary" onclick="location.reload()">🔄 Recargar Página</button>
      </div>
    `;
  }
}

// INICIALIZAR APLICACIÓN
async function initializeApp() {
  console.log('🚀 Iniciando aplicación...');

  // Cargar datos
  const dataLoaded = await loadData();
  if (!dataLoaded) {
    console.error('❌ No se pudieron cargar los datos');
    return;
  }

  console.log('📊 Datos cargados exitosamente:', {
    recursos: appData.resources.length,
    categorías: appData.categories.length,
    tags: appData.tags.length
  });

  // Compartir datos globalmente para todos los módulos
  window.appData = appData;
  window.allResources = appData.resources;
  window.allCategories = appData.categories;
  window.allTags = appData.tags;

  console.log('✅ Variables globales asignadas');

  // Renderizar grid PRIMERO antes de inicializar filtros
  const grid = document.getElementById('resourcesGrid');
  console.log('🎯 Grid element encontrado:', !!grid);

  if (grid && appData.resources && appData.resources.length > 0) {
    try {
      const html = renderGrid(appData.resources, appData.categories);
      console.log('🎨 HTML generado:', html.length, 'caracteres');
      grid.innerHTML = html;
      updateResultsCount(appData.resources.length);
      console.log('✅ Grid renderizado con', appData.resources.length, 'recursos');
    } catch (error) {
      console.error('❌ Error renderizando grid:', error);
    }
  } else {
    console.error('❌ No hay grid o recursos disponibles');
    console.error('Grid:', grid, 'Recursos:', appData.resources?.length);
  }

  // Gamificación desactivada

  // Inicializar búsqueda
  try {
    initializeSearch(appData.resources, appData.categories);
    console.log('✅ Búsqueda inicializada');
  } catch (error) {
    console.error('⚠️ Error en búsqueda:', error);
  }

  // Inicializar filtros
  try {
    initializeFilters(appData.resources, appData.categories, appData.tags);
    console.log('✅ Filtros inicializados');
  } catch (error) {
    console.error('⚠️ Error en filtros:', error);
  }

  // Configurar enlace de propuestas
  setupProposeLink();

  // Configurar modal
  setupModal();

  // Event listeners adicionales
  setupAdditionalListeners();

  console.log('✅ Aplicación inicializada');
}

// CONFIGURAR ENLACE DE PROPUESTAS
function setupProposeLink() {
  const proposeLink = document.getElementById('proposeLink');
  if (proposeLink) {
    // Email predeterminado - cambiar según necesidad
    const email = 'recursos.tea@example.com';
    proposeLink.href = generateProposeLink(email);
    proposeLink.setAttribute('aria-label', 'Proponer un nuevo recurso');
  }
}

// CONFIGURAR MODAL
function setupModal() {
  const modal = document.getElementById('detailsModal');
  const modalClose = document.querySelector('.modal-close');

  if (modalClose) {
    modalClose.addEventListener('click', () => {
      if (modal) {
        modal.style.display = 'none';
      }
    });
  }

  // Cerrar modal al hacer click fuera
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    });

    // Cerrar con tecla ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.style.display === 'block') {
        modal.style.display = 'none';
      }
    });
  }
}

// EVENT LISTENERS ADICIONALES
function setupAdditionalListeners() {
  // Mostrar modal al hacer click en tarjeta
  document.addEventListener('click', (e) => {
    const card = e.target.closest('.resource-card');
    if (card && !e.target.closest('a')) {
      const resourceId = card.dataset.resourceId;
      const resource = appData.resources.find(r => r.id === resourceId);

      if (resource) {
        showResourceDetails(resource);
      }
    }
  });

  // Mejorar navegación por teclado
  document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K para buscar
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      const searchInput = document.getElementById('searchInput');
      if (searchInput) {
        searchInput.focus();
      }
    }
  });
}

// MOSTRAR DETALLES DEL RECURSO EN MODAL
function showResourceDetails(resource) {
  const modal = document.getElementById('detailsModal');
  const modalBody = document.getElementById('modalBody');

  if (!modal || !modalBody) return;

  const category = appData.categories.find(c => c.id === resource.category) || {};

  let html = `
    <h2 style="color: #8B4513; margin-bottom: 16px;">${escapeHtml(resource.name)}</h2>

    <div style="margin-bottom: 24px;">
      <span style="
        background-color: #fff5e6;
        padding: 8px 12px;
        border-radius: 4px;
        font-size: 14px;
        color: #5C4033;
        border: 1px solid #D4C4B0;
        display: inline-block;
      ">${category.name || 'Sin categoría'}</span>
    </div>

    ${resource.location ? `
      <div style="margin-bottom: 16px;">
        <strong style="color: #8B4513;">📍 Ubicación:</strong>
        <p style="color: #5C4033; margin-top: 4px;">${escapeHtml(resource.location)}</p>
      </div>
    ` : ''}

    ${resource.uniqueValueProp ? `
      <div style="margin-bottom: 16px;">
        <strong style="color: #8B4513;">✨ Lo especial:</strong>
        <p style="color: #5C4033; margin-top: 4px;">${escapeHtml(resource.uniqueValueProp)}</p>
      </div>
    ` : ''}

    ${resource.description ? `
      <div style="margin-bottom: 16px;">
        <strong style="color: #8B4513;">📝 Descripción:</strong>
        <p style="color: #5C4033; margin-top: 4px;">${escapeHtml(resource.description)}</p>
      </div>
    ` : ''}

    ${resource.keyServices && resource.keyServices.length > 0 ? `
      <div style="margin-bottom: 16px;">
        <strong style="color: #8B4513;">🎯 Servicios:</strong>
        <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px;">
          ${resource.keyServices.map(s => `
            <span style="
              background-color: #fff5e6;
              padding: 6px 12px;
              border-radius: 4px;
              font-size: 12px;
              color: #5C4033;
              border: 1px solid #D4C4B0;
            ">${escapeHtml(s)}</span>
          `).join('')}
        </div>
      </div>
    ` : ''}

    ${resource.ageRange ? `
      <div style="margin-bottom: 16px;">
        <strong style="color: #8B4513;">👶 Rango de edad:</strong>
        <p style="color: #5C4033; margin-top: 4px;">${escapeHtml(resource.ageRange)}</p>
      </div>
    ` : ''}

    ${resource.phone || resource.url || resource.contact ? `
      <div style="
        background-color: #fff5e6;
        padding: 16px;
        border-radius: 6px;
        border: 1px solid #D4C4B0;
        margin-bottom: 16px;
      ">
        <strong style="color: #8B4513; display: block; margin-bottom: 12px;">📞 Contacto:</strong>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          ${resource.phone ? `
            <a href="tel:${resource.phone}" style="
              color: #8B4513;
              text-decoration: none;
              font-weight: 500;
            ">📞 ${escapeHtml(resource.phone)}</a>
          ` : ''}
          ${resource.url ? `
            <a href="${resource.url}" target="_blank" rel="noopener" style="
              color: #8B4513;
              text-decoration: none;
              font-weight: 500;
            ">🔗 ${escapeHtml(resource.url)}</a>
          ` : ''}
          ${resource.contact ? `
            <a href="mailto:${resource.contact}" style="
              color: #8B4513;
              text-decoration: none;
              font-weight: 500;
            ">✉️ ${escapeHtml(resource.contact)}</a>
          ` : ''}
        </div>
      </div>
    ` : ''}

    ${resource.type ? `
      <div style="margin-bottom: 16px;">
        <strong style="color: #8B4513;">🏢 Tipo:</strong>
        <p style="color: #5C4033; margin-top: 4px; text-transform: capitalize;">${escapeHtml(resource.type)}</p>
      </div>
    ` : ''}

    ${resource.verified ? `
      <div style="
        background-color: #E8F4F8;
        padding: 12px;
        border-radius: 6px;
        border: 1px solid #9B8B7E;
        text-align: center;
        font-size: 12px;
        color: #5C4033;
        margin-top: 16px;
      ">
        ✅ Recurso verificado
      </div>
    ` : ''}
  `;

  modalBody.innerHTML = html;
  modal.style.display = 'flex';
}

// MANEJO DE CAMBIO DE VENTANA
window.addEventListener('beforeunload', () => {
  // Guardar estado de filtros si es necesario
  const filters = window.getSelectedFilters?.();
  if (filters) {
    sessionStorage.setItem('lastFilters', JSON.stringify(filters));
  }
});

// RESTAURAR FILTROS PREVIOS (opcional)
function restoreFilters() {
  const lastFilters = sessionStorage.getItem('lastFilters');
  if (lastFilters) {
    try {
      const filters = JSON.parse(lastFilters);
      // Restaurar categorías
      filters.categories?.forEach(catId => {
        const checkbox = document.getElementById(`cat-${catId}`);
        if (checkbox) {
          checkbox.checked = true;
          handleCategoryChange({ target: checkbox });
        }
      });
      // Restaurar tags
      filters.tags?.forEach(tagId => {
        const button = document.querySelector(`[data-tag-id="${tagId}"]`);
        if (button) {
          handleTagClick({ target: button });
        }
      });
    } catch (e) {
      console.warn('Error restoring filters:', e);
    }
  }
}

// INICIAR CUANDO EL DOM ESTÉ LISTO
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

console.log('✅ App cargado');
