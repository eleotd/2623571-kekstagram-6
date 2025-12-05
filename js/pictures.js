import { getSimilarPhotoDescriptions } from './data.js';

const pictureTemplate = document.querySelector('#picture').content;
const picturesContainer = document.querySelector('.pictures');

const createPictureElement = (photoData) => {
  const pictureElement = pictureTemplate.cloneNode(true);
  const pictureImg = pictureElement.querySelector('.picture__img');
  const pictureComments = pictureElement.querySelector('.picture__comments');
  const pictureLikes = pictureElement.querySelector('.picture__likes');

  pictureImg.src = photoData.url;
  pictureImg.alt = photoData.description;
  pictureLikes.textContent = photoData.likes;

  const commentsCount = photoData.comments ? photoData.comments.length : 0;
  pictureComments.textContent = commentsCount;

  return pictureElement;
};

const renderPictures = () => {
  const photos = getSimilarPhotoDescriptions();
  const fragment = document.createDocumentFragment();

  photos.forEach((photo) => {
    const pictureElement = createPictureElement(photo);
    fragment.appendChild(pictureElement);
  });

  const uploadForm = picturesContainer.querySelector('.img-upload');
  if (uploadForm) {
    picturesContainer.insertBefore(fragment, uploadForm.nextSibling);
  } else {
    picturesContainer.appendChild(fragment);
  }
};

export { renderPictures };
