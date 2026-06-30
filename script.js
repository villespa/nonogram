function iniciarJuego() {
  const boton = document.getElementById("start-button");
  boton.addEventListener("click", function(event) {
    console.log(obtenerDatos());
    console.log(...Object.values(obtenerDatos()));
    location.href = crearUrl(...Object.values(obtenerDatos()));
  });
}

const obtenerDatos = () => ({
    difficulty: document.getElementById("diff-selector").value,
    width: tamanoInt(document.getElementById("diff-tamano").value).width,
    height: tamanoInt(document.getElementById("diff-tamano").value).height
});

const crearUrl = (difficulty, width, height) => `game.html?difficulty=${difficulty}&width=${width}&height=${height}`;

const tamanoInt = (size) => {
  const dato = size.split("x");
  return {width: parseInt(dato[0]), height: parseInt(dato[1])}
}; 


document.addEventListener("DOMContentLoaded", function() {
  iniciarJuego();
});