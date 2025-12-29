import { showImageFullscreen } from './full-picture.js';

const thumbnailTemplate = document.querySelector('#picture').content.querySelector('.picture');

function createThumbnail(imageData) {
  const thumbnail = thumbnailTemplate.cloneNode(true);
  const imageElement = thumbnail.querySelector('.picture__img');

  imageElement.src = imageData.url;
  imageElement.alt = imageData.description;
  thumbnail.querySelector('.picture__likes').textContent = imageData.likes;
  thumbnail.querySelector('.picture__comments').textContent = imageData.comments.length;

  thumbnail.addEventListener('click', (event) => {
    event.preventDefault();
    showImageFullscreen(imageData);
  });

  if (imageData.effect && imageData.effect !== 'none') {
    imageElement.classList.add(`effects__preview--${imageData.effect}`);
  }

  return thumbnail;
}

function renderThumbnails(imagesArray) {
  const picturesContainer = document.querySelector('.pictures');
  const existingThumbnails = picturesContainer.querySelectorAll('.picture');

  existingThumbnails.forEach((thumbnail) => {
    thumbnail.remove();
  });

  const fragment = document.createDocumentFragment();
  imagesArray.forEach((image) => {
    fragment.appendChild(createThumbnail(image));
  });

  picturesContainer.appendChild(fragment);
}

export { renderThumbnails };
