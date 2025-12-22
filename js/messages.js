const successTemplate = document.querySelector('#success').content.querySelector('.success');
const errorTemplate = document.querySelector('#error').content.querySelector('.error');

const showMessage = (template, buttonClass, closeCallback = null) => {
  const message = template.cloneNode(true);
  document.body.appendChild(message);

  const button = message.querySelector(`.${buttonClass}`);
  const inner = message.querySelector('div > div');

  const onDocumentClick = (evt) => {
    if (evt.target === message || !inner.contains(evt.target)) {
      // eslint-disable-next-line no-use-before-define
      closeMessage();
    }
  };

  const onDocumentKeydown = (evt) => {
    if (evt.key === 'Escape') {
      // eslint-disable-next-line no-use-before-define
      closeMessage();
    }
  };

  const closeMessage = () => {
    message.remove();
    document.removeEventListener('keydown', onDocumentKeydown);
    document.removeEventListener('click', onDocumentClick);
    if (closeCallback) {
      closeCallback();
    }
  };

  button.addEventListener('click', closeMessage);
  document.addEventListener('keydown', onDocumentKeydown);
  document.addEventListener('click', onDocumentClick);
};

const showSuccessMessage = () => {
  showMessage(successTemplate, 'success__button');
};

// eslint-disable-next-line no-unused-vars
const showErrorMessage = (text = null) => {
  showMessage(errorTemplate, 'error__button');
};

const showAlert = (message) => {
  const alertContainer = document.createElement('div');
  alertContainer.style.zIndex = '100';
  alertContainer.style.position = 'absolute';
  alertContainer.style.left = '0';
  alertContainer.style.top = '0';
  alertContainer.style.right = '0';
  alertContainer.style.padding = '10px 3px';
  alertContainer.style.fontSize = '30px';
  alertContainer.style.textAlign = 'center';
  alertContainer.style.backgroundColor = 'red';

  alertContainer.textContent = message;

  document.body.append(alertContainer);

  setTimeout(() => {
    alertContainer.remove();
  }, 5000);
};

export { showSuccessMessage, showErrorMessage, showAlert };
