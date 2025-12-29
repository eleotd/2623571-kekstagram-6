function restoreFormDefaults() {
  const form = document.querySelector('.img-upload__form');
  const fileField = form.querySelector('.img-upload__input');
  const hashtagsField = form.querySelector('.text__hashtags');
  const descriptionField = form.querySelector('.text__description');
  const modal = document.querySelector('.img-upload__overlay');
  const preview = modal.querySelector('.img-upload__preview img');
  const slider = document.querySelector('.effect-level__slider');
  const scaleField = document.querySelector('.scale__control--value');
  const submitButton = form.querySelector('.img-upload__submit');

  form.reset();
  preview.src = '';
  hashtagsField.value = '';
  descriptionField.value = '';
  fileField.value = '';
  submitButton.disabled = false;

  scaleField.value = '100%';
  preview.style.transform = 'scale(1)';

  slider.noUiSlider.set(100);
  slider.classList.add('hidden');
  document.querySelector('input[name="effect"][value="none"]').checked = true;
  preview.className = '';
  preview.style.filter = '';

  modal.classList.add('hidden');
  document.body.classList.remove('modal-open');
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
