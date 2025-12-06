const bigPicture = document.querySelector('.big-picture');
const bigPictureImg = bigPicture.querySelector('.big-picture__img img');
const likesCount = bigPicture.querySelector('.likes-count');
const commentsCount = bigPicture.querySelector('.comments-count');
const socialComments = bigPicture.querySelector('.social__comments');
const socialCaption = bigPicture.querySelector('.social__caption');
const commentCountElement = bigPicture.querySelector('.social__comment-count');
const commentsLoader = bigPicture.querySelector('.comments-loader');
const closeButton = bigPicture.querySelector('.big-picture__cancel');

const COMMENTS_PER_PAGE = 5;
let currentComments = [];
let shownCommentsCount = 0;

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

const updateCommentsCounter = () => {
  const totalComments = currentComments.length;
  const shownText = `Показано ${shownCommentsCount} из ${totalComments} комментариев`;
  commentCountElement.textContent = shownText;
};

const renderNextComments = () => {
  const remainingComments = currentComments.length - shownCommentsCount;
  const commentsToShow = Math.min(COMMENTS_PER_PAGE, remainingComments);

  const fragment = document.createDocumentFragment();

  for (let i = 0; i < commentsToShow; i++) {
    const commentIndex = shownCommentsCount + i;
    const comment = currentComments[commentIndex];
    const commentElement = createCommentElement(comment);
    fragment.appendChild(commentElement);
  }

  socialComments.appendChild(fragment);
  shownCommentsCount += commentsToShow;

  updateCommentsCounter();

  if (shownCommentsCount >= currentComments.length) {
    commentsLoader.classList.add('hidden');
  }
};

const renderCommentsWithPagination = (comments) => {
  currentComments = comments;
  shownCommentsCount = 0;
  socialComments.innerHTML = '';

  commentCountElement.classList.remove('hidden');
  commentsLoader.classList.remove('hidden');

  const onLoadMoreClick = () => {
    renderNextComments();
  };

  commentsLoader.removeEventListener('click', onLoadMoreClick);
  commentsLoader.addEventListener('click', onLoadMoreClick);

  renderNextComments();
};

const openBigPicture = (photoData) => {
  bigPictureImg.src = photoData.url;
  bigPictureImg.alt = photoData.description;
  likesCount.textContent = photoData.likes;

  const totalComments = photoData.comments ? photoData.comments.length : 0;
  commentsCount.textContent = totalComments;

  socialCaption.textContent = photoData.description;

  if (photoData.comments && Array.isArray(photoData.comments)) {
    renderCommentsWithPagination(photoData.comments);
  } else {
    socialComments.innerHTML = '';
    commentCountElement.classList.add('hidden');
    commentsLoader.classList.add('hidden');
  }

  bigPicture.classList.remove('hidden');
  document.body.classList.add('modal-open');
};

const closeBigPicture = () => {
  bigPicture.classList.add('hidden');
  document.body.classList.remove('modal-open');
  currentComments = [];
  shownCommentsCount = 0;
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
