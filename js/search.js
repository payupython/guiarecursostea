/* ============================================
   SEARCH - Búsqueda Global
   ============================================ */

// Nota: allResources viene de window (se asigna en app.js)
let searchCache = {};

// BUSCAR RECURSOS
function searchResources(query, resources) {
  // Si no se pasan recursos, usar los globales
  if (!resources) {
    resources = window.allResources || [];
  }

  if (!query || query.trim().length === 0) {
    return resources;
  }

  const searchQuery = query.toLowerCase().trim();

  return resources.filter(resource => {
    const searchableText = [
      resource.name,
      resource.description,
      resource.uniqueValueProp,
      resource.location,
      resource.category,
      (resource.keyServices || []).join(' '),
      (resource.tags || []).join(' ')
    ]
      .map(text => (text || '').toLowerCase())
      .join(' ');

    return searchableText.includes(searchQuery);
  });
}

// APLICAR BÚSQUEDA Y RENDERIZAR RESULTADOS
function applySearch(query, resources = allResources, categories = []) {
  const results = searchResources(query, resources);
  renderSearchResults(results, categories);
  return results;
}

// RENDERIZAR RESULTADOS DE BÚSQUEDA
function renderSearchResults(results, categories = []) {
  const grid = document.getElementById('resourcesGrid');
  if (!grid) return;

  if (results.length === 0) {
    grid.innerHTML = '';
    toggleEmptyState(true);
    updateResultsCount(0);
  } else {
    grid.innerHTML = renderGrid(results, categories);
    toggleEmptyState(false);
    updateResultsCount(results.length);
  }
}

// ACTUALIZAR URL CON PARÁMETRO DE BÚSQUEDA (para GA4 Site Search)
function updateSearchUrl(query) {
  const url = new URL(window.location);
  if (query) {
    url.searchParams.set('q', query);
  } else {
    url.searchParams.delete('q');
  }
  history.replaceState(null, '', url);
}

// ENVIAR EVENTO AL DATALAYER (para GTM/GA4)
function pushSearchEvent(query, resultCount) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'search',
    search_term: query,
    search_results_count: resultCount
  });
}

// INICIALIZAR BÚSQUEDA
function initializeSearch(resources, categories) {
  console.log('🔧 Inicializando búsqueda con', resources?.length, 'recursos');

  // Guardar en window para acceso global
  window.allResources = resources;
  window.allCategories = categories;

  const searchInput = document.getElementById('searchInput');

  // Restaurar búsqueda desde URL si existe
  const initialQuery = getUrlParam('q');
  if (initialQuery && searchInput) {
    searchInput.value = initialQuery;
    applySearch(initialQuery, resources, categories);
  }

  if (searchInput) {
    // Debounced search function
    const debouncedSearch = debounce(() => {
      const query = searchInput.value.trim();
      const resourcesSource = window.allResources || resources || [];
      const results = applySearch(query, resourcesSource, categories);

      updateSearchUrl(query);
      if (query.length >= 2) {
        pushSearchEvent(query, results.length);
      }
    }, 300);

    searchInput.addEventListener('input', debouncedSearch);

    // Focus improvement
    searchInput.addEventListener('focus', () => {
      searchInput.parentElement.style.boxShadow = '0 0 12px rgba(139, 69, 19, 0.3)';
    });

    searchInput.addEventListener('blur', () => {
      searchInput.parentElement.style.boxShadow = 'none';
    });
  }

  // Reset button
  const resetBtn = document.getElementById('resetBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      searchInput.value = '';
      applySearch('', allResources, categories);
      searchInput.focus();
    });
  }

  console.log('✅ Search inicializado');
}

// EXPORTAR PARA USO GLOBAL
if (typeof window !== 'undefined') {
  window.searchResources = searchResources;
  window.applySearch = applySearch;
}

console.log('✅ Search cargado');
