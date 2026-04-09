/* ============================================
   ADMIN - Panel de Administración
   ============================================ */

let adminResources = [];
let resourcesData = null;

// VERIFICAR AUTENTICACIÓN (usa Netlify Identity)
function checkAdminAuth() {
  const user = netlifyIdentity.currentUser();
  const loginSection = document.getElementById('loginSection');
  const adminPanel = document.getElementById('adminPanel');

  if (user) {
    if (loginSection) loginSection.style.display = 'none';
    if (adminPanel) adminPanel.style.display = 'block';
    loadAdminResources();
    initializeAdminFunctionality();
  } else {
    if (loginSection) loginSection.style.display = 'block';
    if (adminPanel) adminPanel.style.display = 'none';
  }
}

// Eventos de Netlify Identity
netlifyIdentity.on('login', () => {
  netlifyIdentity.close();
  checkAdminAuth();
  showNotification('✅ Bienvenido', 'success');
});

netlifyIdentity.on('logout', () => {
  location.reload();
});

// CARGAR RECURSOS
async function loadAdminResources() {
  try {
    // admin.html está en /pages/, así que la ruta es ../data/resources.json
    const response = await fetch('../data/resources.json');
    resourcesData = await response.json();
    adminResources = [...resourcesData.resources];
    renderResourcesList();
    updateDashboardStats();
    console.log('✅ Recursos cargados en admin');
  } catch (error) {
    console.error('❌ Error cargando recursos:', error);
    showNotification('Error cargando recursos', 'error');
  }
}

// ACTUALIZAR DASHBOARD
function updateDashboardStats() {
  const statsContainer = document.getElementById('statsContainer');
  if (!statsContainer) return;

  const categories = resourcesData.categories;
  const totalResources = adminResources.length;
  const resourcesByCategory = {};

  categories.forEach(cat => {
    resourcesByCategory[cat.id] = adminResources.filter(r => r.category === cat.id).length;
  });

  let html = `
    <div class="stat-card">
      <div class="stat-number">${totalResources}</div>
      <div class="stat-label">Recursos Totales</div>
    </div>
  `;

  categories.forEach(cat => {
    html += `
      <div class="stat-card">
        <div class="stat-number">${resourcesByCategory[cat.id]}</div>
        <div class="stat-label">${cat.name.split(',')[0]}</div>
      </div>
    `;
  });

  statsContainer.innerHTML = html;
}

// RENDERIZAR LISTA DE RECURSOS
function renderResourcesList(resources = adminResources) {
  const container = document.getElementById('resourcesList');
  if (!container) return;

  if (resources.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: #5C4033;">No hay recursos</p>';
    return;
  }

  const html = resources
    .map(resource => `
      <div class="resource-item">
        <h4>📌 ${escapeHtml(resource.name)}</h4>
        <p style="color: #5C4033; font-size: 12px; margin-bottom: 8px;">
          <strong>Categoría:</strong> ${resource.category} | <strong>Ubicación:</strong> ${resource.location || 'N/A'}
        </p>
        <p style="color: #8B7355; font-size: 12px; margin-bottom: 8px; max-height: 40px; overflow: hidden;">
          ${escapeHtml(resource.description).substring(0, 100)}...
        </p>
        <div class="resource-item-actions">
          <button class="edit-btn" data-id="${resource.id}" style="background-color: var(--color-secondary); color: white; border: none;">✏️ Editar</button>
          <button class="delete-btn" data-id="${resource.id}" style="background-color: #D2691E; color: white; border: none;">🗑️ Eliminar</button>
        </div>
      </div>
    `)
    .join('');

  container.innerHTML = html;

  // Event listeners
  container.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const resourceId = btn.dataset.id;
      loadResourceForEdit(resourceId);
    });
  });

  container.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const resourceId = btn.dataset.id;
      if (confirm('¿Estás seguro de eliminar este recurso?')) {
        deleteResource(resourceId);
      }
    });
  });
}

// CARGAR RECURSO PARA EDITAR
function loadResourceForEdit(resourceId) {
  const resource = adminResources.find(r => r.id === resourceId);
  if (!resource) return;

  // Llenar formulario
  document.getElementById('resourceName').value = resource.name;
  document.getElementById('resourceCategory').value = resource.category;
  document.getElementById('resourceLocation').value = resource.location || '';
  document.getElementById('resourceDescription').value = resource.description || '';
  document.getElementById('resourceValueProp').value = resource.uniqueValueProp || '';
  document.getElementById('resourceUrl').value = resource.url || '';
  document.getElementById('resourcePhone').value = resource.phone || '';
  document.getElementById('resourceContact').value = resource.contact || '';
  document.getElementById('resourceType').value = resource.type || 'publica';
  document.getElementById('resourceAgeRange').value = resource.ageRange || '';
  document.getElementById('resourceServices').value = resource.keyServices.join(', ') || '';

  // Cambiar título y guardar ID
  const form = document.getElementById('resourceForm');
  form.dataset.editId = resourceId;

  const formTitle = form.querySelector('h2');
  if (formTitle) {
    formTitle.textContent = '✏️ Editar Recurso';
  }

  // Scroll al formulario
  form.scrollIntoView({ behavior: 'smooth' });

  showNotification('Recurso cargado para editar', 'info');
}

// GUARDAR/ACTUALIZAR RECURSO
function setupFormSubmit() {
  const form = document.getElementById('resourceForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const editId = form.dataset.editId;
    const newId = generateResourceId(document.getElementById('resourceName').value);

    const resource = {
      id: editId || newId,
      name: document.getElementById('resourceName').value,
      category: document.getElementById('resourceCategory').value,
      tags: [], // Se puede mejorar
      description: document.getElementById('resourceDescription').value,
      uniqueValueProp: document.getElementById('resourceValueProp').value,
      url: document.getElementById('resourceUrl').value,
      contact: document.getElementById('resourceContact').value,
      phone: document.getElementById('resourcePhone').value,
      location: document.getElementById('resourceLocation').value,
      ageRange: document.getElementById('resourceAgeRange').value,
      type: document.getElementById('resourceType').value,
      keyServices: document.getElementById('resourceServices').value
        .split(',')
        .map(s => s.trim())
        .filter(s => s),
      verified: true
    };

    if (editId) {
      // Actualizar
      const index = adminResources.findIndex(r => r.id === editId);
      if (index !== -1) {
        adminResources[index] = resource;
        showNotification('✅ Recurso actualizado', 'success');
      }
    } else {
      // Crear nuevo
      adminResources.push(resource);
      showNotification('✅ Recurso creado', 'success');
    }

    // Guardar en localStorage
    saveResourcesToStorage();

    // Limpiar formulario
    form.reset();
    form.dataset.editId = '';
    const formTitle = form.querySelector('h2');
    if (formTitle) {
      formTitle.textContent = '➕ Crear Nuevo Recurso';
    }

    // Actualizar lista
    renderResourcesList();
    updateDashboardStats();
  });
}

// ELIMINAR RECURSO
function deleteResource(resourceId) {
  adminResources = adminResources.filter(r => r.id !== resourceId);
  saveResourcesToStorage();
  renderResourcesList();
  updateDashboardStats();
  showNotification('✅ Recurso eliminado', 'success');
}

// GENERAR ID DESDE NOMBRE
function generateResourceId(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .slice(0, 50);
}

// GUARDAR RECURSOS EN ALMACENAMIENTO
function saveResourcesToStorage() {
  const data = {
    ...resourcesData,
    resources: adminResources
  };
  saveToLocalStorage('admin-resources-backup', data);
}

// EXPORTAR JSON
function setupExportBtn() {
  const exportBtn = document.getElementById('exportBtn');
  if (!exportBtn) return;

  exportBtn.addEventListener('click', () => {
    const data = {
      ...resourcesData,
      resources: adminResources,
      exportedAt: new Date().toISOString()
    };

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `recursos-tea-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    showNotification('✅ JSON exportado', 'success');
  });
}

// IMPORTAR JSON
function setupImportBtn() {
  const importBtn = document.getElementById('importBtn');
  const fileInput = document.getElementById('jsonImportFile');

  if (importBtn && fileInput) {
    importBtn.addEventListener('click', () => {
      const file = fileInput.files[0];
      if (!file) {
        showNotification('Selecciona un archivo primero', 'error');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          if (data.resources && Array.isArray(data.resources)) {
            adminResources = data.resources;
            resourcesData = data;
            saveResourcesToStorage();
            renderResourcesList();
            updateDashboardStats();
            fileInput.value = '';
            showNotification('✅ Datos importados correctamente', 'success');
          } else {
            showNotification('❌ Formato JSON inválido', 'error');
          }
        } catch (error) {
          showNotification('❌ Error leyendo JSON', 'error');
          console.error(error);
        }
      };
      reader.readAsText(file);
    });
  }
}

// BUSCAR EN LISTA
function setupSearchAdmin() {
  const searchInput = document.getElementById('searchAdminInput');
  if (!searchInput) return;

  const debouncedSearch = debounce(() => {
    const query = searchInput.value.toLowerCase();
    const filtered = adminResources.filter(r => {
      return r.name.toLowerCase().includes(query) ||
             r.description.toLowerCase().includes(query) ||
             r.location.toLowerCase().includes(query);
    });
    renderResourcesList(filtered);
  }, 300);

  searchInput.addEventListener('input', debouncedSearch);
}

// NAVEGACIÓN DE TABS
function setupAdminTabs() {
  const tabBtns = document.querySelectorAll('.admin-tab-btn');
  const sections = document.querySelectorAll('.admin-section');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabName = btn.dataset.tab;

      if (tabName === 'logout') {
        netlifyIdentity.logout();
        return;
      }

      // Desactivar todos
      tabBtns.forEach(b => b.classList.remove('active'));
      sections.forEach(s => s.classList.remove('active'));

      // Activar seleccionado
      btn.classList.add('active');
      const section = document.getElementById(tabName);
      if (section) {
        section.classList.add('active');
      }
    });
  });
}

// INICIALIZAR FUNCIONALIDAD ADMIN
function initializeAdminFunctionality() {
  setupFormSubmit();
  setupExportBtn();
  setupImportBtn();
  setupSearchAdmin();
  setupAdminTabs();

  console.log('✅ Admin funcionalidad inicializada');
}

// INICIAR CUANDO CARGUE
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', checkAdminAuth);
} else {
  checkAdminAuth();
}

console.log('✅ Admin cargado');
