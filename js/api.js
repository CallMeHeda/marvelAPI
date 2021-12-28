const APIURL = "http://gateway.marvel.com/v1/public/";
const APIPUBLICKEY = config.MY_PUBLIC_API_KEY;
// 1 + PRIVATE KEY + PUBLIC KEY
const HASH = md5(
  `1${config.MY_PRIVATE_API_KEY}${APIPUBLICKEY}`
);
const IMGBOX = document.getElementById("charactersImgBox");

// SWITCH THEME (LIGHT / DARK) VARIABLES
let switcher_theme = document.getElementById("switch");
let body = document.getElementById("body");
// let charactersImg = document.getElementsByClassName('charactersImg');
let charactersImg = document.getElementsByTagName("img");
// var charactersImg = document.querySelectorAll(".charactersImg");
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

    var randomIMG = Math.round(Math.random() * data.length);

    for (let j = 0; j < data.length; j++) {
      let imgCharacterDiv = document.createElement("div");
      let imgCharactere = document.createElement("img");

      let infosCharactereBox = document.createElement("div");
      let charactereName = document.createElement("p");
      // let charactereDescr = document.createElement("p");

      let urlImg = data[j].data.results[randomIMG].thumbnail.path;

      imgCharacterDiv.setAttribute("id", "imgCharacterDiv");
      infosCharactereBox.setAttribute("id", "infosCharactereBox");
      charactereName.setAttribute("id", "charactereName");
      // charactereDescr.setAttribute("id", "charactereDescr");
      imgCharactere.setAttribute("class", "charactersImg");
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
      // charactereDescr.textContent = data[i].data.results[j].description;
      IMGBOX.append(imgCharacterDiv);
      imgCharacterDiv.append(imgCharactere, infosCharactereBox);
      infosCharactereBox.append(charactereName);
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
  console.log(data);
  IMGBOX.textContent = "";
  HEROSNAME.value = "";

  for (let i = 0; i < data.data.results.length; i++) {
    let imgCharacterDiv = document.createElement("div");
    let imgCharactere = document.createElement("img");

    let infosCharactereBox = document.createElement("div");
    let charactereName = document.createElement("p");

    let urlImg = data.data.results[i].thumbnail.path;

    imgCharacterDiv.setAttribute("id", "imgCharacterDiv");
    infosCharactereBox.setAttribute("id", "infosCharactereBox");
    charactereName.setAttribute("id", "charactereName");
    imgCharactere.setAttribute("class", "charactersImg");
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
    infosCharactereBox.append(charactereName);
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

// SWITCH THEME FUNCTION
if (on_page_load != null && on_page_load === "dark") {
  switcher_theme.checked = true;
  body.style.backgroundColor = "rgb(24, 23, 23)";
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

// VALIDER INPUT AVEC TOUCHE ENTER
HEROSNAME.addEventListener("keyup", function(e) {
  // console.log("Key" + event.key);
  if (e.key === 'Enter') {
   e.preventDefault();
   document.getElementById("btnSearch").click();
  }
});