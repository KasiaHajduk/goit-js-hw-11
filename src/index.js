import './sass/main.scss';
import Notiflix from 'notiflix';

// const basicLightbox = require('basiclightbox');
// import * as basicLightbox from 'basiclightbox';

const textSearch = document.querySelector('input');
const btnSearch = document.querySelector(".search-form__submit");

const gallery = document.querySelector(".gallery");


function searching(event) {
  event.preventDefault();
  //const qWhat = "cat";
  const nrPage = 1;
  console.log(textSearch.value);
  console.log("cat");
  const qWhat = textSearch.value;
  console.log(qWhat);
  if (qWhat === '') {
    Notiflix.Notify.info('Please enter a topic to search');
  }
  else {
    console.log("aaaaaaaastart");
    imageSearch(qWhat, nrPage)
      .then(res => {
        console.log(res);
        console.log("ilość rekordów");
        console.log(res.total);
        console.log(res.totalHits);
        Notiflix.Notify.info(`Hooray! We found ${res.totalHits} images.`);

        if (res.total == 0) {
          Notiflix.Notify.info('Sorry, there are no images matching your search query. Please try again.');
          gallery.innerHTML = '';
        }
        else
          renderImages(res.hits);
      })
      .catch(err => {
        console.error(err);
    })   
    console.log("aaaaaaaaaaend");
  }

  
}


btnSearch.addEventListener("click", searching);

// btnSearch.addEventListener("click", event => {
//   event.preventDefault();
//   console.log(textSearch.value);
//   console.log("cat");
// });


//btnSearch.addEventListener("click", imageSearch(textSearch.value));

function imageSearch(qWhat, nrPage) {
    // const params = new URLSearchParams({
    //     _limit: 5,
    //     // Change the group number here
    //     _page: 3
    // });
   //return fetch(`https://restcountries.com/v3.1/name/${countryName}`) //fetch zwraca nam obietnicę
  //return fetch(`https://pixabay.com/api/?key=24803522-b54cf9c0fe000d87c5b473725&q=${qWhat}&image_type=photo&orientation=horizontal&safesearch=true?${params}?fields=tags`)
       return fetch(`https://pixabay.com/api/?key=24803522-b54cf9c0fe000d87c5b473725&q=${qWhat}&image_type=photo&orientation=horizontal&safesearch=true&page=${nrPage}&per_page=5`)
        .then(res => { //then też zwraca nam obietnicę
            if (res.ok) {
                return res.json();
            } else {
                return Promise.reject(`Http error: ${res.status}`);
            }
        })
}

//   console.log("start");
//   console.log(imageSearch("dog"));
//   console.log("end");
// imageSearch("dog")
//     .then(res => {
//       console.log(res);
//       console.log("ilość rekordów");
//       console.log(res.total);
//       console.log(res.totalHits);
//       renderImages(res.hits);
//     })
//     .catch(err => {
//         console.error(err);
//     })    



function renderImages(theme) {
  const markup = theme.map(image => {
    // console.log(`image id ${image.id}`);
    // console.log(`mały obrazek ${image.webformatURL}`);
    // console.log(`duży obrazek ${image.largeImageURL}`);
    // console.log(`opis ${image.tags}`);
    // console.log(`lajki ${image.likes}`);
    // console.log(`wyświetlenia ${image.views}`);
    // console.log(`komentarze ${image.comments}`);
    // console.log(`pobrania id ${image.downloads}`);
    return `  
      <div class="photo-card">
        <img class="photo-card__image"
          src="${image.webformatURL}" 
          data-source="${image.largeImageURL}"
          alt="${image.tags}" loading="lazy" />
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


//basicLightbox gallery
const selectImage = ((event) => {
  // function selectImage(event) {
  event.preventDefault();
  console.log(`event.target.src ${event.target}`);
  const instance = basicLightbox.create(`<img src="${event.target.dataset.source}" alt="${event.target.alt}">`)
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


