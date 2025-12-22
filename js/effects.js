const effectsContainer = document.querySelector('.img-upload__effects');
const effectLevelContainer = document.querySelector('.img-upload__effect-level');
const effectLevelSlider = effectLevelContainer.querySelector('.effect-level__slider');
const effectLevelValue = effectLevelContainer.querySelector('.effect-level__value');
const previewImage = document.querySelector('.img-upload__preview img');

const EFFECTS = {
  none: {
    min: 0,
    max: 100,
    step: 1,
    filter: '',
    unit: ''
  },
  chrome: {
    min: 0,
    max: 1,
    step: 0.1,
    filter: 'grayscale',
    unit: ''
  },
  sepia: {
    min: 0,
    max: 1,
    step: 0.1,
    filter: 'sepia',
    unit: ''
  },
  marvin: {
    min: 0,
    max: 100,
    step: 1,
    filter: 'invert',
    unit: '%'
  },
  phobos: {
    min: 0,
    max: 3,
    step: 0.1,
    filter: 'blur',
    unit: 'px'
  },
  heat: {
    min: 1,
    max: 3,
    step: 0.1,
    filter: 'brightness',
    unit: ''
  }
};

let currentEffect = 'none';

noUiSlider.create(effectLevelSlider, {
  range: {
    min: 0,
    max: 100
  },
  start: 100,
  step: 1,
  connect: 'lower',
  format: {
    to: function (value) {
      if (Number.isInteger(value)) {
        return value.toFixed(0);
      }
      return value.toFixed(1);
    },
    from: function (value) {
      return parseFloat(value);
    }
  }
});

const updateSlider = () => {
  const effect = EFFECTS[currentEffect];

  effectLevelSlider.noUiSlider.updateOptions({
    range: {
      min: effect.min,
      max: effect.max
    },
    step: effect.step,
    start: effect.max
  });
};

const updateEffect = () => {
  const sliderValue = effectLevelSlider.noUiSlider.get();
  const numericValue = parseFloat(sliderValue);
  effectLevelValue.value = numericValue;

  if (currentEffect === 'none') {
    previewImage.style.filter = 'none';
    return;
  }

  const effect = EFFECTS[currentEffect];
  previewImage.style.filter = `${effect.filter}(${numericValue}${effect.unit})`;
};

const onEffectsChange = (evt) => {
  if (evt.target.type === 'radio') {
    currentEffect = evt.target.value;
    previewImage.className = '';
    previewImage.classList.add(`effects__preview--${currentEffect}`);

    if (currentEffect === 'none') {
      effectLevelContainer.classList.add('hidden');
      previewImage.style.filter = 'none';
    } else {
      effectLevelContainer.classList.remove('hidden');
      updateSlider();
      effectLevelSlider.noUiSlider.set(EFFECTS[currentEffect].max);
      updateEffect();
    }
  }
};

const resetEffects = () => {
  currentEffect = 'none';
  previewImage.className = '';
  previewImage.style.filter = 'none';
  effectLevelContainer.classList.add('hidden');
  const noneEffect = effectsContainer.querySelector('#effect-none');
  if (noneEffect) {
    noneEffect.checked = true;
  }
  effectLevelSlider.noUiSlider.set(100);
  effectLevelValue.value = 100;
};

const initEffects = () => {
  effectLevelContainer.classList.add('hidden');
  effectsContainer.addEventListener('change', onEffectsChange);
  effectLevelSlider.noUiSlider.on('update', updateEffect);
  resetEffects();
};

export { initEffects, resetEffects };
