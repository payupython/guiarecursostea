/* ============================================
   GAMIFICATION - Sistema de Niveles
   ============================================ */

const GAMIFICATION_KEY = 'tea-user-progress';
const LEVEL_THRESHOLDS = {
  novato: { min: 0, max: 5, icon: '🌱', color: '#A68B6B', displayName: 'NOVATO' },
  explorador: { min: 6, max: 20, icon: '🧭', color: '#CD853F', displayName: 'EXPLORADOR' },
  experto: { min: 21, max: Infinity, icon: '🏆', color: '#8B4513', displayName: 'EXPERTO' }
};

// OBTENER PROGRESO DEL USUARIO
function getUserProgress() {
  let progress = loadFromLocalStorage(GAMIFICATION_KEY);

  if (!progress) {
    progress = {
      visitedResources: [],
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      totalVisits: 0
    };
    saveUserProgress(progress);
  }

  return progress;
}

// GUARDAR PROGRESO
function saveUserProgress(progress) {
  progress.lastUpdated = new Date().toISOString();
  saveToLocalStorage(GAMIFICATION_KEY, progress);
}

// OBTENER NIVEL ACTUAL
function getUserLevel(visitedCount = null) {
  if (visitedCount === null) {
    const progress = getUserProgress();
    visitedCount = progress.visitedResources.length;
  }

  for (const [key, level] of Object.entries(LEVEL_THRESHOLDS)) {
    if (visitedCount >= level.min && visitedCount <= level.max) {
      return key;
    }
  }

  return 'novato';
}

// MARCAR RECURSO COMO VISITADO
function markResourceAsVisited(resourceId) {
  const progress = getUserProgress();

  // Evitar duplicados
  if (!progress.visitedResources.includes(resourceId)) {
    progress.visitedResources.push(resourceId);
    progress.totalVisits++;
    saveUserProgress(progress);

    return {
      isNewResource: true,
      newLevel: checkLevelUp(progress.visitedResources.length)
    };
  }

  return {
    isNewResource: false,
    newLevel: null
  };
}

// VERIFICAR CAMBIO DE NIVEL
function checkLevelUp(visitedCount) {
  const previousLevel = visitedCount === 1 ? 'novato' : getUserLevel(visitedCount - 1);
  const currentLevel = getUserLevel(visitedCount);

  if (previousLevel !== currentLevel) {
    return currentLevel;
  }

  return null;
}

// OBTENER DATOS DE PROGRESO
function getProgressData() {
  const progress = getUserProgress();
  const currentLevel = getUserLevel(progress.visitedResources.length);
  const levelInfo = LEVEL_THRESHOLDS[currentLevel];
  const visitedCount = progress.visitedResources.length;
  const nextThreshold = levelInfo.max === Infinity ? '∞' : levelInfo.max;

  return {
    visitedCount,
    currentLevel,
    levelInfo,
    nextThreshold,
    progress: calculateProgressPercentage(visitedCount, currentLevel)
  };
}

// CALCULAR PORCENTAJE DE PROGRESO
function calculateProgressPercentage(visitedCount, level) {
  const levelInfo = LEVEL_THRESHOLDS[level];
  const rangeSize = levelInfo.max - levelInfo.min;
  const progressInRange = visitedCount - levelInfo.min;

  if (rangeSize === Infinity) {
    return Math.min((progressInRange / 10) * 100, 100);
  }

  return Math.min((progressInRange / rangeSize) * 100, 100);
}

// RENDERIZAR BADGE DE NIVEL
function renderLevelBadge() {
  const badge = document.getElementById('levelBadge');
  if (!badge) return;

  const data = getProgressData();
  const levelInfo = data.levelInfo;

  badge.innerHTML = `
    <div class="level-icon">${levelInfo.icon}</div>
    <div class="level-info">
      <div class="level-name">${levelInfo.displayName}</div>
      <div class="level-count"><span id="visitedCount">${data.visitedCount}</span>/${data.nextThreshold}</div>
    </div>
  `;

  // Actualizar color del badge
  badge.style.borderColor = levelInfo.color;
}

// MOSTRAR ANIMACIÓN DE LEVEL UP
function showLevelUpAnimation(newLevel) {
  const levelInfo = LEVEL_THRESHOLDS[newLevel];

  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(61, 40, 23, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
    animation: fadeIn 0.3s ease;
  `;

  const content = document.createElement('div');
  content.style.cssText = `
    background: var(--bg-primary);
    border: 3px solid ${levelInfo.color};
    border-radius: 12px;
    padding: 48px;
    text-align: center;
    box-shadow: 0 10px 40px rgba(61, 40, 23, 0.4);
    animation: levelUp 0.6s ease;
  `;

  content.innerHTML = `
    <div style="font-size: 64px; margin-bottom: 16px;">${levelInfo.icon}</div>
    <h2 style="color: #8B4513; font-size: 28px; margin-bottom: 8px;">¡FELICITACIONES!</h2>
    <p style="color: #5C4033; font-size: 18px; margin-bottom: 24px;">
      Has alcanzado el nivel<br><strong>${levelInfo.displayName}</strong>
    </p>
    <p style="color: #8B7355; font-size: 14px;">Sigue explorando el ecosistema TEA</p>
  `;

  overlay.appendChild(content);
  document.body.appendChild(overlay);

  setTimeout(() => {
    overlay.style.animation = 'fadeOut 0.3s ease';
    setTimeout(() => overlay.remove(), 300);
  }, 3000);
}

// INICIALIZAR GAMIFICACIÓN
function initializeGamification() {
  renderLevelBadge();

  // Agregar event listeners a las tarjetas
  document.addEventListener('click', (e) => {
    const card = e.target.closest('.resource-card');
    if (card) {
      const resourceId = card.dataset.resourceId;
      if (resourceId) {
        const result = markResourceAsVisited(resourceId);

        if (result.isNewResource) {
          renderLevelBadge();

          if (result.newLevel) {
            showLevelUpAnimation(result.newLevel);
          }
        }
      }
    }
  });

  console.log('✅ Gamificación inicializada');
}

// RESETEAR PROGRESO (para testing)
function resetProgress() {
  localStorage.removeItem(GAMIFICATION_KEY);
  renderLevelBadge();
  showNotification('Progreso reiniciado', 'info');
}

// EXPORTAR PROGRESO COMO JSON
function exportProgress() {
  const progress = getUserProgress();
  const data = getProgressData();

  const export_data = {
    ...data,
    progress: progress,
    exportedAt: new Date().toISOString()
  };

  return JSON.stringify(export_data, null, 2);
}

console.log('✅ Gamification cargado');
