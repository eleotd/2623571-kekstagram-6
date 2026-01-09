import { uploadImageData } from './api.js';

const uploadForm = document.querySelector('.img-upload__form');
const fileInput = uploadForm.querySelector('.img-upload__input');
const overlay = document.querySelector('.img-upload__overlay');
const closeBtn = overlay.querySelector('.img-upload__cancel');
const submitBtn = uploadForm.querySelector('.img-upload__submit');
const previewImage = overlay.querySelector('.img-upload__preview img');
const effectSliderContainer = document.querySelector('.img-upload__effect-level');
const effectSlider = document.querySelector('.effect-level__slider');
const effectValue = document.querySelector('.effect-level__value');
const effectRadios = document.querySelectorAll('input[name="effect"]');
const hashtagsInput = uploadForm.querySelector('.text__hashtags');
const descriptionInput = uploadForm.querySelector('.text__description');
const scaleValue = document.querySelector('.scale__control--value');
const scaleDown = document.querySelector('.scale__control--smaller');
const scaleUp = document.querySelector('.scale__control--bigger');
const effectsPreviews = document.querySelectorAll('.effects__preview');

const EFFECT_SETTINGS = {
  none: { min: 0, max: 100, step: 1, filter: '', unit: '' },
  chrome: { min: 0, max: 1, step: 0.1, filter: 'grayscale', unit: '' },
  sepia: { min: 0, max: 1, step: 0.1, filter: 'sepia', unit: '' },
  marvin: { min: 0, max: 100, step: 1, filter: 'invert', unit: '%' },
  phobos: { min: 0, max: 3, step: 0.1, filter: 'blur', unit: 'px' },
  heat: { min: 1, max: 3, step: 0.1, filter: 'brightness', unit: '' }
};

let currentEffect = 'none';

const pristine = new Pristine(uploadForm, {
  classTo: 'img-upload__field-wrapper',
  errorClass: 'img-upload__field-wrapper--error',
  successClass: 'img-upload__field-wrapper--success',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextTag: 'div',
  errorTextClass: 'img-upload__error'
});

function showNotification(type) {
  const template = document.querySelector(`#${type}`).content.querySelector(`.${type}`);
  const notification = template.cloneNode(true);

  notification.style.zIndex = '10000';
  document.body.appendChild(notification);

  const closeButton = notification.querySelector(`.${type}__button`);

  function removeNotification() {
    notification.remove();
    document.removeEventListener('keydown', escapeHandler);
  }

  function escapeHandler(event) {
    if (event.key === 'Escape') {
      event.stopPropagation();
      removeNotification();
    }
  }

  document.addEventListener('keydown', escapeHandler);
  closeButton.addEventListener('click', removeNotification);
  notification.addEventListener('click', (event) => {
    if (event.target === notification) {
      removeNotification();
    }
  });
}

function resetFormState() {
  uploadForm.reset();

  const errorElements = document.querySelectorAll('.img-upload__error, .pristine-error');
  errorElements.forEach((el) => el.remove());

  pristine.reset();

  hashtagsInput.value = '';
  descriptionInput.value = '';

  submitBtn.disabled = false;
  submitBtn.textContent = 'Опубликовать';

  previewImage.src = 'img/upload-default-image.jpg';
  previewImage.className = '';
  previewImage.style.filter = '';
  previewImage.style.transform = 'scale(1)';

  effectsPreviews.forEach((preview) => {
    preview.style.backgroundImage = 'url("img/upload-default-image.jpg")';
  });

  scaleValue.value = '100%';

  if (effectSlider.noUiSlider) {
    effectSlider.noUiSlider.set(100);
  }
  effectSliderContainer.classList.add('hidden');

  const noneRadio = document.querySelector('input[name="effect"][value="none"]');
  if (noneRadio) {
    noneRadio.checked = true;
  }
  currentEffect = 'none';

  overlay.classList.add('hidden');
  document.body.classList.remove('modal-open');

  document.removeEventListener('keydown', handleEscapeKey);
}

function handleEscapeKey(event) {
  const isInputFocused = document.activeElement === hashtagsInput ||
                        document.activeElement === descriptionInput;

  const hasNotification = document.querySelector('.success') ||
                          document.querySelector('.error');

  if (event.key === 'Escape') {
    if (hasNotification) {

      event.stopPropagation();
      return;
    }

    if (!isInputFocused) {
      closeFormModal();
    }
  }
}

function closeFormModal() {
  overlay.classList.add('hidden');
  document.body.classList.remove('modal-open');
  resetFormState();
  document.removeEventListener('keydown', handleEscapeKey);
}

function setupScaleControls() {
  const SCALE_STEP = 25;
  const MIN_SCALE = 25;
  const MAX_SCALE = 100;

  let currentScale = 100;

  const updateScale = (newScale) => {
    currentScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale));
    scaleValue.value = `${currentScale}%`;
    previewImage.style.transform = `scale(${currentScale / 100})`;
    return currentScale;
  };

  scaleDown.addEventListener('click', () => {
    updateScale(currentScale - SCALE_STEP);
  });

  scaleUp.addEventListener('click', () => {
    updateScale(currentScale + SCALE_STEP);
  });

  scaleValue.value = '100%';
  previewImage.style.transform = 'scale(1)';
}

function applyEffectToImage(effect, value) {
  previewImage.className = '';
  previewImage.style.filter = '';

  if (effect !== 'none') {
    previewImage.classList.add(`effects__preview--${effect}`);
    const settings = EFFECT_SETTINGS[effect];

    if (settings.filter) {
      const displayValue = value;
      let filterString;

      if (effect === 'chrome' || effect === 'sepia') {
        if (displayValue === 1) {
          filterString = `${settings.filter}(${displayValue})`;
        } else {
          filterString = `${settings.filter}(${displayValue.toFixed(1)})`;
        }
      } else if (effect === 'marvin') {
        filterString = `${settings.filter}(${Math.round(displayValue)}${settings.unit})`;
      } else {
        filterString = `${settings.filter}(${displayValue.toFixed(1)}${settings.unit})`;
      }

      previewImage.style.filter = filterString;
    }
  }
}

function updateEffectSlider(effect) {
  const settings = EFFECT_SETTINGS[effect];

  if (effect === 'none') {
    effectSliderContainer.classList.add('hidden');
    effectValue.value = '';
    previewImage.style.filter = '';
    previewImage.className = '';
  } else {
    effectSliderContainer.classList.remove('hidden');

    effectSlider.noUiSlider.updateOptions({
      range: {
        min: settings.min,
        max: settings.max
      },
      step: settings.step,
      start: settings.max
    });

    effectSlider.noUiSlider.set(settings.max);

    if (effect === 'chrome' || effect === 'sepia') {
      effectValue.value = '1';
    } else if (effect === 'marvin') {
      effectValue.value = '100';
    } else {
      effectValue.value = settings.max.toString();
    }
  }
}

function setupEffectSlider() {
  noUiSlider.create(effectSlider, {
    range: {
      min: 0,
      max: 100
    },
    start: 100,
    step: 1,
    connect: 'lower',
    format: {
      to: function(value) {
        if (Number.isInteger(value)) {
          return value.toFixed(0);
        }
        return value.toFixed(1);
      },
      from: function(value) {
        return parseFloat(value);
      }
    }
  });

  effectSliderContainer.classList.add('hidden');
  const noneRadio = document.querySelector('input[name="effect"][value="none"]');
  if (noneRadio) {
    noneRadio.checked = true;
  }

  effectSlider.noUiSlider.on('update', (values) => {
    const sliderValue = parseFloat(values[0]);

    if (currentEffect === 'chrome' || currentEffect === 'sepia') {
      effectValue.value = sliderValue.toFixed(1);
      applyEffectToImage(currentEffect, sliderValue);
    } else if (currentEffect === 'marvin') {
      effectValue.value = Math.round(sliderValue).toString();
      applyEffectToImage(currentEffect, sliderValue);
    } else if (currentEffect === 'phobos') {
      effectValue.value = sliderValue.toFixed(1);
      applyEffectToImage(currentEffect, sliderValue);
    } else if (currentEffect === 'heat') {
      effectValue.value = sliderValue.toFixed(1);
      applyEffectToImage(currentEffect, sliderValue);
    }
  });
}


function setupFormValidation() {
  pristine.addValidator(
    hashtagsInput,
    (value) => {
      if (value.trim() === '') {
        return true;
      }

      const hashtags = value.trim().split(/\s+/).filter((tag) => tag.length > 0);

      if (hashtags.length > 5) {
        return false;
      }

      const regex = /^#[A-Za-zА-Яа-яёЁ0-9]{1,19}$/;

      for (const tag of hashtags) {
        if (tag === '#') {
          return false;
        }
        if (!regex.test(tag)) {
          return false;
        }
      }

      const lowerTags = hashtags.map((tag) => tag.toLowerCase());
      return new Set(lowerTags).size === hashtags.length;
    },
    'Хэштег должен начинаться с #, содержать буквы и цифры, быть уникальным. Максимум 5 хэштегов.'
  );

  pristine.addValidator(
    descriptionInput,
    (value) => value.length <= 140,
    'Комментарий не может превышать 140 символов'
  );
}

function updateEffectsPreviews(imageUrl) {
  effectsPreviews.forEach((preview) => {
    preview.style.backgroundImage = `url(${imageUrl})`;
  });
}

function initializeForm() {
  fileInput.addEventListener('change', () => {
    const selectedFile = fileInput.files[0];
    if (selectedFile) {
      const imageUrl = URL.createObjectURL(selectedFile);
      previewImage.src = imageUrl;

      scaleValue.value = '100%';
      previewImage.style.transform = 'scale(1)';

      updateEffectsPreviews(imageUrl);

      overlay.classList.remove('hidden');
      document.body.classList.add('modal-open');

      previewImage.onload = () => {
        URL.revokeObjectURL(imageUrl);
      };

      document.addEventListener('keydown', handleEscapeKey);
    }
  });

  closeBtn.addEventListener('click', closeFormModal);

  setupScaleControls();

  setupEffectSlider();

  setupFormValidation();

  effectRadios.forEach((radio) => {
    radio.addEventListener('change', () => {
      const checkedRadio = Array.from(effectRadios).find((r) => r.checked);
      currentEffect = checkedRadio ? checkedRadio.value : 'none';
      updateEffectSlider(currentEffect);

      if (currentEffect !== 'none') {
        const settings = EFFECT_SETTINGS[currentEffect];
        effectSlider.noUiSlider.set(settings.max);

        if (currentEffect === 'chrome' || currentEffect === 'sepia') {
          effectValue.value = '1';
          applyEffectToImage(currentEffect, 1);
        } else if (currentEffect === 'marvin') {
          effectValue.value = '100';
          applyEffectToImage(currentEffect, 100);
        } else if (currentEffect === 'phobos') {
          effectValue.value = '3.0';
          applyEffectToImage(currentEffect, 3);
        } else if (currentEffect === 'heat') {
          effectValue.value = '3.0';
          applyEffectToImage(currentEffect, 3);
        }
      }
    });
  });

  uploadForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const isValid = pristine.validate();
    if (!isValid) {
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправляется...';

    const formData = new FormData(uploadForm);

    try {
      await uploadImageData(formData);

      showNotification('success');
      closeFormModal();

    } catch (error) {
      showNotification('error');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Опубликовать';
    }
  });

  effectsPreviews.forEach((preview) => {
    preview.style.backgroundImage = 'url("img/upload-default-image.jpg")';
  });

  hashtagsInput.disabled = false;
  descriptionInput.disabled = false;
}

export { initializeForm };
