function restoreFormDefaults() {
  const form = document.querySelector('.img-upload__form');
  const fileField = form.querySelector('.img-upload__input');
  const hashtagsField = form.querySelector('.text__hashtags');
  const descriptionField = form.querySelector('.text__description');
  const modal = document.querySelector('.img-upload__overlay');
  const preview = modal.querySelector('.img-upload__preview img');
  const sliderContainer = document.querySelector('.img-upload__effect-level');
  const scaleField = document.querySelector('.scale__control--value');
  const submitButton = form.querySelector('.img-upload__submit');
  const effectsPreviews = document.querySelectorAll('.effects__preview');

  form.reset();

  preview.src = 'img/upload-default-image.jpg';
  // eslint-disable-next-line no-shadow
  effectsPreviews.forEach((preview) => {
    preview.style.backgroundImage = 'url("img/upload-default-image.jpg")';
  });

  hashtagsField.value = '';
  descriptionField.value = '';
  fileField.value = '';

  submitButton.disabled = false;
  submitButton.textContent = 'Опубликовать';

  scaleField.value = '100%';
  preview.style.transform = 'scale(1)';

  sliderContainer.classList.add('hidden');
  const noneEffectRadio = document.querySelector('input[name="effect"][value="none"]');
  if (noneEffectRadio) {
    noneEffectRadio.checked = true;
  }

  preview.className = '';
  preview.style.filter = '';

  modal.classList.add('hidden');
  document.body.classList.remove('modal-open');

  hashtagsField.disabled = false;
  descriptionField.disabled = false;
}

function displaySystemMessage(messageType) {
  const template = document.querySelector(`#${messageType}`).content.querySelector(`.${messageType}`);
  const messageElement = template.cloneNode(true);
  document.body.appendChild(messageElement);

  const closeBtn = messageElement.querySelector(`.${messageType}__button`);

  function removeMessage() {
    messageElement.remove();
    document.removeEventListener('keydown', escapeHandler);
  }

  function escapeHandler(event) {
    if (event.key === 'Escape') {
      removeMessage();
    }
  }

  document.addEventListener('keydown', escapeHandler);
  closeBtn.addEventListener('click', removeMessage);
  messageElement.addEventListener('click', (event) => {
    if (event.target === messageElement) {
      removeMessage();
    }
  });
}

export { restoreFormDefaults, displaySystemMessage };
