import { uploadImageData } from './api.js';

const uploadForm = document.querySelector('.img-upload__form');
const fileInput = uploadForm.querySelector('.img-upload__input');
const overlay = document.querySelector('.img-upload__overlay');
const closeBtn = overlay.querySelector('.img-upload__cancel');
const submitBtn = uploadForm.querySelector('.img-upload__submit');
const previewImage = overlay.querySelector('.img-upload__preview img');
const effectSlider = document.querySelector('.effect-level__slider');
const effectValue = document.querySelector('.effect-level__value');
const effectRadios = document.querySelectorAll('input[name="effect"]');
const hashtagsInput = uploadForm.querySelector('.text__hashtags');
const descriptionInput = uploadForm.querySelector('.text__description');
const scaleValue = document.querySelector('.scale__control--value');
const scaleDown = document.querySelector('.scale__control--smaller');
const scaleUp = document.querySelector('.scale__control--bigger');

let currentEffect = 'none';
const formValidator = new Pristine(uploadForm);

function showNotification(type) {
  const template = document.querySelector(`#${type}`).content.querySelector(`.${type}`);
  const notification = template.cloneNode(true);
  document.body.appendChild(notification);

  const closeButton = notification.querySelector(`.${type}__button`);

  function removeNotification() {
    notification.remove();
    document.removeEventListener('keydown', escapeHandler);
  }

  function escapeHandler(event) {
    if (event.key === 'Escape') {
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
  previewImage.src = '';
  hashtagsInput.value = '';
  descriptionInput.value = '';
  fileInput.value = '';
  submitBtn.disabled = false;
  submitBtn.textContent = 'Опубликовать';

  scaleValue.value = '100%';
  previewImage.style.transform = 'scale(1)';

  effectSlider.noUiSlider.set(100);
  effectSlider.classList.add('hidden');
  document.querySelector('input[name="effect"][value="none"]').checked = true;
  previewImage.className = '';
  previewImage.style.filter = '';
  currentEffect = 'none';

  overlay.classList.add('hidden');
  document.body.classList.remove('modal-open');
}

function handleEscapeKey(event) {
  const isInputFocused = document.activeElement === hashtagsInput ||
                        document.activeElement === descriptionInput;
  if (event.key === 'Escape' && !isInputFocused) {
    resetFormState();
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

  function updateScale(scale) {
    const clampedScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale));
    scaleValue.value = `${clampedScale}%`;
    previewImage.style.transform = `scale(${clampedScale / 100})`;
  }

  scaleDown.addEventListener('click', () => {
    const currentScale = parseInt(scaleValue.value, 10) - SCALE_STEP;
    updateScale(currentScale);
  });

  scaleUp.addEventListener('click', () => {
    const currentScale = parseInt(scaleValue.value, 10) + SCALE_STEP;
    updateScale(currentScale);
  });

  updateScale(100);
}

function applyEffectToImage(effect, intensity) {
  previewImage.className = '';
  previewImage.style.filter = '';

  if (effect !== 'none') {
    previewImage.classList.add(`effects__preview--${effect}`);

    const effectsMap = {
      chrome: `grayscale(${intensity / 100})`,
      sepia: `sepia(${intensity / 100})`,
      marvin: `invert(${intensity}%)`,
      phobos: `blur(${(intensity / 100) * 3}px)`,
      heat: `brightness(${1 + (intensity / 100) * 2})`
    };

    if (effectsMap[effect]) {
      previewImage.style.filter = effectsMap[effect];
    }
  }
}

function updateEffectSlider(effect) {
  if (effect === 'none') {
    effectSlider.classList.add('hidden');
    effectValue.value = '';
    previewImage.style.filter = '';
    previewImage.className = '';
  } else {
    effectSlider.classList.remove('hidden');
    effectSlider.noUiSlider.updateOptions({
      range: { min: 0, max: 100 },
      start: 100,
    });
    effectValue.value = 100;
  }
}

function getEffectSettings() {
  const selectedEffect = (() => {
    const checkedRadio = Array.from(effectRadios).find((radio) => radio.checked);
    return checkedRadio ? checkedRadio.value : 'none';
  })();
  const intensity = effectSlider.noUiSlider ? effectSlider.noUiSlider.get() : 100;

  return {
    effect: selectedEffect,
    intensity: selectedEffect === 'none' ? null : intensity
  };
}

function setupFormValidation() {
  formValidator.addValidator(
    hashtagsInput,
    (value) => {
      const hashtags = value.trim().toLowerCase().split(' ').filter((tag) => tag);
      const hashtagRegex = /^#[a-zа-яё0-9]{1,19}$/;
      const uniqueHashtags = new Set(hashtags);

      return hashtags.every((tag) => hashtagRegex.test(tag)) &&
             hashtags.length <= 5 &&
             hashtags.length === uniqueHashtags.size;
    },
    'Хэштег должен начинаться с #, содержать буквы/цифры, быть уникальным. Максимум 5 хэштегов.'
  );

  formValidator.addValidator(
    descriptionInput,
    (value) => value.length <= 140,
    'Комментарий не может превышать 140 символов'
  );
}

function initializeForm(photosArray, renderFunction) {
  fileInput.addEventListener('change', () => {
    const selectedFile = fileInput.files[0];
    if (selectedFile) {
      const imageUrl = URL.createObjectURL(selectedFile);
      previewImage.src = imageUrl;

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

  noUiSlider.create(effectSlider, {
    range: { min: 0, max: 100 },
    start: 100,
    step: 1,
    connect: 'lower',
  });

  effectSlider.classList.add('hidden');
  document.querySelector('input[name="effect"][value="none"]').checked = true;

  setupFormValidation();

  effectRadios.forEach((radio) => {
    radio.addEventListener('change', (event) => {
      currentEffect = event.target.value;
      updateEffectSlider(currentEffect);
      applyEffectToImage(currentEffect, effectSlider.noUiSlider.get());
    });
  });

  effectSlider.noUiSlider.on('update', (values) => {
    const value = Math.round(values[0]);
    effectValue.value = value;
    applyEffectToImage(currentEffect, value);
  });

  uploadForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!formValidator.validate()) {
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправляется...';

    const formData = new FormData(uploadForm);

    try {
      await uploadImageData(formData);
      showNotification('success');

      const currentEffectSettings = getEffectSettings();
      const newImageUrl = URL.createObjectURL(fileInput.files[0]);

      const newImage = {
        id: photosArray.length + 1,
        url: newImageUrl,
        description: descriptionInput.value,
        likes: 0,
        comments: [],
        effect: currentEffectSettings.effect,
        intensity: currentEffectSettings.intensity,
      };

      photosArray.push(newImage);
      renderFunction([newImage]);

      resetFormState();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Ошибка при отправке:', error);
      showNotification('error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Опубликовать';
    }
  });
}

export { initializeForm };
