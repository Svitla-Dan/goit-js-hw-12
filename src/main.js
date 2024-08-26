import elements from './js/elements';
import { searchImages } from './js/pixabay-api';
import {
  showSearchResults,
  showElement,
  hideElement,
} from './js/render-functions';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import simpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const photosGallery = new simpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
  overlayOpacity: 0.8,
});

const params = {
  q: '',
  page: 1,
  per_page: 15,
  total_pages: 0,
};

elements.form.addEventListener('submit', searchHandler);

async function searchHandler(event) {
  event.preventDefault();
  elements.gallery.innerHTML = '';
  params.page = 1;
  elements.loadMoreBtn.removeEventListener('click', loadMoreHandler);
  hideElement(elements.loadMoreBtn);
  params.q = elements.input.value.trim();
  if (params.q === '') {
    return iziToast.error({
      message: 'Search field can not be empty!',
      position: 'topCenter',
      timeout: 3000,
      messageColor: '#fafafb',
      backgroundColor: '#ef4040',
      iconUrl: './error.svg',
      progressBarColor: '#b51b1b',
      maxWidth: '432px',
    });
  }
  showElement(elements.loader);
  try {
    const data = await searchImages(params);
    if (data.hits.length === 0) {
      elements.input.value = '';
      iziToast.error({
        message:
          'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
        timeout: 3000,
        messageColor: '#fafafb',
        backgroundColor: '#ef4040',
        iconUrl: './error.svg',
        progressBarColor: '#b51b1b',
        maxWidth: '432px',
      });
    } else {
      params.total_pages = Math.ceil(data.totalHits / params.per_page);
      if (params.total_pages > 1) {
        showElement(elements.loadMoreBtn);
        elements.loadMoreBtn.addEventListener('click', loadMoreHandler);
      } else {
        hideElement(elements.loadMoreBtn);
        iziToast.info({
          message: "We're sorry, but you've reached the end of search results.",
          position: 'topRight',
          timeout: 3000,
          maxWidth: '432px',
        });
        elements.loadMoreBtn.removeEventListener('click', loadMoreHandler);
      }
      elements.input.value = '';
      elements.gallery.innerHTML = showSearchResults(data.hits);
      photosGallery.refresh();
    }
  } catch (err) {
    iziToast.error({
      message: `Something went wrong... Error: ${err}`,
      position: 'topCenter',
      timeout: 3000,
      messageColor: '#fafafb',
      backgroundColor: '#ef4040',
      iconUrl: './error.svg',
      progressBarColor: '#b51b1b',
      maxWidth: '432px',
    });
  } finally {
    hideElement(elements.loader);
  }
}

async function loadMoreHandler() {
  showElement(elements.loader);
  params.page += 1;
  hideElement(elements.loadMoreBtn);
  try {
    const data = await searchImages(params);
    elements.gallery.insertAdjacentHTML(
      'beforeend',
      showSearchResults(data.hits)
    );
    photosGallery.refresh();
    const galleryItem = document.querySelector('.gallery-item');
    const galleryItemHeight = galleryItem.getBoundingClientRect().height;
    window.scrollBy({
      top: galleryItemHeight * 2,
      behavior: 'smooth',
    });
  } catch (err) {
    iziToast.error({
      message: `Something went wrong... Error: ${err}`,
      position: 'topCenter',
      timeout: 3000,
      messageColor: '#fafafb',
      backgroundColor: '#ef4040',
      iconUrl: './error.svg',
      progressBarColor: '#b51b1b',
      maxWidth: '432px',
    });
  } finally {
    hideElement(elements.loader);
    if (params.page === params.total_pages) {
      elements.loadMoreBtn.removeEventListener('click', loadMoreHandler);
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
        timeout: 3000,
        maxWidth: '432px',
      });
    } else {
      showElement(elements.loadMoreBtn);
    }
  }
}
