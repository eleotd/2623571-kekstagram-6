const SERVER_URL = 'https://32.javascript.htmlacademy.pro/kekstagram';

export const fetchImagesFromServer = async () => {
  const response = await fetch(`${SERVER_URL}/data`);

  if (!response.ok) {
    throw new Error('Не удалось загрузить изображения');
  }

  return response.json();
};

export const uploadImageData = async (formData) => {
  const response = await fetch(SERVER_URL, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error('Ошибка отправки данных');
  }

  return data;
};
