import { getData } from './api.js';
import { renderPhotos, showLoadingError } from './pictures.js';
import { initForm } from './form.js';

const initApp = async () => {
  try {
    const photos = await getData();
    renderPhotos(photos);
  } catch (error) {
    showLoadingError(error.message);
  }

  initForm();
};

initApp();
