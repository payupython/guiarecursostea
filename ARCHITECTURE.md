# 🏗️ Arquitectura Técnica - Guía TEA

## Visión General

Plataforma web **100% cliente-side** (sin servidor) para directorio de recursos TEA. Diseñada para máxima accesibilidad y disponibilidad.

```
┌─────────────────────────────────────────────────┐
│           NAVEGADOR DEL USUARIO                 │
├─────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────┐   │
│  │        HTML + CSS + JavaScript           │   │
│  │  ┌──────────────┐  ┌────────────────┐  │   │
│  │  │  UI Layer    │  │  localStorage  │  │   │
│  │  │ (Components) │  │  (Progreso)    │  │   │
│  │  └──────────────┘  └────────────────┘  │   │
│  │  ┌──────────────┐  ┌────────────────┐  │   │
│  │  │ Search/Filter│  │  JSON in-mem   │  │   │
│  │  │   Engine     │  │  (Resources)   │  │   │
│  │  └──────────────┘  └────────────────┘  │   │
│  └─────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
         ↓
    Fetch JSON estático
         ↓
┌─────────────────────────────────────────────────┐
│        /data/resources.json (20KB)              │
│  - Categorías                                    │
│  - Etiquetas                                     │
│  - Recursos (200+)                              │
└─────────────────────────────────────────────────┘
```

## Stack Tecnológico

| Capa | Tecnología | Propósito |
|------|-----------|----------|
| **Presentación** | HTML5 | Estructura semántica |
| **Estilos** | CSS3 | Tema vintage, responsive |
| **Lógica** | JavaScript Vanilla | Sin dependencias |
| **Datos** | JSON estático | Persistencia simple |
| **Almacenamiento** | localStorage API | Progreso del usuario |
| **Hosting** | GitHub Pages / Estático | Gratis y escalable |

## Flujo de Datos

### 1. **Inicialización (App Load)**
```
HTML Load
    ↓
CSS Loaded (Styles aplicados)
    ↓
JS Loaded (Scripts en orden):
  1. utils.js (funciones base)
  2. gamification.js (niveles)
  3. search.js (búsqueda)
  4. filter.js (filtros)
  5. app.js (orquestación)
    ↓
Fetch /data/resources.json
    ↓
Parse JSON → appData
    ↓
Render Initial Grid (20+ recursos)
    ↓
Initialize Event Listeners
    ↓
Load User Progress (localStorage)
    ↓
Render Level Badge
```

### 2. **Búsqueda**
```
User types in search bar
    ↓
Input event triggered
    ↓
Debounce 300ms
    ↓
searchResources() {
  - Loop through resources
  - Check name, description, services, location
  - Return matching resources
}
    ↓
applyAllFilters() {
  - Combine search + category filters + tag filters
  - Render results
  - Update counter
}
    ↓
Render grid with results
```

### 3. **Filtrado**
```
User selects checkbox/tag
    ↓
handleCategoryChange() or handleTagClick()
    ↓
Update selectedCategories[] or selectedTags[]
    ↓
applyAllFilters() {
  - filterByCategories() → resources
  - filterByTags() → resources
  - searchResources() → resources (si hay búsqueda activa)
}
    ↓
Render filtered grid
    ↓
Update result count
```

### 4. **Gamificación (Nivel)**
```
User clicks on resource card
    ↓
markResourceAsVisited(resourceId) {
  - Read visitedResources[] from localStorage
  - If resourceId not in array:
    - Add resourceId
    - Increment totalVisits
    - Save to localStorage
    - Return { isNewResource: true }
}
    ↓
renderLevelBadge() {
  - Calculate new level based on visitedCount
  - Update badge icon, name, color
}
    ↓
checkLevelUp() {
  - If previousLevel != currentLevel:
    - Show animation
    - Return newLevel
}
    ↓
showLevelUpAnimation() if leveled up
```

## Estructura de Archivos (Detallada)

### HTML
```
index.html
├── Header
│   ├── Logo + Tagline
│   ├── Level Badge
│   └── Search Bar
├── Main Wrapper
│   ├── Sidebar (Filters)
│   │   ├── Categories
│   │   ├── Tags
│   │   └── Clear Button
│   └── Main Content
│       ├── Results Header
│       ├── Resources Grid
│       └── Empty State
├── Footer
│   ├── Propose Section
│   ├── Info Section
│   └── Admin Link
└── Modal (Details)

pages/admin.html
├── Login Form
└── Admin Panel
    ├── Dashboard (Stats)
    ├── Create Resource (Form)
    ├── List Resources (CRUD)
    └── Import JSON
```

### CSS (Cascade)
```
styles.css (1000+ líneas)
├── :root (variables CSS)
├── * (reset)
├── body (base)
├── .header
├── .search-container
├── .main-wrapper & .sidebar
├── .resource-card (componente principal)
├── .filter-section
├── .btn (styles)
├── .footer
└── .modal

components.css (200+ líneas)
├── Animaciones
├── Hover states
├── Focus styles
└── Estados especiales

responsive.css (300+ líneas)
├── @media 768px (tablet)
├── @media 1024px (desktop)
├── @media 480px (mobile)
├── @media print
└── @media prefers-*
```

### JavaScript (Modular)

#### `utils.js` (~300 líneas)
Utilidades reutilizables:
- `saveToLocalStorage()` / `loadFromLocalStorage()`
- `debounce()`
- `renderCard()` - genera HTML de tarjeta
- `renderGrid()` - renderiza múltiples tarjetas
- `getCategoryIcon()` - mapeo de iconos
- `escapeHtml()` - prevención de XSS
- `updateResultsCount()` - actualiza contador
- Etc.

#### `gamification.js` (~250 líneas)
Sistema de niveles:
- `getUserProgress()` - lee del localStorage
- `getUserLevel(count)` - calcula nivel
- `markResourceAsVisited()` - registra visita
- `checkLevelUp()` - detecta cambio
- `renderLevelBadge()` - actualiza UI
- `showLevelUpAnimation()` - animación visual

#### `search.js` (~150 líneas)
Búsqueda global:
- `searchResources(query, resources)` - busca
- `applySearch()` - aplica + renderiza
- `initializeSearch()` - setup de listeners
- Debounce integrado

#### `filter.js` (~350 líneas)
Filtrado múltiple:
- `filterByCategories()`
- `filterByTags()`
- `applyFilters()` - combina filtros
- `renderCategoryFilters()` - checkboxes
- `renderTagFilters()` - tags interactivos
- `applyAllFilters()` - combina TODO (búsqueda + filtros)
- Mobile sidebar toggle

#### `app.js` (~400 líneas)
Orquestación principal:
- `loadData()` - fetch JSON
- `initializeApp()` - inicialización
- `setupProposeLink()` - enlace mailto
- `setupModal()` - lógica de modal
- `showResourceDetails()` - renderiza detalles
- Event listeners globales

#### `admin.js` (~400 líneas)
Administración:
- `checkAdminAuth()` - verifica login
- `setupLogin()` - formulario login
- `loadAdminResources()` - carga datos
- `updateDashboardStats()` - estadísticas
- `renderResourcesList()` - lista CRUD
- `loadResourceForEdit()` - carga para editar
- `setupFormSubmit()` - guardar/actualizar
- `deleteResource()` - eliminar
- `setupExportBtn()` - exportar JSON
- `setupImportBtn()` - importar JSON

### Datos (JSON)

#### `resources.json` (estructura)
```json
{
  "categories": [
    {
      "id": "slug",
      "name": "Nombre",
      "description": "...",
      "icon": "emoji|icon-name",
      "color": "#HEX"
    }
  ],
  "tags": [
    {
      "id": "slug",
      "label": "#etiqueta",
      "category": "categoria-id"
    }
  ],
  "resources": [
    {
      "id": "unique-slug",
      "name": "Nombre",
      "category": "id",
      "tags": ["tag1", "tag2"],
      "description": "...",
      "uniqueValueProp": "...",
      "url": "https://...",
      "contact": "email@...",
      "phone": "+34...",
      "location": "Madrid",
      "ageRange": "0-6 años",
      "type": "publica|privada|asociacion|programa",
      "keyServices": ["Servicio1"],
      "verified": true
    }
  ]
}
```

## Ciclo de Vida de Datos

### Escritura (Admin crea/edita)
```
Admin Form Submit
    ↓
Validación básica (required fields)
    ↓
Generar ID único
    ↓
Crear objeto resource
    ↓
adminResources.push() o update
    ↓
saveResourcesToStorage() → localStorage
    ↓
renderResourcesList()
    ↓
updateDashboardStats()
```

### Lectura (Usuario navega)
```
appData loaded from JSON
    ↓
adminResources = JSON.resources
    ↓
User searches/filters
    ↓
Filter engine operates on in-memory array
    ↓
Results rendered immediately (no network delay)
    ↓
User clicks card → markResourceAsVisited()
    ↓
localStorage updated (progreso del usuario)
```

## Performance Optimizations

### 1. **Debounced Search** (300ms)
```javascript
const debouncedSearch = debounce(() => {
  applySearch(query);
}, 300);
```
Reduce CPU load del filtering en cada keystroke.

### 2. **Event Delegation**
```javascript
document.addEventListener('click', (e) => {
  const card = e.target.closest('.resource-card');
});
```
1 listener en document vs. N listeners per tarjeta.

### 3. **In-Memory Operations**
Sin servidor = sin latencia de red.
Todos los datos en RAM del navegador.

### 4. **CSS Variables**
```css
:root {
  --color-primary: #8B4513;
}
```
Fácil de cambiar sin reescribir CSS.

### 5. **Lazy Evaluation**
Calculo de niveles solo cuando necesario.

## Seguridad

### ✅ Implementado
- **XSS Prevention**: `escapeHtml()` en todos los datos
- **Password hashing**: No (contraseña simple en localStorage)
- **No sensitive data**: Solo recursos públicos
- **localStorage isolation**: Mismo dominio solo

### ⚠️ Limitaciones
- **No autenticación real** (localStorage es inseguro)
- **Admin password visible** en código fuente (cambiar en producción)
- **No HTTPS enforcement** (agregar en servidor)

### Para Producción
1. Cambiar contraseña en `pages/admin.html`
2. Usar servidor HTTPS
3. Considerar backend para autenticación real
4. Implementar rate limiting
5. Validar JSON en servidor

## Escalabilidad

### Capacidad Actual
- **Recursos**: 200+ (sin problemas)
- **Tags**: 50+ (óptimo)
- **Usuarios**: 1000+ simultáneos (GitHub Pages gratis)
- **JSON file size**: ~20-50KB (instantáneo)

### Si crece mucho
```
Opción A: Paginar resultados
Opción B: Lazy load más recursos
Opción C: Migrar a backend (Node + DB)
Opción D: Usar Firebase / Supabase
```

## Mejoras Futuras

- [ ] Autenticación OAuth (GitHub, Google)
- [ ] Backend con Node.js + MongoDB
- [ ] API REST para datos
- [ ] Sistema de valoraciones/comentarios
- [ ] Mapas interactivos
- [ ] Exportar como PDF
- [ ] Estadísticas de uso
- [ ] Notificaciones push
- [ ] Modo offline (Service Workers)

---

**Actualizado**: Abril 2026
**Versión**: 1.0
