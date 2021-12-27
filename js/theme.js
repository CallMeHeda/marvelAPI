let switcher_theme = document.getElementById("switch");
let body = document.getElementById('body');

let on_page_load = localStorage.getItem("theme") || "";
if (on_page_load != null && on_page_load === "dark") {
  switcher_theme.checked = true;
  body.style.backgroundColor = "black";
}

function switch_theme() {
  if (switcher_theme.checked) {
    // STOCK LA VALEUR 'DARK' DANS LA CLE THEME
    localStorage.setItem("theme", "dark");
    // RELOAD POUR AVOIR LE THEME DARK
    window.location.reload();
    switcher_theme.checked = true;
  } else {
    // SUPPRIME CLE + VALEUR (theme + 'dark')
    window.localStorage.clear();
    // RELOAD POUR THEME LIGHT
    window.location.reload();
    switcher_theme.checked = false;
  }
}
