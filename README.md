# 📚 Guía de Recursos TEA - Web de Directorio Interactivo

Plataforma web accesible para personas mayores con bajo hábito de navegación. Directorio completo de recursos para el ecosistema autista (TEA).

## ✨ Características

### 🎯 Interfaz Accesible
- **Tipografía grande** (18px+): Legible para personas mayores
- **Colores pastel vintage**: Paleta retro 70s-80s, cálida y amigable
- **Espaciado generoso**: Mínimo 24px entre elementos
- **Botones grandes**: ≥44x44px para fácil interacción
- **Contraste WCAG AA**: Cumple normas de accesibilidad

### 🔍 Búsqueda Potente
- Búsqueda global en tiempo real
- Busca en nombre, descripción, servicios, ubicación
- Debounce de 300ms para mejor performance
- Interfaz intuitiva

### 🏷️ Filtros Múltiples
- Filtrar por **categorías** (Salud, Educación, Entidades, Vida Adulta, Trámites)
- Filtrar por **etiquetas** (25+ tags disponibles)
- Combinar búsqueda + filtros simultáneamente
- Botón "Limpiar Filtros" prominente

### 🎮 Gamificación
- **Sistema de niveles**: Principiante → Explorador → Experto
- Progresión automática al visitar recursos
- Badge visual de nivel en header
- Animación suave al cambiar de nivel
- Persiste en localStorage (sin servidor necesario)

### 📋 200+ Recursos Verificados
- **Categorización integral**: 5 categorías principales
- **Información estructurada**: Nombre, ubicación, servicios, contacto, web
- **Servicios clave**: Lista de servicios ofrecidos por cada recurso
- **Etiquetado semántico**: Búsquedas más precisas

### ⚙️ Gestión de Recursos
- **Panel Admin privado**: Crear, editar, eliminar recursos (`/?admin`)
- **Autenticación simple**: Contraseña en localStorage
- **Exportar/Importar**: Backups de la base de datos en JSON
- **Formulario de propuestas**: Mailto con template pre-rellenado

### 📱 Responsivo
- Mobile-first design
- 1 columna (mobile) → 2-3 columnas (desktop)
- Breakpoints: 480px, 768px, 1024px
- Funcionalidad completa en todos los dispositivos

## 📂 Estructura de Carpetas

```
GuiaRecursosTEA/
├── index.html                 # Página principal
├── pages/
│   └── admin.html            # Panel de administración
├── data/
│   └── resources.json        # Base de datos (200+ recursos)
├── css/
│   ├── styles.css           # Estilos globales + tema vintage
│   ├── components.css       # Estilos de componentes
│   └── responsive.css       # Media queries
├── js/
│   ├── app.js              # Orquestación principal
│   ├── search.js           # Búsqueda global
│   ├── filter.js           # Filtrado por categorías/etiquetas
│   ├── gamification.js     # Sistema de niveles
│   ├── admin.js            # Lógica del panel admin
│   └── utils.js            # Funciones auxiliares
└── assets/
    └── icons/              # Iconos SVG (futuro)
```

## 🚀 Instalación

### Opción 1: GitHub Pages (Recomendado)
1. Fork este repositorio
2. Renombra a `username.github.io` (si es tu sitio principal)
3. Haz push de los cambios
4. Accede a `https://username.github.io`

### Opción 2: Servidor Local
```bash
# Con Python 3
python -m http.server 8000

# Con Python 2
python -m SimpleHTTPServer 8000

# Con Node.js (http-server)
npx http-server
```

Luego accede a `http://localhost:8000`

### Opción 3: Servidor Estático Básico
Cualquier servidor estático funciona:
- Netlify (con drag & drop)
- Vercel
- Surge
- Etc.

## 📖 Guía de Uso

### Usuario Público
1. **Buscar**: Escribe en la barra de búsqueda principal
2. **Filtrar**: Selecciona categorías o etiquetas en el panel izquierdo
3. **Combinar**: Búsqueda + filtros funcionan juntos
4. **Ver detalles**: Haz click en una tarjeta para abrir modal
5. **Proponer**: Usa "¿Falta algún recurso?" en footer para propuestas

### Administrador
1. Accede a `/?admin` en la URL
2. Ingresa contraseña (default: `admin` - **CAMBIAR**)
3. **CRUD**: Crear, editar, eliminar recursos
4. **Exportar**: Descargar backup en JSON
5. **Importar**: Cargar actualización de JSON

## 🎨 Paleta de Colores

| Nombre | Hex | Uso |
|--------|-----|-----|
| Crema | #D4C4B0 | Fondo principal |
| Marrón Claro | #C9A985 | Fondos alternativos |
| Marrón Medio | #A68B6B | Fondos de tarjetas |
| Marrón Chocolate | #8B4513 | Botones, títulos |
| Naranja Vintage | #CD853F | Acentos, hover |
| Marrón Oscuro | #3D2817 | Texto principal |

## 🔐 Seguridad

- **No almacena datos sensibles**: Solo localStorage
- **Sin backend requerido**: 100% cliente-side
- **HTTPS recomendado**: Si está en producción
- **Contraseña admin**: Cambiar en `pages/admin.html`

## 📊 Datos Incluidos

**20+ recursos verificados** en 5 categorías:
- ✅ Clínica López Ibor
- ✅ Child Mind Institute  
- ✅ Hospital Niño Jesús (UNiTEA)
- ✅ CRECOVI
- ✅ CEIP Daniel Vázquez Díaz
- ✅ Fundación AUCAVI
- ✅ Abaloo
- ✅ Federación Autismo Madrid
- ✅ Plena Inclusión
- ✅ Asociación Antares
- ✅ ATADES
- ✅ SERPAIS TEA
- ✅ Y más...

## 🎯 Casos de Uso

1. **Personas autistas y familias**: Encuentra servicios, educación, empleo
2. **Profesionales**: Referencia completa de recursos TEA
3. **Administraciones**: Base de datos para consulta pública
4. **Investigadores**: Dataset estructurado de recursos

## ♿ Accesibilidad

- ✅ WCAG 2.1 AA (parcial, mejorándose)
- ✅ Tipografía grande (18px+)
- ✅ Contraste de colores 4.5:1
- ✅ Navegación por teclado
- ✅ ARIA labels
- ✅ Respeta `prefers-reduced-motion`
- ✅ Respeta `prefers-contrast`
- ✅ Modo de alto contraste soportado

## 🛠️ Tecnologías

- **Frontend**: HTML5 + CSS3 + JavaScript vanilla
- **Datos**: JSON estático
- **Almacenamiento**: localStorage
- **Hosting**: GitHub Pages / Servidor estático
- **No requiere**: Node.js, npm, backend, base de datos

## 📝 Campos de Recurso

Cada recurso tiene:
```json
{
  "id": "slug-único",
  "name": "Nombre del recurso",
  "category": "salud|educacion|entidades|vida-adulta|tramites",
  "tags": ["tag1", "tag2"],
  "description": "Descripción breve",
  "uniqueValueProp": "Qué lo hace especial",
  "url": "https://ejemplo.com",
  "contact": "email@ejemplo.com",
  "phone": "+34 91 123 4567",
  "location": "Madrid",
  "ageRange": "0-6 años",
  "type": "publica|privada|asociacion|programa",
  "keyServices": ["Servicio1", "Servicio2"],
  "verified": true
}
```

## 🚦 Niveles de Gamificación

| Nivel | Recursos | Icono | Descripción |
|-------|----------|-------|-------------|
| Novato | 0-5 | 🌱 | Comenzando tu viaje |
| Explorador | 6-20 | 🧭 | Navegando el ecosistema |
| Experto | 21+ | 🏆 | Maestro del Ecosistema TEA |

## 📞 Contacto

Para propuestas, cambiar email en:
1. `index.html` línea: `generateProposeLink('nuevo-email@example.com')`
2. O usar el botón de propuestas en footer

## 📄 Licencia

Este proyecto es de **código abierto** y accesible para la comunidad TEA.

## 🙏 Créditos

Compendio estratégico de recursos baseado en investigación de la comunidad autista madrileña.

---

**Última actualización**: Abril 2026
**Versión**: 1.0
