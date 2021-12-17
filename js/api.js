const APIURL = "http://gateway.marvel.com/v1/public/";
const APIPUBLICKEY = "d4509d8741ad3378f24fb6b93f84b6aa";
// 1 () + PRIVATE KEY + PUBLIC KEY
const HASH = md5(
  "176ade49434b3426ff16e9e83fe5c952f4825f6d6d4509d8741ad3378f24fb6b93f84b6aa"
);
// const HASH = md5("PRIVATEKEYPUBLICKEY");

console.log(HASH);

// function request(callback) {
//   let xhr = new XMLHttpRequest();

//   xhr.onreadystatechange = function () {
//     if (xhr.readyState == 4 && xhr.status == 200) {
//       let myJson = JSON.parse(xhr.responseText);
//       callback(myJson);
//     } else {
//       console.log(xhr.status + " | " + xhr.readyState);
//     }
//   };

//   xhr.open("GET", `${APIURL}characters?ts=1&apikey=${APIPUBLICKEY}&hash=${HASH}`, true);
//   xhr.send();
// }

// function afficherCharacter(data) {
//   console.log(data);
// }

// function rechercherCharacter() {
//   request(afficherCharacter);
// }

//Effectues la requête à l'url suivante
fetch(`${APIURL}characters?ts=1&apikey=${APIPUBLICKEY}&hash=${HASH}`)
  // THEN RETOURNE LE RESULTAT EN JSON EN CAS DE REUSSITE
  .then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      // SI PAS REUSSI
      throw new Error("Requête n'a pas abouti");
    }
  })
  // function plusieurs lignes - sans function une seule ligne
  .then(function (data) {
    console.log(data);
    document.getElementById("marvel").textContent =
      data.data.results[0].comics.items[0].name;
  })
  .catch((err) => (console.error = "Erreur de type : " + err));
