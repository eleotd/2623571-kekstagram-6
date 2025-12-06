import { initScale, resetScale } from './scale.js';
import { initEffects, resetEffects } from './effects.js';

const uploadForm = document.querySelector('.img-upload__form');
const uploadInput = uploadForm.querySelector('.img-upload__input');
const uploadOverlay = uploadForm.querySelector('.img-upload__overlay');
const closeButton = uploadForm.querySelector('.img-upload__cancel');
const hashtagsInput = uploadForm.querySelector('.text__hashtags');
const commentInput = uploadForm.querySelector('.text__description');

let pristine;

const MAX_HASHTAGS = 5;
const MAX_COMMENT_LENGTH = 140;

const validateHashtags = (value) => {
  if (value.trim() === '') {
    return true;
  }

  const hashtags = value.trim().toLowerCase().split(/\s+/);

  if (hashtags.length > MAX_HASHTAGS) {
    return false;
  }

  const uniqueHashtags = new Set();

  for (const hashtag of hashtags) {
    if (!hashtag.startsWith('#') || hashtag.length === 1) {
      return false;
    }

    if (hashtag.length > 20) {
      return false;
    }

    if (!/^#[a-zа-яё0-9]+$/i.test(hashtag)) {
      return false;
    }

    if (uniqueHashtags.has(hashtag)) {
      return false;
    }

    uniqueHashtags.add(hashtag);
  }

  return true;
};

const getHashtagErrorMessage = (value) => {
  if (value.trim() === '') {
    return '';
  }

  const hashtags = value.trim().toLowerCase().split(/\s+/);

  if (hashtags.length > MAX_HASHTAGS) {
    return `Не более ${MAX_HASHTAGS} хэш-тегов`;
  }

  const uniqueHashtags = new Set();

  for (const hashtag of hashtags) {
    if (!hashtag.startsWith('#')) {
      return 'Хэш-тег должен начинаться с #';
    }

    if (hashtag === '#') {
      return 'Хэш-тег не может состоять только из #';
    }

    if (hashtag.length > 20) {
      return 'Максимальная длина хэш-тега 20 символов';
    }

    if (!/^#[a-zа-яё0-9]+$/i.test(hashtag)) {
      return 'Хэш-тег может содержать только буквы и цифры';
    }

    if (uniqueHashtags.has(hashtag)) {
      return 'Хэш-теги не должны повторяться';
    }

    uniqueHashtags.add(hashtag);
  }

  return '';
};

const validateComment = (value) => value.length <= MAX_COMMENT_LENGTH;

const getCommentErrorMessage = () => `Комментарий не может быть длиннее ${MAX_COMMENT_LENGTH} символов`;

const initPristine = () => {
  pristine = new Pristine(uploadForm, {
    classTo: 'img-upload__field-wrapper',
    errorClass: 'img-upload__field-wrapper--error',
    successClass: 'img-upload__field-wrapper--success',
    errorTextParent: 'img-upload__field-wrapper',
    errorTextTag: 'div',
    errorTextClass: 'img-upload__error'
  });

  pristine.addValidator(
    hashtagsInput,
    validateHashtags,
    getHashtagErrorMessage
  );

  pristine.addValidator(
    commentInput,
    validateComment,
    getCommentErrorMessage
  );
};

const resetForm = () => {
  uploadForm.reset();
  resetScale();
  resetEffects();
};

const openForm = () => {
  uploadOverlay.classList.remove('hidden');
  document.body.classList.add('modal-open');
  resetScale();
  resetEffects();
};

const closeForm = () => {
  uploadOverlay.classList.add('hidden');
  document.body.classList.remove('modal-open');
  resetForm();
};

const onUploadInputChange = () => {
  openForm();
};

const onCloseButtonClick = () => {
  closeForm();
};

const onDocumentKeydown = (evt) => {
  if (evt.key === 'Escape' && !uploadOverlay.classList.contains('hidden')) {
    const isHashtagsFocused = document.activeElement === hashtagsInput;
    const isCommentFocused = document.activeElement === commentInput;

    if (!isHashtagsFocused && !isCommentFocused) {
      evt.preventDefault();
      closeForm();
    }
  }
};

const onFormSubmit = (evt) => {
  if (!pristine.validate()) {
    evt.preventDefault();
  }
};

const initForm = () => {
  initPristine();
  initScale();
  initEffects();

  uploadInput.addEventListener('change', onUploadInputChange);
  closeButton.addEventListener('click', onCloseButtonClick);
  document.addEventListener('keydown', onDocumentKeydown);
  uploadForm.addEventListener('submit', onFormSubmit);
};

export { initForm };
