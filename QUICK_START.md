# 🚀 Inicio Rápido - Guía TEA

## 5 Minutos para empezar

### ⚠️ IMPORTANTE: Debes usar un SERVIDOR LOCAL

Por seguridad, los navegadores modernos NO permiten cargar archivos locales con `fetch()`. Tienes 2 opciones:

### Opción 1: Ejecutar Script (Más fácil)

**Mac/Linux:**
```bash
cd /Volumes/Datos/GuiaRecursosTEA
./START_SERVER.sh
```

**Windows (PowerShell):**
```powershell
cd C:\ruta\a\GuiaRecursosTEA
python -m http.server 8000
```

Luego abre en navegador: **http://localhost:8000**

### Opción 2: Servidor Manual (Recomendado)

#### Con Python (Windows/Mac/Linux)
```bash
cd /ruta/a/GuiaRecursosTEA
python -m http.server 8000
```

Luego abre: `http://localhost:8000`

#### Con Node.js
```bash
npm install -g http-server
cd /ruta/a/GuiaRecursosTEA
http-server
```

### Opción 3: GitHub Pages (producción)

1. Sube los archivos a un repositorio GitHub
2. Ve a Configuración → Pages
3. Selecciona rama `main` y carpeta `root`
4. ¡Listo en 1 minuto!

---

## 🔐 Acceso Admin

### Primer Login
- **URL**: `http://localhost:8000/?admin`
- **Contraseña**: `admin`

### ⚠️ IMPORTANTE: Cambiar Contraseña

1. Abre `pages/admin.html`
2. Busca línea: `const ADMIN_PASSWORD = 'admin';`
3. Cámbiala a: `const ADMIN_PASSWORD = 'tu-contraseña-secreta';`
4. Guarda y republica

---

## 📝 Tareas Iniciales

### 1. Actualizar Email de Propuestas
En `index.html`, busca:
```javascript
const email = 'recursos.tea@example.com';
```
Y cámbialo a tu email real.

### 2. Agregar más Recursos
- Ve a `/?admin`
- Haz login con contraseña
- Click en "➕ Nuevo"
- Completa formulario
- Click "💾 Guardar"

### 3. Personalizar Títulos
En `index.html`:
- Línea 1: Cambia título de la pestaña
- Línea 33: Cambia "📚 Guía TEA"

### 4. Cambiar Colores (Opcional)
En `css/styles.css`, variables CSS al inicio:
```css
--color-primary: #8B4513;    /* Marrón chocolate */
--color-secondary: #CD853F;  /* Naranja vintage */
```

---

## 🎯 Características Principales

| Función | Cómo Usar |
|---------|-----------|
| **Buscar** | Escribe en barra principal |
| **Filtrar** | Selecciona categorías/tags en sidebar |
| **Ver Detalles** | Click en tarjeta |
| **Proponer Recurso** | Footer → "¿Falta algún recurso?" |
| **Administrar** | Ve a `/?admin` |
| **Exportar Datos** | Admin → Exportar JSON |

---

## 📊 Datos Incluidos

✅ 20+ recursos verificados en 5 categorías:
- Salud, Diagnóstico y Especialidades
- Educación y Atención Temprana
- Entidades y Apoyo Familiar
- Vida Adulta, Vivienda y Empleo
- Trámites, Ayudas y Beneficios

---

## 🎮 Gamificación

Los usuarios progresan automáticamente:
- **NOVATO** (0-5 recursos visitados) 🌱
- **EXPLORADOR** (6-20 recursos) 🧭
- **EXPERTO** (21+ recursos) 🏆

El nivel se muestra en la esquina superior derecha.

---

## 📱 Responsividad

Automáticamente adaptado para:
- 📱 Móviles (1 columna)
- 📱 Tablets (2 columnas)
- 🖥️ Escritorio (3 columnas)

---

## 🔍 Troubleshooting

### "No carga la web"
✅ Solución: Abre en navegador o usa servidor local

### "No funcionan los filtros"
✅ Solución: Abre `data/resources.json` y verifica JSON válido

### "Perdí los cambios"
✅ Solución: Usa exportar antes de cambios importantes

### "Olvideé contraseña"
✅ Solución: Edita `pages/admin.html` y cambia línea 190

---

## 📚 Documentación Completa

Lee `README.md` para información detallada sobre:
- Arquitectura técnica
- Campos de datos
- Seguridad
- Accesibilidad
- Despliegue en producción

---

## 🚀 Siguientes Pasos

1. ✅ Personaliza email y contraseña
2. ✅ Agrega tus propios recursos
3. ✅ Prueba en mobile
4. ✅ Crea backup de datos
5. ✅ Despliegue en GitHub Pages o servidor

---

**¿Preguntas?** Lee `README.md` o revisa el código (está bien comentado)

**¡Buena suerte! 🌟**
