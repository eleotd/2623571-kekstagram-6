const SERVER_URL = 'https://29.javascript.htmlacademy.pro/kekstagram';

async function fetchImagesFromServer() {
  try {
    const response = await fetch(`${SERVER_URL}/data`);
    if (!response.ok) {
      throw new Error(`Ошибка сервера: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    throw new Error('Не удалось загрузить изображения. Проверьте подключение к интернету.');
  }
}

async function uploadImageData(formData) {
  try {
    const response = await fetch(SERVER_URL, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) {
      throw new Error(`Ошибка отправки: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    throw new Error('Ошибка при отправке изображения на сервер.');
  }
}

export { fetchImagesFromServer, uploadImageData };
