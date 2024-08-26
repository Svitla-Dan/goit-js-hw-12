import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/api';

const API_KEY = '45493659-807fc3e2fcb62ed82bdbe6cc7';

async function searchImages({ q, page = 1, per_page } = {}) {
  return (
    await axios.get('/', {
      params: {
        key: API_KEY,
        q: encodeURIComponent(q),
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page,
        per_page,
      },
    })
  ).data;
}

export { searchImages };
