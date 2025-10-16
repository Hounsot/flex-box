import './style.css'

const DESIGN_WIDTH = 1440;
const MIN_SCALE_BREAKPOINT = 768; // start scaling at >= 768px viewport width

function supportsZoomProperty(){
  // Not standardized, but widely supported in Chromium-based & Safari; return boolean
  const testEl = document.createElement('div');
  return 'zoom' in testEl.style;
}

function applyScale(scale){
  const container = document.getElementById('scale-container');
  if(!container) return;

  // Prefer native zoom when available for crisper text rendering
  if (supportsZoomProperty()) {
    container.style.zoom = String(scale);
    container.style.transform = '';
    container.style.width = `${DESIGN_WIDTH}px`;
    container.style.marginLeft = 'auto';
    container.style.marginRight = 'auto';
  } else {
    // Fallback to CSS transform scale with left-center origin and translate to center
    container.style.zoom = '';
    container.style.transform = `scale(${scale})`;
    container.style.transformOrigin = 'top left';
    // When using transform, the visual width is DESIGN_WIDTH * scale; center it
    const viewportWidth = window.innerWidth;
    const visualWidth = DESIGN_WIDTH * scale;
    const leftOffset = Math.max(0, (viewportWidth - visualWidth) / 2);
    container.style.marginLeft = `${leftOffset}px`;
    container.style.marginRight = '0px';
    container.style.width = `${DESIGN_WIDTH}px`;
  }
}

function updateScale(){
  const viewportWidth = window.innerWidth;
  const container = document.getElementById('scale-container');
  const wrapper = document.getElementById('scale-wrapper');
  if(!container || !wrapper) return;

  if (viewportWidth >= MIN_SCALE_BREAKPOINT) {
    const scale = Math.max(viewportWidth / DESIGN_WIDTH, 0.01); // avoid 0
    applyScale(scale);
    wrapper.style.overflowX = 'hidden';
  } else {
    // Below 768px: disable scaling and allow your mobile styles to handle layout
    container.style.zoom = '';
    container.style.transform = '';
    container.style.marginLeft = 'auto';
    container.style.marginRight = 'auto';
    container.style.width = '100%';
  }
}

// Initialize and listen for resize/zoom changes
window.addEventListener('resize', updateScale);
window.addEventListener('orientationchange', updateScale);
document.addEventListener('DOMContentLoaded', updateScale);
updateScale();