import { fetchImagesFromServer } from './api.js';
import { renderThumbnails } from './thumbnails.js';
import { initializeForm } from './form.js';

const FILTER_TIMEOUT = 500;
const RANDOM_COUNT = 10;
const filtersSection = document.querySelector('.img-filters');
let allServerPhotos = [];
let filteredPhotos = [];

const debounce = (callback, timeoutDelay = 500) => {
  let timeoutId;

  return (...rest) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      try {
        callback.apply(this, rest);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Ошибка в debounce:', error);
      }
    }, timeoutDelay);
  };
};

const getRandomPhotos = (photos) => {
  const shuffled = [...photos].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, RANDOM_COUNT);
};

const getMostCommentedPhotos = (photos) => [...photos].sort((a, b) => b.comments.length - a.comments.length);

const clearPhotoGrid = () => {
  const container = document.querySelector('.pictures');
  const pictures = container.querySelectorAll('.picture');
  pictures.forEach((photo) => photo.remove());
};

const applyPhotoFilter = (filterId) => {
  clearPhotoGrid();

  switch (filterId) {
    case 'filter-random':
      filteredPhotos = getRandomPhotos(allServerPhotos);
      break;
    case 'filter-discussed':
      filteredPhotos = getMostCommentedPhotos(allServerPhotos);
      break;
    default:
      filteredPhotos = [...allServerPhotos];
  }

  renderThumbnails(filteredPhotos);
};

const debouncedFilter = debounce(applyPhotoFilter, FILTER_TIMEOUT);

const setupFilterButtons = () => {
  const buttons = filtersSection.querySelectorAll('.img-filters__button');

  const defaultButton = document.querySelector('#filter-default');
  if (defaultButton) {
    defaultButton.classList.add('img-filters__button--active');
  }

  filtersSection.addEventListener('click', (event) => {
    if (!event.target.classList.contains('img-filters__button')) {
      return;
    }

    buttons.forEach((button) => {
      button.classList.remove('img-filters__button--active');
    });

    event.target.classList.add('img-filters__button--active');

    debouncedFilter(event.target.id);
  });
};

const loadServerPhotos = async () => {
  try {
    allServerPhotos = await fetchImagesFromServer();
    filteredPhotos = [...allServerPhotos];

    renderThumbnails(filteredPhotos);

    filtersSection.classList.remove('img-filters--inactive');
    setupFilterButtons();

  } catch (error) {
    const errorMessage = document.createElement('div');
    errorMessage.className = 'data-error';
    errorMessage.textContent = 'Не удалось загрузить фотографии. Попробуйте перезагрузить страницу.';
    errorMessage.style.cssText = `
      color: white;
      background-color: rgba(255, 78, 78, 0.9);
      text-align: center;
      font-size: 16px;
      padding: 15px;
      margin: 20px auto;
      border-radius: 5px;
      max-width: 600px;
      z-index: 1000;
    `;
    document.body.appendChild(errorMessage);
  }
};

const startApplication = () => {
  initializeForm();
  loadServerPhotos();
};

document.addEventListener('DOMContentLoaded', startApplication);

