const tubeElement = document.getElementById('tube');
const fire1Element = document.getElementById('fire-1');
const fire2Element = document.getElementById('fire-2');
const sparkles = document.getElementById('sparkles');
const elements = [tubeElement, fire1Element, fire2Element, sparkles];
const degreeOffsets = [0, 180, 180, 80];

// Load animations =============================================================

const tubeAnimationSpeed = 0.3;

const initAnimation = async (url, id, options) => {
  const raw = await fetch(url);
  const animationData = await raw.json();
  return lottie.loadAnimation({
    animationData,
    container: document.getElementById(id),
    renderer: 'svg',
    ...options
  });
};

let tubeAnimationPosition = 0;
let tubeAnimation;

(async () => {

  // Load tube animation
  tubeAnimation = await initAnimation('https://assets1.lottiefiles.com/packages/lf20_1dobopck.json', 'tube', { loop: false, autoplay: false });
  
  // Load sparkles animation
  const sparklesAnimation = await initAnimation('https://assets2.lottiefiles.com/packages/lf20_nwfrjcrb.json', 'sparkles');
  sparklesAnimation.setSpeed(3);
  
  // Load fire animations
  for (const id of ['fire-1', 'fire-2']) {
    const fireAnimation = await initAnimation('https://assets7.lottiefiles.com/packages/lf20_uzCbcN.json', id);
    fireAnimation.setSpeed(1 - 0.1 * (Math.random() + Math.random()))
  }
})();

// Mouse events ================================================================

let isMousedown = false;
let mousePositionY;

document.addEventListener('mouseup', () => { 
  isMousedown = false 
});

document.addEventListener('mousedown', (e) => { 
  isMousedown = true;
  mousePositionY = e.y;
});

document.addEventListener('mousemove', (e) => {
  if (isMousedown) {
    
    // Calculate mouse dY
    const dY = tubeAnimationSpeed * (mousePositionY - e.y);
    mousePositionY = e.y;

    // Update animation position
    tubeAnimationPosition += dY;
    tubeAnimationPosition = Math.min(tubeAnimationPosition, tubeAnimation.getDuration(true));
    tubeAnimationPosition = Math.max(tubeAnimationPosition, 0);
    tubeAnimation.goToAndStop(tubeAnimationPosition, true);
  
    // Update color inversion
    const percent = tubeAnimationPosition / tubeAnimation.getDuration(true);
    const degrees = 270 * percent;
    setColors(degrees);
  }
});

// Color rotations =============================================================

const setColors = (degrees) => {
  for (let i = 0; i < elements.length; i++) {
    elements[i].style.filter = `hue-rotate(-${degrees + degreeOffsets[i]}deg)`;
  }
};
setColors(0);
