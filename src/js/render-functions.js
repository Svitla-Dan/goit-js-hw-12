function showSearchResults(array) {
  return array
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `
        <li class="gallery-item">
          <a class="gallery-link" href="${largeImageURL}">
            <img class="gallery-image" src="${webformatURL}" alt="${tags}" width="360" height="152" />
            <ul class="description">
              <li class="description-items">
                <span class="accent">Likes </span>${likes}
              </li>
              <li class="description-items">
                <span class="accent">Views </span>${views}
              </li>
              <li class="description-items">
                <span class="accent">Comments </span>${comments}
              </li>
              <li class="description-items">
                <span class="accent">Downloads </span>${downloads}
              </li>
            </ul>
          </a>
        </li>`
    )
    .join('');
}

function showElement(element) {
  element.classList.remove('hidden');
}

function hideElement(element) {
  element.classList.add('hidden');
}

export { showSearchResults, showElement, hideElement };
