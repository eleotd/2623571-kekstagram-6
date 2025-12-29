import { fetchImagesFromServer } from './api.js';
import { renderThumbnails } from './thumbnails.js';
import { initializeForm } from './form.js';

const userPhotos = [];
const FILTER_TIMEOUT = 500;
const RANDOM_COUNT = 10;
const filtersSection = document.querySelector('.img-filters');
let allServerPhotos = [];
let filteredPhotos = [];

function createDebouncedFunction(callback, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback.apply(this, args), delay);
  };
}

function getRandomPhotos(photos) {
  const shuffled = [...photos].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, RANDOM_COUNT);
}

function getMostCommentedPhotos(photos) {
  return [...photos].sort((a, b) => b.comments.length - a.comments.length);
}

function clearPhotoGrid() {
  const container = document.querySelector('.pictures');
  const pictures = container.querySelectorAll('.picture');
  pictures.forEach((photo) => photo.remove());
}

function applyPhotoFilter(filterId) {
  clearPhotoGrid();

  if (filterId === 'filter-default') {
    filteredPhotos = allServerPhotos;
  } else if (filterId === 'filter-random') {
    filteredPhotos = getRandomPhotos(allServerPhotos);
  } else if (filterId === 'filter-discussed') {
    filteredPhotos = getMostCommentedPhotos(allServerPhotos);
  }

  renderThumbnails(filteredPhotos);
}

const debouncedFilter = createDebouncedFunction(applyPhotoFilter, FILTER_TIMEOUT);

function setupFilterButtons() {
  filtersSection.classList.remove('img-filters--inactive');

  const defaultButton = document.querySelector('#filter-default');
  if (defaultButton) {
    defaultButton.classList.add('img-filters__button--active');
  }

  filtersSection.addEventListener('click', (event) => {
    if (event.target.classList.contains('img-filters__button')) {
      const activeButton = filtersSection.querySelector('.img-filters__button--active');
      if (activeButton) {
        activeButton.classList.remove('img-filters__button--active');
      }

      event.target.classList.add('img-filters__button--active');
      debouncedFilter(event.target.id);
    }
  });
}

async function loadServerPhotos() {
  try {
    allServerPhotos = await fetchImagesFromServer();
    filteredPhotos = allServerPhotos;

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
    `;
    document.body.appendChild(errorMessage);
  }
}

function startApplication() {
  initializeForm(userPhotos, renderThumbnails);

  setTimeout(() => {
    loadServerPhotos();
  }, 100);
}

document.addEventListener('DOMContentLoaded', startApplication);
