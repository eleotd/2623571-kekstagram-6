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
  container.querySelectorAll('.picture').forEach((photo) => photo.remove());
}

function applyPhotoFilter(filterId) {
  clearPhotoGrid();

  switch(filterId) {
    case 'filter-default':
      filteredPhotos = allServerPhotos;
      break;
    case 'filter-random':
      filteredPhotos = getRandomPhotos(allServerPhotos);
      break;
    case 'filter-discussed':
      filteredPhotos = getMostCommentedPhotos(allServerPhotos);
      break;
  }

  renderThumbnails(filteredPhotos);
}

const debouncedFilter = createDebouncedFunction(applyPhotoFilter, FILTER_TIMEOUT);

function setupFilterButtons() {
  filtersSection.classList.remove('img-filters--inactive');

  filtersSection.addEventListener('click', (event) => {
    if (event.target.classList.contains('img-filters__button')) {
      filtersSection.querySelector('.img-filters__button--active')
        .classList.remove('img-filters__button--active');

      event.target.classList.add('img-filters__button--active');
      debouncedFilter(event.target.id);
    }
  });
}

async function loadServerPhotos() {
  try {
    allServerPhotos = await fetchImagesFromServer();
    filteredPhotos = allServerPhotos;

    filtersSection.classList.remove('img-filters--inactive');
    setupFilterButtons();
    renderThumbnails(filteredPhotos);
  } catch (error) {
    const errorMessage = document.createElement('div');
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
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    `;
    document.body.appendChild(errorMessage);
  }
}

function startApplication() {
  loadServerPhotos();
  initializeForm(userPhotos, renderThumbnails);
}

document.addEventListener('DOMContentLoaded', startApplication);
