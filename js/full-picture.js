const fullscreenModal = document.querySelector('.big-picture');
const fullImage = fullscreenModal.querySelector('.big-picture__img img');
const likesDisplay = fullscreenModal.querySelector('.likes-count');
const commentsTotal = fullscreenModal.querySelector('.comments-count');
const commentsContainer = fullscreenModal.querySelector('.social__comments');
const imageDescription = fullscreenModal.querySelector('.social__caption');
const commentsCounter = fullscreenModal.querySelector('.social__comment-count');
const loadMoreButton = fullscreenModal.querySelector('.comments-loader');
const closeButton = fullscreenModal.querySelector('.big-picture__cancel');

const COMMENTS_BATCH_SIZE = 5;
let commentsData = [];
let visibleCommentsCount = 0;

function generateCommentElement(commentInfo) {
  const commentElement = document.createElement('li');
  commentElement.classList.add('social__comment');

  const avatarElement = document.createElement('img');
  avatarElement.className = 'social__picture';
  avatarElement.src = commentInfo.avatar;
  avatarElement.alt = commentInfo.name;
  avatarElement.width = 35;
  avatarElement.height = 35;

  const textElement = document.createElement('p');
  textElement.className = 'social__text';
  textElement.textContent = commentInfo.message;

  commentElement.append(avatarElement, textElement);
  return commentElement;
}

function displayComments() {
  const remainingComments = commentsData.slice(visibleCommentsCount, visibleCommentsCount + COMMENTS_BATCH_SIZE);

  remainingComments.forEach((comment) => {
    commentsContainer.appendChild(generateCommentElement(comment));
  });

  visibleCommentsCount += remainingComments.length;
  commentsCounter.textContent = `${visibleCommentsCount} из ${commentsData.length} комментариев`;

  if (visibleCommentsCount >= commentsData.length) {
    loadMoreButton.classList.add('hidden');
  }
}

function showImageFullscreen(imageInfo) {
  fullImage.src = imageInfo.url;
  fullImage.alt = imageInfo.description;
  likesDisplay.textContent = imageInfo.likes.toString();
  commentsTotal.textContent = imageInfo.comments.length.toString();
  imageDescription.textContent = imageInfo.description;

  commentsContainer.innerHTML = '';
  fullImage.className = '';

  if (imageInfo.effect && imageInfo.effect !== 'none') {
    fullImage.classList.add(`effects__preview--${imageInfo.effect}`);
  }

  commentsData = imageInfo.comments;
  visibleCommentsCount = 0;

  displayComments();

  if (commentsData.length > 0) {
    commentsCounter.classList.remove('hidden');
    if (commentsData.length > COMMENTS_BATCH_SIZE) {
      loadMoreButton.classList.remove('hidden');
    } else {
      loadMoreButton.classList.add('hidden');
    }
  } else {
    commentsCounter.classList.add('hidden');
    loadMoreButton.classList.add('hidden');
  }

  fullscreenModal.classList.remove('hidden');
  document.body.classList.add('modal-open');

  closeButton.addEventListener('click', closeFullscreen);
  document.addEventListener('keydown', handleEscapePress);
}

function closeFullscreen() {
  fullscreenModal.classList.add('hidden');
  document.body.classList.remove('modal-open');
  closeButton.removeEventListener('click', closeFullscreen);
  document.removeEventListener('keydown', handleEscapePress);
}

function handleEscapePress(event) {
  if (event.key === 'Escape') {
    closeFullscreen();
  }
}

loadMoreButton.addEventListener('click', displayComments);

export { showImageFullscreen };
