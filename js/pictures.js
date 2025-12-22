import { renderPictures } from './thumbnails.js';
import { initFullPictureView } from './full-picture.js';
import { showAlert } from './messages.js';

let currentPhotos = [];

const renderPhotos = (photos) => {
  currentPhotos = photos;
  renderPictures(photos);
  initFullPictureView(photos);
};

const showLoadingError = (message) => {
  showAlert(message);
};

export { renderPhotos, showLoadingError, currentPhotos };
