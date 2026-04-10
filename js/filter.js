/* ============================================
   FILTER - Filtrado por Categorías y Etiquetas
   ============================================ */

let selectedCategories = [];
let selectedTags = [];
let allResources = [];

// FILTRAR POR CATEGORÍAS
function filterByCategories(resources, categoryIds) {
  if (categoryIds.length === 0) return resources;

  return resources.filter(resource => categoryIds.includes(resource.category));
}

// FILTRAR POR ETIQUETAS
function filterByTags(resources, tagIds) {
  if (tagIds.length === 0) return resources;

  return resources.filter(resource => {
    return tagIds.some(tagId => resource.tags.includes(tagId));
  });
}

// APLICAR TODOS LOS FILTROS
function applyFilters(resources, categories = [], tags = []) {
  let filtered = resources;

  if (categories.length > 0) {
    filtered = filterByCategories(filtered, categories);
  }

  if (tags.length > 0) {
    filtered = filterByTags(filtered, tags);
  }

  return filtered;
}

// RENDERIZAR LISTA DE CATEGORÍAS (CHECKBOXES)
function renderCategoryFilters(categories) {
  const container = document.getElementById('categoriesList');
  if (!container) return;

  container.innerHTML = categories
    .map(cat => `
      <div class="category-item">
        <input
          type="checkbox"
          id="cat-${cat.id}"
          value="${cat.id}"
          class="category-checkbox"
          aria-label="Filtrar por ${cat.name}"
        >
        <label for="cat-${cat.id}">${cat.name}</label>
      </div>
    `)
    .join('');

  // Agregar event listeners
  container.querySelectorAll('.category-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', handleCategoryChange);
  });
}

// MANEJAR CAMBIO DE CATEGORÍA
function handleCategoryChange(e) {
  const categoryId = e.target.value;
  const isChecked = e.target.checked;

  if (isChecked) {
    if (!selectedCategories.includes(categoryId)) {
      selectedCategories.push(categoryId);
    }
  } else {
    selectedCategories = selectedCategories.filter(id => id !== categoryId);
  }

  pushEvent('filter_category', {
    category_id: categoryId,
    action: isChecked ? 'select' : 'deselect'
  });

  applyAllFilters();
  updateFilterURL();
}

// RENDERIZAR GRID DE ETIQUETAS (TAGS)
function renderTagFilters(tags) {
  const container = document.getElementById('tagsList');
  if (!container) return;

  container.innerHTML = tags
    .map(tag => `
      <button
        class="tag-button"
        data-tag-id="${tag.id}"
        aria-label="Filtrar por etiqueta ${tag.label}"
        aria-pressed="false"
      >
        ${tag.label}
      </button>
    `)
    .join('');

  // Agregar event listeners
  container.querySelectorAll('.tag-button').forEach(button => {
    button.addEventListener('click', handleTagClick);
  });
}

// MANEJAR CLICK EN ETIQUETA
function handleTagClick(e) {
  const tagId = e.target.dataset.tagId;
  const isActive = e.target.classList.contains('active');

  if (isActive) {
    e.target.classList.remove('active');
    e.target.setAttribute('aria-pressed', 'false');
    selectedTags = selectedTags.filter(id => id !== tagId);
  } else {
    e.target.classList.add('active');
    e.target.setAttribute('aria-pressed', 'true');
    if (!selectedTags.includes(tagId)) {
      selectedTags.push(tagId);
    }
  }

  pushEvent('filter_tag', {
    tag_id: tagId,
    action: isActive ? 'deselect' : 'select'
  });

  applyAllFilters();
  updateFilterURL();
}

// APLICAR TODOS LOS FILTROS Y BÚSQUEDA ACTUAL
function applyAllFilters() {
  const searchInput = document.getElementById('searchInput');
  const query = searchInput ? searchInput.value : '';

  // Usar window.allResources si está disponible
  const resourcesSource = window.allResources || allResources || [];

  console.log('🔄 Aplicando filtros con', resourcesSource.length, 'recursos');

  // Primero aplicar filtros
  let results = applyFilters(resourcesSource, selectedCategories, selectedTags);

  // Luego aplicar búsqueda
  if (query.trim()) {
    results = searchResources(query, results);
  }

  // Renderizar resultados
  const grid = document.getElementById('resourcesGrid');
  const categories = window.allCategories || [];

  if (grid) {
    if (results.length === 0) {
      grid.innerHTML = '';
      toggleEmptyState(true);
      updateResultsCount(0);
      pushEvent('filter_no_results', {
        categories: selectedCategories,
        tags: selectedTags,
        search_term: query
      });
    } else {
      grid.innerHTML = renderGrid(results, categories);
      toggleEmptyState(false);
      updateResultsCount(results.length);
    }
  }
}

// BOTÓN LIMPIAR FILTROS
function initializeClearFiltersBtn() {
  const clearBtn = document.getElementById('clearFiltersBtn');
  if (!clearBtn) return;

  clearBtn.addEventListener('click', () => {
    // Limpiar selecciones
    selectedCategories = [];
    selectedTags = [];

    // Limpiar checkboxes
    document.querySelectorAll('.category-checkbox').forEach(checkbox => {
      checkbox.checked = false;
    });

    // Limpiar tags activos
    document.querySelectorAll('.tag-button.active').forEach(button => {
      button.classList.remove('active');
      button.setAttribute('aria-pressed', 'false');
    });

    // Limpiar búsqueda
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.value = '';
    }

    // Renderizar todos los recursos
    applyAllFilters();
    updateFilterURL();

    // Feedback visual
    showNotification('Filtros limpiados', 'info');
  });
}

// MOBILE SIDEBAR TOGGLE
function initializeMobileSidebar() {
  // Solo si hay pantalla pequeña
  if (window.innerWidth > 767) return;

  const sidebar = document.querySelector('.sidebar');
  const closeBtn = document.querySelector('.close-sidebar');

  // Crear botón de toggle si no existe
  const mainContent = document.querySelector('.main-content');
  if (mainContent && !document.getElementById('toggleFiltersBtn')) {
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'toggleFiltersBtn';
    toggleBtn.className = 'btn btn-secondary toggle-filters-btn';
    toggleBtn.innerHTML = '⚙️ Mostrar Filtros';
    mainContent.parentElement.insertBefore(toggleBtn, mainContent);

    toggleBtn.addEventListener('click', () => {
      if (sidebar.classList.contains('active')) {
        sidebar.classList.remove('active');
        toggleBtn.innerHTML = '⚙️ Mostrar Filtros';
      } else {
        sidebar.classList.add('active');
        toggleBtn.innerHTML = '⚙️ Ocultar Filtros';
      }
    });
  }

  if (closeBtn && sidebar) {
    closeBtn.addEventListener('click', () => {
      sidebar.classList.remove('active');
      document.getElementById('toggleFiltersBtn').innerHTML = '⚙️ Mostrar Filtros';
    });
  }
}

// ACTUALIZAR URL CON FILTROS ACTUALES
function updateFilterURL() {
  const params = new URLSearchParams();

  // Agregar categorías a la URL
  if (selectedCategories.length > 0) {
    params.set('categories', selectedCategories.join(','));
  }

  // Agregar tags a la URL
  if (selectedTags.length > 0) {
    params.set('tags', selectedTags.join(','));
  }

  // Mantener búsqueda si existe
  const searchInput = document.getElementById('searchInput');
  if (searchInput && searchInput.value.trim()) {
    params.set('q', searchInput.value.trim());
  }

  // Actualizar URL sin recargar la página
  const queryString = params.toString();
  const newURL = queryString ? `?${queryString}` : window.location.pathname;
  window.history.replaceState({ filters: { categories: selectedCategories, tags: selectedTags } }, '', newURL);

  console.log('🔗 URL actualizada:', newURL);
}

// LEER FILTROS DE LA URL Y APLICARLOS
function applyFiltersFromURL() {
  const params = new URLSearchParams(window.location.search);

  // Leer categorías de la URL
  const categoriesParam = params.get('categories');
  if (categoriesParam) {
    selectedCategories = categoriesParam.split(',').filter(c => c);
    console.log('📂 Categorías desde URL:', selectedCategories);
  }

  // Leer tags de la URL
  const tagsParam = params.get('tags');
  if (tagsParam) {
    selectedTags = tagsParam.split(',').filter(t => t);
    console.log('#️⃣ Tags desde URL:', selectedTags);
  }

  // Marcar checkboxes y botones como seleccionados
  if (selectedCategories.length > 0) {
    selectedCategories.forEach(catId => {
      const checkbox = document.getElementById(`cat-${catId}`);
      if (checkbox) {
        checkbox.checked = true;
      }
    });
  }

  if (selectedTags.length > 0) {
    selectedTags.forEach(tagId => {
      const button = document.querySelector(`[data-tag-id="${tagId}"]`);
      if (button) {
        button.classList.add('active');
        button.setAttribute('aria-pressed', 'true');
      }
    });
  }

  // Aplicar los filtros
  if (selectedCategories.length > 0 || selectedTags.length > 0) {
    applyAllFilters();
  }
}

// INICIALIZAR FILTROS
function initializeFilters(resources, categories, tags) {
  console.log('🔧 Inicializando filtros con', resources?.length, 'recursos');

  allResources = resources;

  // Guardar en window para acceso global
  window.allResources = resources;
  window.allCategories = categories;
  window.allTags = tags;

  if (!categories || !tags) {
    console.warn('⚠️ Categories o tags no disponibles');
    return;
  }

  try {
    renderCategoryFilters(categories);
    console.log('✅ Categorías renderizadas');
  } catch (e) {
    console.error('❌ Error en categorías:', e);
  }

  try {
    renderTagFilters(tags);
    console.log('✅ Tags renderizados');
  } catch (e) {
    console.error('❌ Error en tags:', e);
  }

  initializeClearFiltersBtn();
  initializeMobileSidebar();

  // Aplicar filtros desde la URL
  applyFiltersFromURL();

  console.log('✅ Filters completamente inicializado');
}

// EXPORTAR PARA USO GLOBAL
if (typeof window !== 'undefined') {
  window.filterByCategories = filterByCategories;
  window.filterByTags = filterByTags;
  window.applyFilters = applyFilters;
  window.getSelectedFilters = () => ({
    categories: selectedCategories,
    tags: selectedTags
  });
}

console.log('✅ Filter cargado');
