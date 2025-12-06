const bigPicture = document.querySelector('.big-picture');
const bigPictureImg = bigPicture.querySelector('.big-picture__img img');
const likesCount = bigPicture.querySelector('.likes-count');
const commentsCount = bigPicture.querySelector('.comments-count');
const socialComments = bigPicture.querySelector('.social__comments');
const socialCaption = bigPicture.querySelector('.social__caption');
const commentCountElement = bigPicture.querySelector('.social__comment-count');
const commentsLoader = bigPicture.querySelector('.comments-loader');
const closeButton = bigPicture.querySelector('.big-picture__cancel');

const createCommentElement = (comment) => {
  const commentElement = document.createElement('li');
  commentElement.classList.add('social__comment');

  commentElement.innerHTML = `
    <img
      class="social__picture"
      src="${comment.avatar}"
      alt="${comment.name}"
      width="35" height="35">
    <p class="social__text">${comment.message}</p>
  `;

  return commentElement;
};

const renderComments = (comments) => {
  socialComments.innerHTML = '';

  const fragment = document.createDocumentFragment();

  comments.forEach((comment) => {
    const commentElement = createCommentElement(comment);
    fragment.appendChild(commentElement);
  });

  socialComments.appendChild(fragment);
};

const openBigPicture = (photoData) => {
  bigPictureImg.src = photoData.url;
  bigPictureImg.alt = photoData.description;
  likesCount.textContent = photoData.likes;
  commentsCount.textContent = photoData.comments ? photoData.comments.length : 0;
  socialCaption.textContent = photoData.description;

  if (photoData.comments && Array.isArray(photoData.comments)) {
    renderComments(photoData.comments);
  } else {
    socialComments.innerHTML = '';
  }

  commentCountElement.classList.add('hidden');
  commentsLoader.classList.add('hidden');

  bigPicture.classList.remove('hidden');

  document.body.classList.add('modal-open');
};

const closeBigPicture = () => {
  bigPicture.classList.add('hidden');
  document.body.classList.remove('modal-open');
};

closeButton.addEventListener('click', () => {
  closeBigPicture();
});

document.addEventListener('keydown', (evt) => {
  if (evt.key === 'Escape' && !bigPicture.classList.contains('hidden')) {
    closeBigPicture();
  }
});

const initFullPictureView = (photos) => {
  const pictureElements = document.querySelectorAll('.picture');

  pictureElements.forEach((pictureElement, index) => {
    pictureElement.addEventListener('click', (evt) => {
      evt.preventDefault();

      if (photos[index]) {
        openBigPicture(photos[index]);
      }
    });
  });
};

export { initFullPictureView, openBigPicture, closeBigPicture };
