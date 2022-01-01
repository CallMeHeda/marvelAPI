const APIURL = "http://gateway.marvel.com/v1/public/";
const APIPUBLICKEY = config.MY_PUBLIC_API_KEY;
// 1 + PRIVATE KEY + PUBLIC KEY
const HASH = md5(`1${config.MY_PRIVATE_API_KEY}${APIPUBLICKEY}`);

// SWITCH THEME (LIGHT / DARK) VARIABLES
let switcher_theme = document.getElementById("switch");
let body = document.getElementById("body");
let charactersImg = document.getElementsByTagName("img");
// let titleNameHero = document.getElementById("titleNameHero");
let title = document.getElementById("title");

let on_page_load = localStorage.getItem("theme") || "";

// REQUEST FOR DESCRIPTION PAGE
function request(callback, herosName) {
  let xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      let myJson = JSON.parse(xhr.responseText);
      callback(myJson);
    } else {
      console.log(xhr.status + " | " + xhr.readyState);
    }
  };

  xhr.open(
    "GET",
    `${APIURL}characters?name=${herosName}&ts=1&apikey=${APIPUBLICKEY}&hash=${HASH}`,
    true
  );
  xhr.send();
}

function afficherDetatails(data) {
    // console.log("name hero " + sessionStorage.getItem("nameHero"));
  let title = document.getElementById("title");
  let description = document.getElementById("description");
  let imgCharactere = document.getElementById("imgDescription");
  let lastModificationDate = document.getElementById("lastModificationDate");
  let comicsList = document.getElementById("comicsList");
  let serieList = document.getElementById("serieList");
  let storiesList = document.getElementById("storiesList");

  // TITLE -> HERO'S NAME
  title.textContent = sessionStorage.getItem("nameHero");

  // LAST MODIFICATION
  lastModificationDate.textContent = `Last Modification : ${data.data.results[0].modified}`;

  // URL IMG
  let urlImg = data.data.results[0].thumbnail.path;
  if (
    !(
      urlImg.includes("image_not_available") || urlImg.includes("4c002e0305708")
    )
  ) {
    imgCharactere.setAttribute(
      "src",
      `${urlImg}/portrait_uncanny.${data.data.results[0].thumbnail.extension}`
    );
  } else {
    imgCharactere.setAttribute("src", "../img/inCase.jpg");
  }

  // DESCRIPTION
  description.textContent = data.data.results[0].description;

  // COMICS LIST
  // console.log(data.data.results[0].comics.items.length)
  for(let i = 0; i < 20; i++){
    let liComics = document.createElement("li");
    let liSerie = document.createElement("li");
    let liStory = document.createElement("li");

    // COMICS
    if(data.data.results[0].comics.items.length == 0){
      comicsList.textContent = "0 Comic Book";
    }else{
      liComics.textContent = data.data.results[0].comics.items[i].name;
      comicsList.append(liComics);
    }

    // SERIES
    if(data.data.results[0].series.items.length == 0){
      serieList.textContent = "0 Serie";
    }else{
      liSerie.textContent = data.data.results[0].series.items[i].name;
      serieList.append(liSerie);
    }

    // STORIES
    if(data.data.results[0].stories.items.length == 0){
      storiesList.textContent = "0 Story";
    }else{
      liStory.textContent = `${data.data.results[0].stories.items[i].name} - Type : ${data.data.results[0].stories.items[i].type}`;
      storiesList.append(liStory);
    }
  }
}
function detailsHeros() {
  let name = sessionStorage.getItem("nameHero");
  request(afficherDetatails, name);
}

// SWITCH THEME FUNCTION
if (on_page_load != null && on_page_load === "dark") {
  switcher_theme.checked = true;
  body.style.backgroundColor = "rgb(24, 23, 23)";
  // titleNameHero.style.color = "White";
  title.style.color = "White";
}

function switch_theme() {
  if (switcher_theme.checked) {
    // STOCK LA VALEUR 'DARK' DANS LA CLE THEME
    localStorage.setItem("theme", "dark");
    // RELOAD POUR AVOIR LE THEME DARK
    window.location.reload();
    switcher_theme.checked = true;
    // test();
  } else {
    // SUPPRIME CLE + VALEUR (theme + 'dark')
    window.localStorage.clear();
    // RELOAD POUR THEME LIGHT
    window.location.reload();
    switcher_theme.checked = false;
  }
}
