/* ============================================
   CITIES - Gestión de Recursos por Ciudad
   ============================================ */

let citiesData = [];

// Cargar datos de ciudades
async function loadCitiesData() {
  try {
    const response = await fetch('/data/cities.json');
    const data = await response.json();
    citiesData = data.cities;
    console.log('✅ Ciudades cargadas:', citiesData.length);
    return citiesData;
  } catch (error) {
    console.error('❌ Error cargando ciudades:', error);
    return [];
  }
}

// Filtrar recursos por ciudad
function filterResourcesByCity(resources, cityId) {
  if (!cityId || cityId === 'espana') {
    return resources; // Nacional = todos
  }

  const city = citiesData.find(c => c.id === cityId);
  if (!city) return resources;

  // Extraer nombre de ciudad de la ubicación
  const cityNameKeywords = [
    city.name,
    city.region,
    'múltiples'
  ];

  return resources.filter(resource => {
    const location = (resource.location || '').toLowerCase();
    return cityNameKeywords.some(keyword =>
      location.includes(keyword.toLowerCase())
    );
  });
}

// Obtener ciudad desde URL
function getCityFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('city') || null;
}

// Actualizar URL con ciudad
function updateCityURL(cityId) {
  const url = new URL(window.location);
  if (cityId) {
    url.searchParams.set('city', cityId);
  } else {
    url.searchParams.delete('city');
  }
  window.history.replaceState(null, '', url);
}

// Crear Schema GeoShape para ciudad
function createCityGeoSchema(city) {
  return {
    "@context": "https://schema.org",
    "@type": "GeoShape",
    "name": city.name,
    "latitude": city.coordinates.latitude,
    "longitude": city.coordinates.longitude,
    "address": {
      "@type": "PostalAddress",
      "addressRegion": city.region,
      "addressCountry": "ES"
    }
  };
}

// Crear página de ciudad
function renderCityPage(cityId) {
  const city = citiesData.find(c => c.id === cityId);
  if (!city) return;

  // Actualizar título
  const titleEl = document.getElementById('resultsTitle');
  if (titleEl) {
    titleEl.textContent = `📍 Recursos TEA en ${city.name}`;
  }

  // Actualizar breadcrumb
  if (window.updateBreadcrumb) {
    window.updateBreadcrumb([], [], `Recursos en ${city.name}`);
  }

  // Actualizar Schema
  updateCitySchema(city);

  // Filtrar recursos
  const resources = window.allResources || [];
  const filtered = filterResourcesByCity(resources, cityId);

  console.log(`📍 ${city.name}: ${filtered.length} recursos encontrados`);

  return filtered;
}

// Actualizar Schema JSON-LD para ciudad
function updateCitySchema(city) {
  const citySchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `Recursos TEA en ${city.name}`,
    "description": city.description,
    "url": `https://guia-tea.netlify.app/ciudades/${city.slug}`,
    "areaServed": {
      "@type": "Place",
      "name": city.name,
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": city.coordinates.latitude,
        "longitude": city.coordinates.longitude
      }
    },
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": window.allResources?.length || 0
    }
  };

  // Buscar o crear script de Schema
  let citySchemaScript = document.querySelector('script[data-schema="city"]');
  if (!citySchemaScript) {
    citySchemaScript = document.createElement('script');
    citySchemaScript.type = 'application/ld+json';
    citySchemaScript.setAttribute('data-schema', 'city');
    document.head.appendChild(citySchemaScript);
  }
  citySchemaScript.textContent = JSON.stringify(citySchema);
}

// Renderizar selector de ciudades
function renderCitySelector() {
  const container = document.createElement('nav');
  container.className = 'city-selector';
  container.setAttribute('aria-label', 'Seleccionar ciudad');

  const html = `
    <div class="city-selector-header">
      <h3>📍 Recursos por Ciudad</h3>
    </div>
    <ul class="city-list">
      ${citiesData
        .filter(city => city.featured)
        .map(city => `
          <li>
            <a href="?city=${city.id}"
               class="city-link"
               data-city="${city.id}"
               aria-label="Ver recursos en ${city.name}">
              ${city.name}
            </a>
          </li>
        `)
        .join('')}
      <li>
        <details class="city-dropdown">
          <summary>Más ciudades ▼</summary>
          <ul>
            ${citiesData
              .filter(city => !city.featured)
              .map(city => `
                <li>
                  <a href="?city=${city.id}"
                     class="city-link"
                     data-city="${city.id}">
                    ${city.name}
                  </a>
                </li>
              `)
              .join('')}
          </ul>
        </details>
      </li>
    </ul>
  `;

  container.innerHTML = html;

  // Agregar event listeners
  container.querySelectorAll('.city-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const cityId = link.dataset.city;
      updateCityURL(cityId);

      if (window.allResources) {
        const filtered = filterResourcesByCity(window.allResources, cityId);
        const grid = document.getElementById('resourcesGrid');
        const categories = window.allCategories || [];

        if (grid) {
          grid.innerHTML = window.renderGrid(filtered, categories);
        }

        renderCityPage(cityId);
      }
    });
  });

  return container;
}

// Inicializar ciudades
async function initializeCities() {
  await loadCitiesData();

  const cityId = getCityFromURL();
  if (cityId) {
    // Renderizar página de ciudad cuando se carguen los datos
    setTimeout(() => {
      if (window.allResources) {
        renderCityPage(cityId);
      }
    }, 100);
  }

  console.log('✅ Cities inicializado');
}

// Exportar funciones globales
if (typeof window !== 'undefined') {
  window.filterResourcesByCity = filterResourcesByCity;
  window.renderCityPage = renderCityPage;
  window.renderCitySelector = renderCitySelector;
  window.initializeCities = initializeCities;
}

console.log('✅ Cities cargado');
