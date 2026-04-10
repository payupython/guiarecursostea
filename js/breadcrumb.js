/* ============================================
   BREADCRUMB - Navegación de Migas de Pan
   ============================================ */

// Actualizar BreadcrumbList según filtros aplicados
function updateBreadcrumb(categories = [], tags = [], searchQuery = '') {
  const breadcrumbItems = [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Inicio",
      "item": "https://guia-tea.netlify.app"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Recursos",
      "item": "https://guia-tea.netlify.app/"
    }
  ];

  let position = 3;

  // Agregar categorías al breadcrumb
  if (categories && categories.length > 0) {
    const categoryNames = categories.map(catId => {
      const category = window.allCategories?.find(c => c.id === catId);
      return category?.name || catId;
    });

    categoryNames.forEach((catName, index) => {
      breadcrumbItems.push({
        "@type": "ListItem",
        "position": position,
        "name": catName,
        "item": `https://guia-tea.netlify.app/?categories=${categories.join(',')}`
      });
      position++;
    });
  }

  // Agregar tags al breadcrumb
  if (tags && tags.length > 0) {
    const tagNames = tags.map(tagId => {
      const tag = window.allTags?.find(t => t.id === tagId);
      return tag?.label || `#${tagId}`;
    });

    tagNames.forEach((tagName) => {
      breadcrumbItems.push({
        "@type": "ListItem",
        "position": position,
        "name": tagName,
        "item": `https://guia-tea.netlify.app/?tags=${tags.join(',')}`
      });
      position++;
    });
  }

  // Agregar búsqueda si existe
  if (searchQuery && searchQuery.trim()) {
    breadcrumbItems.push({
      "@type": "ListItem",
      "position": position,
      "name": `Búsqueda: "${searchQuery}"`,
      "item": `https://guia-tea.netlify.app/?q=${encodeURIComponent(searchQuery)}`
    });
  }

  // Actualizar JSON-LD
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbItems
  };

  const breadcrumbScript = document.querySelector('script[data-schema="breadcrumb"]');
  if (breadcrumbScript) {
    breadcrumbScript.textContent = JSON.stringify(breadcrumbSchema);
  }

  console.log('🔗 Breadcrumb actualizado:', breadcrumbItems.map(i => i.name).join(' > '));
}

// Renderizar breadcrumb visual (HTML)
function renderBreadcrumbNav(categories = [], tags = [], searchQuery = '') {
  const breadcrumbNav = document.querySelector('nav[aria-label="Navegación de ruta"]');
  if (!breadcrumbNav) return;

  const breadcrumbItems = [
    { name: 'Inicio', url: '/' }
  ];

  // Agregar categorías
  if (categories && categories.length > 0) {
    categories.forEach(catId => {
      const category = window.allCategories?.find(c => c.id === catId);
      if (category) {
        breadcrumbItems.push({
          name: category.name,
          url: `?categories=${categories.join(',')}`
        });
      }
    });
  }

  // Agregar tags
  if (tags && tags.length > 0) {
    tags.forEach(tagId => {
      const tag = window.allTags?.find(t => t.id === tagId);
      if (tag) {
        breadcrumbItems.push({
          name: tag.label,
          url: `?tags=${tags.join(',')}`
        });
      }
    });
  }

  // Agregar búsqueda
  if (searchQuery && searchQuery.trim()) {
    breadcrumbItems.push({
      name: `Búsqueda: "${searchQuery}"`,
      url: `?q=${encodeURIComponent(searchQuery)}`
    });
  }

  // Generar HTML
  const html = `
    <ol aria-label="Migas de pan">
      ${breadcrumbItems
        .map((item, index) => `
          <li>
            ${index < breadcrumbItems.length - 1
              ? `<a href="${item.url}">${item.name}</a>`
              : `<span aria-current="page">${item.name}</span>`
            }
            ${index < breadcrumbItems.length - 1 ? '<span aria-hidden="true">/</span>' : ''}
          </li>
        `)
        .join('')}
    </ol>
  `;

  breadcrumbNav.innerHTML = html;
}

// Exportar funciones globales
if (typeof window !== 'undefined') {
  window.updateBreadcrumb = updateBreadcrumb;
  window.renderBreadcrumbNav = renderBreadcrumbNav;
}

console.log('✅ Breadcrumb cargado');
