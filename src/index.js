import './sass/main.scss';
import Notiflix from 'notiflix';

// const basicLightbox = require('basiclightbox');
// import * as basicLightbox from 'basiclightbox';

const textSearch = document.querySelector('.search-form__input');
const btnSearch = document.querySelector(".search-form__submit");

const gallery = document.querySelector(".gallery");

function imageSearch(qWhat) {
    // const params = new URLSearchParams({
    //     _limit: 5,
    //     // Change the group number here
    //     _page: 3
    // });
   //return fetch(`https://restcountries.com/v3.1/name/${countryName}`) //fetch zwraca nam obietnicę
  //return fetch(`https://pixabay.com/api/?key=24803522-b54cf9c0fe000d87c5b473725&q=${qWhat}&image_type=photo&orientation=horizontal&safesearch=true?${params}?fields=tags`)
       return fetch(`https://pixabay.com/api/?key=24803522-b54cf9c0fe000d87c5b473725&q=${qWhat}&image_type=photo&orientation=horizontal&safesearch=true`)
        .then(res => { //then też zwraca nam obietnicę
            if (res.ok) {
                return res.json();
            } else {
                return Promise.reject(`Http error: ${res.status}`);
            }
        })
}

  console.log("start");
  console.log(imageSearch("cat"));
  console.log("end");
imageSearch("cat")
    .then(res => {
      console.log(res);
      console.log("ilość rekordów");
      console.log(res.total);
      console.log(res.totalHits);
      renderImages(res.hits);
    })
    .catch(err => {
        console.error(err);
    })    





function renderImages(theme) {
  const markup = theme.map(image => {
    console.log(`image id ${image.id}`);
    console.log(`mały obrazek ${image.webformatURL}`);
    console.log(`duży obrazek ${image.largeImageURL}`);
    console.log(`opis ${image.tags}`);
    console.log(`lajki ${image.likes}`);
    console.log(`wyświetlenia ${image.views}`);
    console.log(`komentarze ${image.comments}`);
    console.log(`pobrania id ${image.downloads}`);
    return `  
      <div class="photo-card">
        <img class="photo-card__image" src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
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
   gallery.innerHTML = markup;
}

const selectImage = ((event) => {
  // function selectImage(event) {
  event.preventDefault();
  const instance = basicLightbox.create(`<img src="${event.target.src}" alt="${event.target.alt}">`)
  instance.show();
  if (instance.visible() === true) {
    document.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        instance.close();
      }
    })
  }
});

gallery.addEventListener("click", selectImage);


//btnSearch.addEventListener("click", imageSearch);


