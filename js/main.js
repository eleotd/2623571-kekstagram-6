import './data.js';
import {getSimilarPhotoDescriptions} from './data.js';
import { renderPictures } from './pictures.js';
import { initForm } from './form.js';

// eslint-disable-next-line no-console
console.log(
  getSimilarPhotoDescriptions()
);

renderPictures();

initForm();
