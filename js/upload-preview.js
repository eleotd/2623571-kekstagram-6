const uploadInput = document.querySelector('.img-upload__input');
const uploadPreview = document.querySelector('.img-upload__preview img');
const effectsPreviews = document.querySelectorAll('.effects__preview');

const FILE_TYPES = ['jpg', 'jpeg', 'png'];

const showPreview = (file) => {
  const fileName = file.name.toLowerCase();
  const matches = FILE_TYPES.some((it) => fileName.endsWith(it));

  if (!matches) {
    return;
  }

  const reader = new FileReader();

  reader.addEventListener('load', () => {
    uploadPreview.src = reader.result;
    effectsPreviews.forEach((preview) => {
      preview.style.backgroundImage = `url(${reader.result})`;
    });
  });

  reader.readAsDataURL(file);
};

const initUploadPreview = () => {
  uploadInput.addEventListener('change', () => {
    const file = uploadInput.files[0];
    if (file) {
      showPreview(file);
    }
  });
};

export { initUploadPreview };
