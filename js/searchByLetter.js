// NAVIGATION ALPHABETIQUE
// const AZ = "abcdefghijklmnopqrstuvwxyz"
//   .toUpperCase()
//   .replace(/([A-Z])/g, "$1 - ")
//   .slice(0, -2);

const AZ = [
  { letter: "A" },
  { letter: "B" },
  { letter: "C" },
  { letter: "D" },
  { letter: "E" },
  { letter: "F" },
  { letter: "G" },
  { letter: "H" },
  { letter: "I" },
  { letter: "J" },
  { letter: "K" },
  { letter: "L" },
  { letter: "M" },
  { letter: "N" },
  { letter: "O" },
  { letter: "P" },
  { letter: "Q" },
  { letter: "R" },
  { letter: "S" },
  { letter: "T" },
  { letter: "U" },
  { letter: "V" },
  { letter: "W" },
  { letter: "X" },
  { letter: "Y" },
  { letter: "Z" },
];

const ALPHABET_DIV = document.getElementById("alphabet");

AZ.forEach((item, i) => {
  item.id = `letter${i + 1}`;
});

AZ.forEach((element) => ALPHABET_DIV.append(element.letter));

// AZ.forEach((element) => hoverLetter(element.id));

// function hoverLetter(letter){
//   console.log(letter);
// }

console.log(AZ);
console.log(AZ.length);
