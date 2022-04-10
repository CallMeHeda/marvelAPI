const APIURL = "http://gateway.marvel.com/v1/public/";
const APIPUBLICKEY = config.MY_PUBLIC_API_KEY;
// 1 + PRIVATE KEY + PUBLIC KEY
const HASH = md5(`1${config.MY_PRIVATE_API_KEY}${APIPUBLICKEY}`);
// console.log(HASH);

const IMGBOX = document.getElementById("charactersImgBox");

// SWITCH THEME (LIGHT / DARK) VARIABLES
let switcher_theme = document.getElementById("switch");
let body = document.getElementById("body");
let charactersImg = document.getElementsByTagName("img");
let heroEmpty = document.getElementById("heroEmpty");
let title = document.getElementById("title");
let titleDescr = document.getElementsByClassName("title");
let lastModificationDate = document.getElementById("lastModificationDate");
let description = document.getElementById("description");
let listBox = document.getElementsByTagName("ul");
let counterBox = document.getElementById("counter");
let pourcentage = document.getElementById("pourcentage");
let imgDescriptionPage = document.getElementById("imgDescription");

let on_page_load = localStorage.getItem("theme");

if (counterBox) {
  window.onload = function () {
    let cpt = 0;
    const interval = setInterval(function () {
      document.getElementById("container").style.display = "none";

      document.getElementById("pourcentage").textContent = `${cpt}%`;
      document.getElementById("hr").style.width = `${cpt}%`;

      cpt++;

      if (cpt > 100) {
        clearInterval(interval);
        document.getElementById("container").style.display = "flex";
        document.getElementById("counter").style.display = "none";
      }
    }, 55);

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
        // var randomIMG = Math.round((Math.random() * data.length));
        var randomIMG = Math.round(Math.random() * 100);
        var randomIMGLastLine = Math.round(Math.random() * 58);
        // console.log(randomIMG)
        // console.log(randomIMGLastLine)

        for (let j = 0; j < data.length - 1; j++) {
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

        // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
        // IMAGE TAG
        let imgCharacterDiv = document.createElement("div");
        let imgCharactere = document.createElement("img");
        // HREF DESCRIPTON CHARACTER
        let hrefDescription = document.createElement("a");
        // NAME TAG
        let infosCharactereBox = document.createElement("div");
        let charactereName = document.createElement("p");
        // URL RANDOM IMG
        let urlImg = data[15].data.results[randomIMGLastLine].thumbnail.path;

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

        if (
          !(
            urlImg.includes("image_not_available") ||
            urlImg.includes("4c002e0305708")
          )
        ) {
          imgCharactere.setAttribute(
            "src",
            `${data[15].data.results[randomIMGLastLine].thumbnail.path}/standard_xlarge.${data[15].data.results[randomIMGLastLine].thumbnail.extension}`
          );
        } else {
          imgCharactere.setAttribute("src", "../img/inCase.jpg");
        }
        charactereName.textContent =
          data[15].data.results[randomIMGLastLine].name;
        IMGBOX.append(imgCharacterDiv);
        imgCharacterDiv.append(imgCharactere, infosCharactereBox);
        infosCharactereBox.append(hrefDescription);
        hrefDescription.append(charactereName);

        // CHANGE CSS POUR THEME DARK
        if (on_page_load === "dark") {
          for (let i = 0; i < charactersImg.length; i++) {
            charactersImg[i].style.borderColor = "#eee3e3";
          }
        }
      })
      .catch((err) => (console.error = "Erreur de type : " + err));
  };
}

// RECHERCHE PAR NOM
const HEROSNAME = document.getElementById("herosName");

function request(callback, herosName) {
  let xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      let myJson = JSON.parse(xhr.responseText);
      callback(myJson);
    }
  };

  xhr.open(
    "GET",
    `${APIURL}characters?nameStartsWith=${herosName}&ts=1&apikey=${APIPUBLICKEY}&hash=${HASH}&limit=100`,
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
    hrefDescription.setAttribute("onclick", "setSessionItem(this.textContent)");
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

  if (data.data.results.length === 0) {
    let heroEmpty = document.createElement("p");

    heroEmpty.setAttribute("id", "heroEmpty");
    heroEmpty.textContent = "This hero doesn't exist, try again!";
    IMGBOX.appendChild(heroEmpty);
    // CHANGE CSS POUR THEME DARK
    if (on_page_load === "dark") {
      heroEmpty.style.color = "#eee3e3";
    }
  }

  // CHANGE CSS POUR THEME DARK
  if (on_page_load === "dark") {
    for (let i = 0; i < charactersImg.length; i++) {
      charactersImg[i].style.borderColor = "#eee3e3";
    }
  }
}

function searchHero() {
  let herosName = HEROSNAME.value;
  request(afficherHero, herosName);
}

// VALIDER INPUT AVEC TOUCHE ENTER
if (HEROSNAME) {
  HEROSNAME.addEventListener("keyup", function (e) {
    // console.log("Key" + e.key);
    if (e.key === "Enter") {
      e.preventDefault();
      document.getElementById("btnSearch").click();
    }
  });
}

// FUNCTIONS FOR DESCRIPTION PAGE
// PUT HERO'S NAME IN A SESSION
function setSessionItem(name) {
  localStorage.setItem("nameHero", name);
}

function afficherDetatails(data) {
  // console.log("name hero " + localStorage.getItem("nameHero"));
  let title = document.getElementById("title");
  let comicsList = document.getElementById("comicsList");
  let serieList = document.getElementById("serieList");
  let storiesList = document.getElementById("storiesList");

  // TITLE -> HERO'S NAME
  title.textContent = localStorage.getItem("nameHero");

  // LAST MODIFICATION
  const OPTIONS = {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  };
  let date = new Date(data.data.results[0].modified);
  // console.log(date.toLocaleDateString("en-US", OPTIONS).replace(/, /g, " "))

  // lastModificationDate.textContent = `Last Modification : ${data.data.results[0].modified}`;
  lastModificationDate.textContent = `Last Modification : ${date
    .toLocaleDateString("en-US", OPTIONS)
    .replace(/, /g, " ")}`;

  // URL IMG
  let urlImg = data.data.results[0].thumbnail.path;
  if (
    !(
      urlImg.includes("image_not_available") || urlImg.includes("4c002e0305708")
    )
  ) {
    imgDescriptionPage.setAttribute(
      "src",
      `${urlImg}/portrait_uncanny.${data.data.results[0].thumbnail.extension}`
    );
  } else {
    imgDescriptionPage.setAttribute("src", "../img/inCase2.jpg");
  }

  // DESCRIPTION
  if (data.data.results[0].description) {
    description.textContent = data.data.results[0].description;
  } else {
    description.textContent =
      "A hero with some power. I can't tell you more. Google it!";
  }

  // COMICS - SERIES - STORIES LIST
  // console.log(data.data.results[0].comics.items.length);
  for (let i = 0; i < 20; i++) {
    let liComics = document.createElement("li");
    let liSerie = document.createElement("li");
    let liStory = document.createElement("li");

    // COMICS
    if (data.data.results[0].comics.items.length == 0) {
      comicsList.textContent = "0 Comic Book";
    } else {
      liComics.textContent = data.data.results[0].comics.items[i].name;
      comicsList.append(liComics);
    }

    // SERIES
    if (data.data.results[0].series.items.length == 0) {
      serieList.textContent = "0 Serie";
    } else {
      liSerie.textContent = data.data.results[0].series.items[i].name;
      serieList.append(liSerie);
    }

    // STORIES
    if (data.data.results[0].stories.items.length == 0) {
      storiesList.textContent = "0 Story";
    } else {
      liStory.textContent = `${data.data.results[0].stories.items[i].name} - Type : ${data.data.results[0].stories.items[i].type}`;
      storiesList.append(liStory);
    }
  }
}
function detailsHeros() {
  let name = localStorage.getItem("nameHero");
  request(afficherDetatails, name);
}

// SWITCH THEME FUNCTION
if (on_page_load === "dark") {
  switcher_theme.checked = true;
  body.style.backgroundColor = "rgb(24, 23, 23)";
  title.style.color = "#eee3e3";
  for (let i = 0; i < titleDescr.length; i++) {
    titleDescr[i].style.color = "#dd2852";
  }
  if (lastModificationDate) {
    lastModificationDate.style.color = "#eee3e3";
  }
  if (pourcentage) {
    pourcentage.style.color = "#eee3e3";
  }
  if (description) {
    description.style.color = "#eee3e3";
  }
  if (listBox) {
    for (let i = 0; i < listBox.length; i++) {
      listBox[i].style.color = "#eee3e3";
    }
  }
  if (imgDescriptionPage) {
    imgDescriptionPage.style.boxShadow =
      "0 10px 55px 5px rgba(255, 255, 255, 0.445)";
  }
}

// ACTIVE CHANGEMENT THEME (TOUCHE *)
document.body.addEventListener("keyup", function (e) {
  // console.log("Key " + e.key);
  if (e.key === "*") {
    e.preventDefault();
    document.getElementById("switch").click();
  }
});

function switch_theme() {
  if (switcher_theme.checked) {
    // STOCK LA VALEUR 'DARK' DANS LA CLE THEME
    localStorage.setItem("theme", "dark");
    // RELOAD POUR AVOIR LE THEME DARK
    switcher_theme.checked = true;
    window.location.reload();
    // test();
  } else {
    // SUPPRIME CLE + VALEUR (theme + 'dark')
    // window.localStorage.clear();
    localStorage.setItem("theme", "light");
    // RELOAD POUR THEME LIGHT
    switcher_theme.checked = false;
    window.location.reload();
  }
}

if (imgDescriptionPage) {
  document
    .getElementById("imgAndDescription")
    .addEventListener("mousemove", moveImg);
  document
    .getElementById("imgAndDescription")
    .addEventListener("mouseleave", function () {
      TweenMax.to(imgDescriptionPage, 2, {
        rotationY: 0,
        rotationX: 0,
        ease: Quad.easeOut,
        transformPerspective: 600,
        transformOrigin: "0 0",
      });
    });
}

function moveImg(e) {
  var decimalX = e.clientX / window.innerWidth - 0.5;
  var decimalY = e.clientY / window.innerHeight - 0.5;
  // console.log(decimalX)

  TweenMax.to(imgDescriptionPage, 0.5, {
    rotationY: 20 * decimalX,
    rotationX: 20 * decimalY,
    ease: Quad.easeOut,
    transformPerspective: 500,
    transformOrigin: "50% 50% -500px",
  });
}
