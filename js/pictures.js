import { getSimilarPhotoDescriptions } from './data.js';
import { initFullPictureView } from './full-picture.js';

const pictureTemplate = document.querySelector('#picture').content;
const picturesContainer = document.querySelector('.pictures');

const createPictureElement = (photoData) => {
  const pictureElement = pictureTemplate.cloneNode(true);
  const pictureImg = pictureElement.querySelector('.picture__img');
  const pictureComments = pictureElement.querySelector('.picture__comments');
  const pictureLikes = pictureElement.querySelector('.picture__likes');
  const pictureLink = pictureElement.querySelector('.picture');

  pictureImg.src = photoData.url;
  pictureImg.alt = photoData.description;
  pictureLikes.textContent = photoData.likes;

  const commentsCount = photoData.comments ? photoData.comments.length : 0;
  pictureComments.textContent = commentsCount;

  return { element: pictureElement, link: pictureLink };
};

const renderPictures = () => {
  const photos = getSimilarPhotoDescriptions();
  const fragment = document.createDocumentFragment();
  const pictureElements = [];

  photos.forEach((photo) => {
    const { element, link } = createPictureElement(photo);

    link.dataset.photoId = photo.id;

    fragment.appendChild(element);
    pictureElements.push(link);
  });

  const uploadForm = picturesContainer.querySelector('.img-upload');
  if (uploadForm) {
    picturesContainer.insertBefore(fragment, uploadForm.nextSibling);
  } else {
    picturesContainer.appendChild(fragment);
  }

  initFullPictureView(photos);
};

export { renderPictures };
