import { renderPictures } from './thumbnails.js';
import { initFullPictureView } from './full-picture.js';

const filtersContainer = document.querySelector('.img-filters');
const filterButtons = filtersContainer.querySelectorAll('.img-filters__button');

const RANDOM_PHOTOS_COUNT = 10;
const DEBOUNCE_DELAY = 500;

let currentFilter = 'filter-default';
let photos = [];

const getRandomPhotos = () => {
  const shuffled = [...photos].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, RANDOM_PHOTOS_COUNT);
};

const getDiscussedPhotos = () => [...photos].sort((a, b) => {
  const commentsA = a.comments ? a.comments.length : 0;
  const commentsB = b.comments ? b.comments.length : 0;
  return commentsB - commentsA;
});

const updateActiveButton = (activeButton) => {
  filterButtons.forEach((button) => {
    button.classList.remove('img-upload__button--active');
  });
  activeButton.classList.add('img-upload__button--active');
};

const renderFilteredPhotos = () => {
  let filteredPhotos;

  switch (currentFilter) {
    case 'filter-random':
      filteredPhotos = getRandomPhotos();
      break;
    case 'filter-discussed':
      filteredPhotos = getDiscussedPhotos();
      break;
    default:
      filteredPhotos = [...photos];
  }

  renderPictures(filteredPhotos);
  initFullPictureView(filteredPhotos);
};

const debounce = (callback, timeoutDelay) => {
  let timeoutId;
  return (...rest) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback.apply(this, rest), timeoutDelay);
  };
};

const debouncedRender = debounce(renderFilteredPhotos, DEBOUNCE_DELAY);

const onFilterClick = (evt) => {
  const clickedButton = evt.target;

  if (!clickedButton.matches('.img-filters__button') || clickedButton.id === currentFilter) {
    return;
  }

  currentFilter = clickedButton.id;
  updateActiveButton(clickedButton);
  debouncedRender();
};

const showFilters = () => {
  filtersContainer.classList.remove('img-filters--inactive');
};

const initFilters = (loadedPhotos) => {
  photos = loadedPhotos;
  showFilters();
  filtersContainer.addEventListener('click', onFilterClick);
};

export { initFilters };
