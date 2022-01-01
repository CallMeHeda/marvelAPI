const APIURL = "http://gateway.marvel.com/v1/public/";
const APIPUBLICKEY = config.MY_PUBLIC_API_KEY;
// 1 + PRIVATE KEY + PUBLIC KEY
const HASH = md5(`1${config.MY_PRIVATE_API_KEY}${APIPUBLICKEY}`);
const IMGBOX = document.getElementById("charactersImgBox");

// SWITCH THEME (LIGHT / DARK) VARIABLES
let switcher_theme = document.getElementById("switch");
let body = document.getElementById("body");
let charactersImg = document.getElementsByTagName("img");
// let titleNameHero = document.getElementById("titleNameHero");
let title = document.getElementById("title");

let on_page_load = localStorage.getItem("theme") || "";

// console.log(HASH);

// TABLEAU D'URL
let promise = [];
// 1559 données
for (let i = 0; i < 1600; i += 100) {
  promise.push(
    fetch(
      `${APIURL}characters?&ts=1&apikey=${APIPUBLICKEY}&hash=${HASH}&limit=100&offset=${i}`
    ).then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("La requête n'a pas abouti");
      }
    })
  );
}

// RANDOM 16 CHARACTERS (16 lignes de 100 data)
Promise.all(promise)
  .then(function (data) {
    console.log(data);

    // 16 RANDOM IMG
    var randomIMG = Math.round(Math.random() * data.length);

    for (let j = 0; j < data.length; j++) {
      // IMAGE TAG
      let imgCharacterDiv = document.createElement("div");
      let imgCharactere = document.createElement("img");
      // HREF DESCRIPTON CHARACTER
      let hrefDescription = document.createElement("a");
      // NAME TAG
      let infosCharactereBox = document.createElement("div");
      let charactereName = document.createElement("p");
      // URL RANDOM IMG
      let urlImg = data[j].data.results[randomIMG].thumbnail.path;

      imgCharacterDiv.setAttribute("id", "imgCharacterDiv");
      infosCharactereBox.setAttribute("id", "infosCharactereBox");
      charactereName.setAttribute("id", "charactereName");
      imgCharactere.setAttribute("class", "charactersImg");
      hrefDescription.setAttribute("href", "/PAGES/description.html");
      hrefDescription.setAttribute("class", "hrefDescription");
      hrefDescription.setAttribute(
        "onclick",
        "setSessionItem(this.textContent)"
      );
      // hrefDescription.setAttribute(
      //   "onmouseover",
      //   "setSessionItem(this.textContent)"
      // );
      if (
        !(
          urlImg.includes("image_not_available") ||
          urlImg.includes("4c002e0305708")
        )
      ) {
        imgCharactere.setAttribute(
          "src",
          `${data[j].data.results[randomIMG].thumbnail.path}/standard_xlarge.${data[j].data.results[randomIMG].thumbnail.extension}`
        );
      } else {
        imgCharactere.setAttribute("src", "../img/inCase.jpg");
      }
      charactereName.textContent = data[j].data.results[randomIMG].name;
      IMGBOX.append(imgCharacterDiv);
      imgCharacterDiv.append(imgCharactere, infosCharactereBox);
      infosCharactereBox.append(hrefDescription);
      hrefDescription.append(charactereName);
    }

    // CHANGE CSS POUR THEME DARK
    if (on_page_load != null && on_page_load === "dark") {
      for (let i = 0; i < charactersImg.length; i++) {
        charactersImg[i].style.borderColor = "white";
      }
    }
  })
  .catch((err) => (console.error = "Erreur de type : " + err));

// RECHERCHE PAR NOM
const HEROSNAME = document.getElementById("herosName");

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
    `${APIURL}characters?nameStartsWith=${herosName}&ts=1&apikey=${APIPUBLICKEY}&hash=${HASH}`,
    true
  );
  xhr.send();
}

function afficherHero(data) {
  IMGBOX.textContent = "";
  HEROSNAME.value = "";

  for (let i = 0; i < data.data.results.length; i++) {
    // console.log(data.data.results[i].name);

    // IMAGE TAG
    let imgCharacterDiv = document.createElement("div");
    let imgCharactere = document.createElement("img");
    // HREF DESCRIPTON CHARACTER
    let hrefDescription = document.createElement("a");
    // NAME TAG
    let infosCharactereBox = document.createElement("div");
    let charactereName = document.createElement("p");
    // URL RANDOM IMG
    let urlImg = data.data.results[i].thumbnail.path;

    imgCharacterDiv.setAttribute("id", "imgCharacterDiv");
    infosCharactereBox.setAttribute("id", "infosCharactereBox");
    charactereName.setAttribute("id", "charactereName");
    imgCharactere.setAttribute("class", "charactersImg");
    hrefDescription.setAttribute("href", `/PAGES/description.html`);
    hrefDescription.setAttribute(
      "onclick",
      "setSessionItem(this.textContent)"
    );
    if (
      !(
        urlImg.includes("image_not_available") ||
        urlImg.includes("4c002e0305708")
      )
    ) {
      imgCharactere.setAttribute(
        "src",
        `${data.data.results[i].thumbnail.path}/standard_xlarge.${data.data.results[i].thumbnail.extension}`
      );
    } else {
      imgCharactere.setAttribute("src", "../img/inCase.jpg");
    }
    charactereName.textContent = data.data.results[i].name;
    IMGBOX.append(imgCharacterDiv);
    imgCharacterDiv.append(imgCharactere, infosCharactereBox);
    infosCharactereBox.append(hrefDescription);
    hrefDescription.append(charactereName);
  }

  // CHANGE CSS POUR THEME DARK
  if (on_page_load != null && on_page_load === "dark") {
    for (let i = 0; i < charactersImg.length; i++) {
      charactersImg[i].style.borderColor = "white";
    }
  }
}

function searchHero() {
  let herosName = HEROSNAME.value;
  request(afficherHero, herosName);
}

// VALIDER INPUT AVEC TOUCHE ENTER
HEROSNAME.addEventListener("keyup", function(e) {
  // console.log("Key" + e.key);
  if (e.key === 'Enter') {
   e.preventDefault();
   document.getElementById("btnSearch").click();
  }
});

function setSessionItem(name){
  sessionStorage.setItem("nameHero", name);
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
if (!(urlImg.includes("image_not_available") || urlImg.includes("4c002e0305708"))){
  imgCharactere.setAttribute("src",`${urlImg}/portrait_uncanny.${data.data.results[0].thumbnail.extension}`);
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