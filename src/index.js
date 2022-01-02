import './sass/main.scss';
import Notiflix from 'notiflix';
import axios from 'axios';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const textSearch = document.querySelector('input');
const btnSearch = document.querySelector(".search-form__submit");
const btnMore = document.querySelector(".load-more");
const gallery = document.querySelector(".gallery");
let nrPage = 0;
let qWhat = "";


btnMore.style.visibility = "hidden";


function searching(event) {
  btnMore.style.visibility = "hidden";
  event.preventDefault();
  gallery.innerHTML = '';
  nrPage = 1;
  
  qWhat = textSearch.value;
 
  if (qWhat === '') {
    Notiflix.Notify.info('Please enter a topic to search');
  } else {
    imageSearch(qWhat, nrPage)
      .then(res => {
        if (res.total == 0) {
          Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
          gallery.innerHTML = '';
        } else {
          Notiflix.Notify.info(`Hooray! We found ${res.totalHits} images.`);
          btnMore.style.visibility = "visible";
          renderImages(res.hits);
        }
      })
      .catch(err => {
        console.error(err);
      })   
  }
}

function searchingMore(event) {
  event.preventDefault();
  nrPage += 1;
    imageSearch(qWhat, nrPage)
      .then(res => {
        renderImages(res.hits);
        if (res.totalHits < nrPage * 40) {
          btnMore.style.visibility = "hidden";
          Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
        }
      })
      .catch(err => {
        console.error(err);
      }) 
}

btnSearch.addEventListener("click", searching);
btnMore.addEventListener("click", searchingMore);


async function imageSearch(qWhat, nrPage) {
  try {
    const { data } = await axios({
      method: 'get',
      url: `https://pixabay.com/api/?key=24803522-b54cf9c0fe000d87c5b473725&q=${qWhat}&image_type=photo&orientation=horizontal&safesearch=true&page=${nrPage}&per_page=40`,
    });
    return data;
  }
  catch {
    console.error("Wystąpił błąd podczas żądania pobrania obrazów");
  }
}


function renderImages(theme) {
  const markup = theme.map(image => {
    return `  
      <div class="photo-card">
        <a href="${image.largeImageURL}">
        <img class="photo-card__image"
          src="${image.webformatURL}" 
          data-source="${image.largeImageURL}"
          alt="${image.tags}" loading="lazy" />
        </a>    
        <div class="info">
          <p class="info-item">
            <b>Likes</b> ${image.likes}
          </p>
          <p class="info-item">
            <b>Views</b> ${image.views}
          </p>
          <p class="info-item">
            <b>Comments</b> ${image.comments}
          </p>
          <p class="info-item">
            <b>Downloads</b> ${image.downloads}
          </p>
        </div>
      </div>`;
    }).join('');
  gallery.innerHTML += markup;
  
  new SimpleLightbox(`.gallery a`, { captionsData: "alt", captionDelay: 250 });
  
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
});


}


// //gallery
// const selectImage = ((event) => {
//   event.preventDefault();
//   console.log(`event.target.src ${event.target}`);
//   const instance = basicLightbox.create(`<img src="${event.target.dataset.source}" alt="${event.target.alt}">`)
//   instance.show();
//   if (instance.visible() === true) {
//     document.addEventListener("keydown", event => {
//       if (event.key === "Escape") {
//         instance.close();
//       }
//     })
//   }
// });
// gallery.addEventListener("click", selectImage);


window.onscroll = function(){
   if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      searchingMore();
   }
};