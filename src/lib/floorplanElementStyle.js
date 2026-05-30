const STYLE_DEFAULTS = {
  'fixed-shelf': {
    fillColor: '#7c3aed',
    strokeColor: '#5b21b6',
    textColor: '#ffffff',
    textSize: 2.4,
  },
  'temp-shelf': {
    fillColor: '#a78bfa',
    strokeColor: '#7c3aed',
    textColor: '#ffffff',
    textSize: 2.4,
  },
  checkout: {
    fillColor: '#5b21b6',
    strokeColor: '#4c1d95',
    textColor: '#ffffff',
    textSize: 2.4,
    label: 'CHECKOUT',
  },
  entrance: {
    fillColor: '#dcfce7',
    strokeColor: '#16a34a',
    textColor: '#15803d',
    textSize: 3,
    label: 'Entrance',
  },
  exit: {
    fillColor: '#fee2e2',
    strokeColor: '#dc2626',
    textColor: '#b91c1c',
    textSize: 3,
    label: 'Exit',
  },
}

export function isStyleable(type) {
  return type in STYLE_DEFAULTS
}

export function getDefaultStyleForType(type) {
  return STYLE_DEFAULTS[type] ? { ...STYLE_DEFAULTS[type] } : null
}

/** Label with a default when the field is empty (e.g. after clearing it in the panel). */
export function resolveElementLabel(el) {
  const def = STYLE_DEFAULTS[el.type]
  const raw = typeof el.label === 'string' ? el.label.trim() : ''
  if (def?.label) return raw || def.label
  return raw
}

export function normalizeStyleFields(el) {
  if (!isStyleable(el.type)) return el
  const def = STYLE_DEFAULTS[el.type]
  const textSize = el.textSize != null ? clampTextSize(el.textSize) : def.textSize
  return {
    ...el,
    fillColor: sanitizeColor(el.fillColor, def.fillColor),
    strokeColor: sanitizeColor(el.strokeColor, def.strokeColor),
    textColor: sanitizeColor(el.textColor, def.textColor),
    textSize,
    label: resolveElementLabel(el),
  }
}

export function getElementStyle(el) {
  const def = STYLE_DEFAULTS[el.type]
  if (!def) return {}
  return {
    fillColor: sanitizeColor(el.fillColor, def.fillColor),
    strokeColor: sanitizeColor(el.strokeColor, def.strokeColor),
    accentColor: def.accentColor,
    shelfLineColor: def.shelfLineColor,
    screenColor: def.screenColor,
    textColor: sanitizeColor(el.textColor, def.textColor),
    textSize: el.textSize != null ? clampTextSize(el.textSize) : def.textSize,
  }
}

export function clampTextSize(n) {
  const v = Number(n)
  if (Number.isNaN(v)) return 2.2
  return Math.round(Math.max(1, Math.min(6, v)) * 10) / 10
}

function sanitizeColor(value, fallback) {
  if (typeof value !== 'string') return fallback
  const v = value.trim()
  if (/^#[0-9A-Fa-f]{6}$/.test(v)) return v
  if (/^#[0-9A-Fa-f]{3}$/.test(v)) {
    return `#${v[1]}${v[1]}${v[2]}${v[2]}${v[3]}${v[3]}`
  }
  return fallback
}
