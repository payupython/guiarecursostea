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

// INICIALIZAR BÚSQUEDA
function initializeSearch(resources, categories) {
  console.log('🔧 Inicializando búsqueda con', resources?.length, 'recursos');

  // Guardar en window para acceso global
  window.allResources = resources;
  window.allCategories = categories;

  const searchInput = document.getElementById('searchInput');

  if (searchInput) {
    // Debounced search function
    const debouncedSearch = debounce(() => {
      const query = searchInput.value;
      const resourcesSource = window.allResources || resources || [];
      applySearch(query, resourcesSource, categories);
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
