# ✅ Checklist de Validación - Guía TEA

Verifica que todo funciona correctamente antes de publicar.

## 📁 Archivos Requeridos

- [x] `index.html` - Página principal
- [x] `pages/admin.html` - Panel admin
- [x] `css/styles.css` - Estilos globales
- [x] `css/components.css` - Componentes específicos
- [x] `css/responsive.css` - Media queries
- [x] `js/app.js` - Orquestación principal
- [x] `js/search.js` - Búsqueda global
- [x] `js/filter.js` - Filtrado
- [x] `js/gamification.js` - Sistema de niveles
- [x] `js/utils.js` - Utilidades
- [x] `js/admin.js` - Panel admin
- [x] `data/resources.json` - Base de datos
- [x] `README.md` - Documentación
- [x] `QUICK_START.md` - Inicio rápido
- [x] `ARCHITECTURE.md` - Arquitectura técnica
- [x] `.gitignore` - Exclusiones git

## 🧪 Funcionalidad Principal

### Página Pública (index.html)
- [ ] **Header se carga correctamente**
  - [ ] Logo y tagline visible
  - [ ] Buscador prominente
  - [ ] Badge de nivel en esquina derecha

- [ ] **Búsqueda Global**
  - [ ] Escribe "diagnóstico" → muestra resultados relevantes
  - [ ] Busca por nombre, descripción, servicios
  - [ ] Debounce funciona (no lagea)
  - [ ] Resultados se actualizan en tiempo real

- [ ] **Filtros**
  - [ ] Checkboxes de categorías funcionan
  - [ ] Tags funcionan (alternan on/off)
  - [ ] Múltiples selecciones funcionan simultáneamente
  - [ ] Búsqueda + filtros se combinan correctamente
  - [ ] Botón "Limpiar Filtros" resetea todo

- [ ] **Grid de Tarjetas**
  - [ ] 20+ tarjetas se muestran
  - [ ] Responsive: 1 columna (mobile), 2-3 (desktop)
  - [ ] Click en tarjeta abre modal con detalles
  - [ ] Modal se cierra con X o ESC

- [ ] **Gamificación (Niveles)**
  - [ ] Badge inicial muestra "NOVATO 0/5"
  - [ ] Click en tarjeta → progresa contador
  - [ ] Al alcanzar 6 visitas → animación a "EXPLORADOR"
  - [ ] Al alcanzar 21 visitas → animación a "EXPERTO"
  - [ ] Progreso persiste (recarga la página → sigue igual)

- [ ] **Footer**
  - [ ] "¿Falta algún recurso?" → genera enlace mailto
  - [ ] Enlace abre email predeterminado con template
  - [ ] Enlaces admin visibles

### Panel Admin (pages/admin.html)
- [ ] **Login**
  - [ ] Contraseña correcta ("admin") → entra
  - [ ] Contraseña incorrecta → error
  - [ ] ENTER en campo password → entra

- [ ] **Dashboard**
  - [ ] Muestra estadísticas (total recursos, por categoría)
  - [ ] Botones: Exportar, Backup, Reset

- [ ] **Crear Recurso**
  - [ ] Formulario se ve correctamente
  - [ ] Todos los campos se completan
  - [ ] Submit → guarda en lista y localStorage
  - [ ] Nuevo recurso aparece en "Listar"

- [ ] **Listar/Editar**
  - [ ] Lista de recursos se carga
  - [ ] Búsqueda filtra por nombre
  - [ ] Click "Editar" → carga en formulario
  - [ ] Click "Eliminar" → pide confirmación → elimina
  - [ ] Cambios se guardan en localStorage

- [ ] **Exportar JSON**
  - [ ] Click "Exportar" → descarga archivo JSON
  - [ ] JSON contiene todos los recursos

- [ ] **Importar JSON**
  - [ ] Selecciona archivo JSON
  - [ ] Click "Importar" → carga datos
  - [ ] Nuevos datos aparecen en lista

- [ ] **Logout**
  - [ ] Click "Salir" → vuelve a login

## 🎨 Diseño & Accesibilidad

- [ ] **Tipografía**
  - [ ] Texto principal ≥18px
  - [ ] Fuente serif cálida (Georgia/Garamond)
  - [ ] Legible para personas mayores

- [ ] **Colores (Vintage Retro)**
  - [ ] Fondos crema #D4C4B0
  - [ ] Botones marrón chocolate #8B4513
  - [ ] Acentos naranja/peru #CD853F

- [ ] **Espaciado**
  - [ ] Espacio generoso (24px+) entre elementos
  - [ ] Tarjetas con padding visible
  - [ ] Sidebar no aplastado

- [ ] **Iconos**
  - [ ] Emojis visibles y reconocibles
  - [ ] Planos y simples (no complejos)

- [ ] **Contraste**
  - [ ] Texto oscuro sobre fondo claro
  - [ ] WCAG AA mínimo (4.5:1)
  - [ ] Modo alto contraste soportado

- [ ] **Navegación por Teclado**
  - [ ] TAB navega entre elementos
  - [ ] ENTER activa botones
  - [ ] ESCAPE cierra modales
  - [ ] Links visibles al focus

- [ ] **Responsive**
  - [ ] Mobile (375px): Se ve bien, clickeable
  - [ ] Tablet (768px): Layout óptimo
  - [ ] Desktop (1024px+): 3 columnas completas

## 📊 Datos

- [ ] **JSON Válido**
  - [ ] `data/resources.json` es JSON válido (no comillas mal)
  - [ ] Contiene 20+ recursos

- [ ] **Recursos Completos**
  - [ ] Campos obligatorios presentes (name, id, category)
  - [ ] URLs válidas (http/https)
  - [ ] Emails válidos
  - [ ] Descripciones coherentes

- [ ] **Categorías**
  - [ ] 5 categorías definidas
  - [ ] Cada recurso tiene categoría asignada
  - [ ] Iconos visibles

- [ ] **Etiquetas**
  - [ ] 25+ tags definidas
  - [ ] Recursos tienen tags asignadas
  - [ ] Filtrado por tags funciona

## 🔐 Seguridad & Rendimiento

- [ ] **Sin XSS**
  - [ ] Intenta escribir `<script>` en búsqueda → renderiza como texto
  - [ ] HTML in JSON no se ejecuta

- [ ] **Rendimiento**
  - [ ] Búsqueda responde en <100ms
  - [ ] Filtros no lagean
  - [ ] Renderizado suave

- [ ] **localStorage**
  - [ ] Progreso se guarda
  - [ ] Admin data se persiste
  - [ ] Tamaño <1MB

## 🚀 Despliegue

- [ ] **Local Testing**
  - [ ] Funciona con `python -m http.server`
  - [ ] Funciona al abrir `index.html` directamente

- [ ] **GitHub Pages (si aplica)**
  - [ ] Repositorio creado
  - [ ] Pages activadas
  - [ ] URL funciona

- [ ] **Documentación**
  - [ ] `README.md` completo y claro
  - [ ] `QUICK_START.md` accesible
  - [ ] `ARCHITECTURE.md` detallado

## 🔧 Cambios Previos a Producción

- [ ] **Contraseña Admin**
  - [ ] Cambiar en `pages/admin.html` línea ~190
  - [ ] NO es "admin" en producción

- [ ] **Email de Propuestas**
  - [ ] Actualizar en `index.html` línea ~33
  - [ ] Cambiar `recursos.tea@example.com`

- [ ] **Meta Tags**
  - [ ] `<title>` personalizado
  - [ ] Meta description apropiada

- [ ] **Favicon** (opcional)
  - [ ] Agregar `<link rel="icon">`

- [ ] **Analytics** (opcional)
  - [ ] Google Analytics o similar

## 🐛 Bugs Conocidos & Workarounds

| Problema | Solución |
|----------|----------|
| Admin panel vacío | Recarga la página después de login |
| Filtros no se limpian | Usa botón "Limpiar Filtros" explícitamente |
| localStorage lleno | Limpia caché del navegador |
| Emojis se ven extraños | Actualiza navegador o sistema |

## ✨ Features Bonificación (Opcionales)

- [ ] Agregar más recursos (100+)
- [ ] Implementar categorías personalizadas
- [ ] Agregar imágenes a recursos
- [ ] Sistema de valoraciones (⭐)
- [ ] Exportar a PDF
- [ ] Mapas interactivos (Google Maps API)
- [ ] Estadísticas de uso (Analytics)

---

## 📝 Notas Finales

- **Soportados**: Chrome, Firefox, Safari, Edge (últimas 2 versiones)
- **IE**: No soportado (usar polyfills si es necesario)
- **Accesibilidad**: WCAG 2.1 AA (parcial)
- **Performance**: Carga en <2s (con conexión normal)
- **Storage**: 10MB localStorage disponibles (usamos <1MB)

---

**Checklist actualizado**: Abril 2026
**Versión**: 1.0

Después de completar este checklist, ¡la plataforma está lista para producción! 🎉
