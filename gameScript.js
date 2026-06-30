const ESTADO_INDEFINIDA = -1; // → estado inicial; el jugador aún no decide si la celda pertenece o no a la figura.
const ESTADO_PINTADA = 1;     // → el jugador determina que la celda forma parte de la figura oculta.
const ESTADO_VACIA = 0;       // → el jugador determina que la celda no forma parte de la figura.



// funciones helper



const aplicarEfectoHover = () => {
  document.querySelectorAll("td.cell").forEach(celda => {
    celda.addEventListener("mouseover", function() {
      const row = celda.dataset.row;
      const col = celda.dataset.col;
      document.querySelectorAll(`td.cell[data-row='${row}']`).forEach(c => {
        if (c.dataset.state != ESTADO_PINTADA) {
          c.style.backgroundColor = 'lightgray';
        }
      });
      document.querySelectorAll(`td.cell[data-col='${col}']`).forEach(c => {
        if (c.dataset.state != ESTADO_PINTADA) {
          c.style.backgroundColor = 'lightgray';
        }
      });
    })



    celda.addEventListener("mouseleave", function() {
      // Volver al color original
      const row = celda.dataset.row;
      const col = celda.dataset.col;

      document.querySelectorAll(`td.cell[data-row='${row}']`).forEach(c => {
        if (c.dataset.state != ESTADO_PINTADA) {
          c.style.backgroundColor = 'white';
        }
      });

      document.querySelectorAll(`td.cell[data-col='${col}']`).forEach(c => {
        if (c.dataset.state != ESTADO_PINTADA) {
          c.style.backgroundColor = 'white';
        }
      });
    })
  })
}


const marcarHintCompleto = (hintCell, hintIndex) => {
  const hints = hintCell.textContent.split(' ').filter(h => h.trim());
  const nuevosHints = hints.map((hint, i) => {
    if (i === hintIndex) {
      return `<span style="text-decoration: line-through; color: gray;">${hint}</span>`;
    }
    return hint;
  });
  hintCell.innerHTML = nuevosHints.join(' ');
}

const obtenerSolucionDesdeDOM = () => {
  const grid = document.getElementById("nonogram-grid");
  const solucionString = grid.dataset.solucion;
  return solucionString.split(';').map(fila => fila.split(',').map(Number));
}

const aplicarSombrasColor = (color) => {
  const grid = document.getElementById("nonogram-grid");
  const celdas = document.querySelectorAll("td.cell");
  const hintsRows = document.querySelectorAll("td.hint-row");
  const hintsColumns = document.querySelectorAll("td.hint-column");
  const gridWidth = parseInt(grid.dataset.width);
  const gridHeight = parseInt(grid.dataset.height);

  hintsRows.forEach(hint => {
    if (hint.dataset.row == 0) {
      // Combinar ambas sombras: izquierda Y arriba
      hint.style.boxShadow = `-3px 0 3px -1px ${color}, 0 -3px 3px -1px ${color}`;
    } else if (hint.dataset.row == (gridHeight - 1)) {
      // Sombra izquierda Y abajo
      hint.style.boxShadow = `-3px 0 3px -1px ${color}, 0 3px 3px -1px ${color}`;
    } else {
      // Solo sombra izquierda
      hint.style.boxShadow = `-3px 1px 3px -1px ${color}`;
    }
  });

  hintsColumns.forEach(hint => {
    if (hint.dataset.col == 0) {
      hint.style.boxShadow = `0 -3px 3px -1px ${color}, -3px 0 3px -1px ${color}`;
    }
    else if (hint.dataset.col == gridWidth - 1) {
      hint.style.boxShadow = `0 -3px 3px -1px ${color}, 3px 0 3px -1px ${color}`;
    }
    else {
      hint.style.boxShadow = `0 -3px 3px -1px ${color}`;
    }
  });

  celdas.forEach(celda => {
    const row = parseInt(celda.dataset.row);
    const col = parseInt(celda.dataset.col);

    if (row == 0 && col == 0) {
      celda.style.boxShadow = 'none';
    }
    else if (row == 0 && col == gridWidth - 1) {
      celda.style.boxShadow = `3px 0 3px -1px ${color}`;
    }
    else if (row == gridHeight - 1 && col == 0) {
      celda.style.boxShadow = `0px 3px 3px -1px ${color}`;
    }
    else if (row == gridHeight - 1 && col == gridWidth - 1) {
      celda.style.boxShadow = `0 3px 3px -1px ${color}, 3px 0 3px -1px ${color}`;
    }
    else if (row == 0) {
      celda.style.boxShadow = 'none';
    }
    else if (row == gridHeight - 1) {
      celda.style.boxShadow = `0 3px 3px -1px ${color}`;
    }
    else if (col == 0) {
      celda.style.boxShadow = 'none';
    }
    else if (col == gridWidth - 1) {
      celda.style.boxShadow = `3px 0 3px -1px ${color}`;
    }
    else {
      celda.style.boxShadow = 'none';
    }
  });
}

const darHint = () => {
  const solucion = obtenerSolucionDesdeDOM();
  const estadoActual = obtenerEstadoActual();

  const filaIndices = Array.from({ length: solucion.length }, (_, i) => i)
    .sort(() => Math.random() - 0.5);

  const reveloAlguna = filaIndices.some(row => {
    const colIndices = Array.from({ length: solucion[row].length }, (_, i) => i)
      .sort(() => Math.random() - 0.5);

    return colIndices.some(col => {
      const valorSolucion = solucion[row][col];
      if (valorSolucion === ESTADO_PINTADA && estadoActual[row][col] !== ESTADO_PINTADA) {
        const celda = document.querySelector(`td.cell[data-row='${row}'][data-col='${col}']`);
        celda.dataset.state = ESTADO_PINTADA;
        celda.style.backgroundColor = 'black';
        celda.innerHTML = "";
        const pistaCounter = document.getElementById("pista-counter");
        pistaCounter.textContent = parseInt(pistaCounter.textContent) + 1;
        return true;
      }
      if (valorSolucion === ESTADO_VACIA && estadoActual[row][col] !== ESTADO_VACIA) {
        const celda = document.querySelector(`td.cell[data-row='${row}'][data-col='${col}']`);
        celda.dataset.state = ESTADO_VACIA;
        celda.style.backgroundColor = 'white';
        celda.innerHTML = "&#10060;";
        celda.style.color = 'red';
        const pistaCounter = document.getElementById("pista-counter");
        pistaCounter.textContent = parseInt(pistaCounter.textContent) + 1;
        return true;
      }
      return false;
    });
  });

  if (!reveloAlguna) {
    alert("Ya se dieron todas las pistas");
    document.getElementById("solve-button").disabled = true
  }

  actualizarBarraProgrso();
}
const contarCeldasPintadasCorrectamente = (solucion) => {
  const celdas = document.querySelectorAll("td.cell");

  const pintadasCorrectamente = Array.from(celdas).filter(celda => {
    const row = parseInt(celda.dataset.row);
    const col = parseInt(celda.dataset.col);
    return celda.dataset.state == ESTADO_PINTADA && solucion[row][col] == ESTADO_PINTADA;
  });

  return pintadasCorrectamente.length;
};

const contarCeldasPintadasCorrectas = (solucion) => {
  const celdasPintadas = solucion.flat().filter(celda => 
    celda == ESTADO_PINTADA
  );

  return celdasPintadas.length
}

const actualizarBarraProgrso = () => {
  const solucion = obtenerSolucionDesdeDOM();
  const celdasTotales = contarCeldasPintadasCorrectas(solucion);
  const celdasCorrectasPintadas = contarCeldasPintadasCorrectamente(solucion);
  const porcentaje = parseInt((celdasCorrectasPintadas/celdasTotales)*100);
  const progressBar = document.getElementById("progress-bar");
  progressBar.value = porcentaje;
}

const botonesControl = () => {
  const botonVerificar = document.getElementById("verify-button");
  const botonResolver = document.getElementById("solve-button");
  const botonReiniciar = document.getElementById("reset-button");
  const botonHint = document.getElementById("hint-button")
  botonVerificar.addEventListener("click", function() {
    const estadoActual = obtenerEstadoActual();
    const verificacion = compararMatrices(estadoActual, obtenerSolucionDesdeDOM());
    if (verificacion) {
      stopTimer();
      alert(`¡Felicidades! Has resuelto el nonograma correctamente en ${document.getElementById("timer").textContent} segundos`);
      aplicarSombrasColor("gold")
    
    } else {
      alert("La solución no es correcta. ¡Sigue intentando!");
      aplicarSombrasColor("red")
    }
  });
  botonResolver.addEventListener("click", function() {
    const solucion = obtenerSolucionDesdeDOM();
    aplicarMatrizAJuego(solucion);
    botonVerificar.disabled = true;
    botonResolver.disabled = true;
  });
  botonReiniciar.addEventListener("click", function() {
    location.reload();
    const cells = document.querySelectorAll("td.cell");
    cells.forEach(cell => {
      cell.classList.remove("error-icon")
    })

  });
  botonHint.addEventListener("click", function() {
    darHint()
  });
}


const celdaEsCorrecta = (row, col) => {
  const celda = document.querySelector(`td.cell[data-col='${col}'][data-row='${row}']`);
  const solucion = obtenerSolucionDesdeDOM();

  const estadoCelda = parseInt(celda.dataset.state);
  
  const celdaCorrecta = solucion[row][col];

  return (estadoCelda === ESTADO_PINTADA && celdaCorrecta === ESTADO_PINTADA) ||
    (estadoCelda === ESTADO_VACIA && celdaCorrecta === ESTADO_VACIA);

}

const corregirCelda = (celda) => {
  const matriz = obtenerSolucionDesdeDOM();
  const row = parseInt(celda.dataset.row);
  const col = parseInt(celda.dataset.col);

  celda.dataset.state = parseInt(matriz[row][col])
}

const corregirClick = (celda) => {
  const autoCorrection = document.getElementById("auto-correction-chkbx");
  const errorCounter = document.getElementById("error-counter")
  
  if (!autoCorrection || !autoCorrection.checked) {
    return;
  }

  const row = parseInt(celda.dataset.row);
  const col = parseInt(celda.dataset.col);

  if (!celdaEsCorrecta(row, col)) {
    // alert("Incorrecto");
    errorCounter.textContent = parseInt(errorCounter.textContent) + 1;
    celda.classList.add('error-icon');
    corregirCelda(celda);
    corregirVisionCelda(celda);
  }

}

const corregirVisionCelda = (celda) => {
  const estado = parseInt(celda.dataset.state);
  
  if (estado === ESTADO_PINTADA) {
    celda.style.backgroundColor = 'black';
    celda.innerHTML = "";
  } else if (estado === ESTADO_VACIA) {
    celda.style.backgroundColor = 'white';
    celda.innerHTML = "&#10060;";
    celda.style.color = 'red';
  } else {
    celda.style.backgroundColor = 'white';
    celda.innerHTML = "";
  }
}

const actualizarTimer = () => {
  if (document.getElementById("seconds").dataset.active == "true") {
    const secondsElement = document.getElementById("seconds");
    const timerElement = document.getElementById("timer");

    const currentSeconds = parseInt(secondsElement.textContent) + 1;
    secondsElement.textContent = currentSeconds;
    timerElement.textContent = currentSeconds;
  }
}

const aplicarTimer = () => {
  const secondsElement = document.getElementById("seconds");
  secondsElement.textContent = "0";

  setInterval(actualizarTimer, 1000);
}

const stopTimer = () => {
  document.getElementById("seconds").dataset.active = "false"
}


const aplicarRClickevent = () => {
  const matriz = document.getElementById("nonogram-grid");
  matriz.addEventListener("contextmenu", function(event) {
    event.preventDefault();
  });
  document.querySelectorAll("td.cell").forEach(celda => {
    celda.addEventListener("contextmenu", function(event) {
      event.preventDefault();

      if (celda.classList.contains('error-icon')) {
        return;
      }

      if (celda.dataset.state == ESTADO_VACIA) {
        celda.dataset.state = ESTADO_INDEFINIDA;
        celda.style.backgroundColor = 'white';
        celda.innerHTML = "";
      } else {
        celda.dataset.state = ESTADO_VACIA;
        celda.style.backgroundColor = 'white';
        celda.innerHTML = "&#10060";
        celda.style.color = 'red';
        corregirClick(celda);
      }

      actualizarBarraProgrso();
    });

  });
}

const aplicarLClickevent = () => {
    document.querySelectorAll("td.cell").forEach(celda => {
    celda.addEventListener("click", function(event) {
      event.preventDefault();

      if (celda.classList.contains('error-icon')) {
        return;
      }

      if (celda.dataset.state == ESTADO_PINTADA) {
        celda.dataset.state = ESTADO_INDEFINIDA;
        celda.style.backgroundColor = 'white';
        celda.innerHTML = "";
      }
      else {
        celda.dataset.state = ESTADO_PINTADA;
        celda.style.backgroundColor = 'black';
        celda.innerHTML = "";
        corregirClick(celda);
      }

      const verificacion = compararMatrices(obtenerEstadoActual(), obtenerSolucionDesdeDOM());
      if (verificacion) {
        stopTimer();
        alert(`¡Felicidades! Has resuelto el nonograma correctamente en ${document.getElementById("timer").textContent} segundos`);
        aplicarSombrasColor("gold")
      }
      
      actualizarBarraProgrso();
    });
  });
}

const obtenerEstadoActual = () => {
  const grid = document.getElementById("nonogram-grid");
  const width = parseInt(grid.dataset.width);
  const height = parseInt(grid.dataset.height);

  const estadoActual = Array(height).fill().map(() => Array(width).fill(ESTADO_INDEFINIDA));

  document.querySelectorAll("td.cell").forEach(celda => {
    const row = parseInt(celda.dataset.row);
    const col = parseInt(celda.dataset.col);
    const state = parseInt(celda.dataset.state);
    estadoActual[row][col] = state;
  });

  return estadoActual;
}

const compararMatrices = (estadoActual, solucion) => {
  if (estadoActual.length !== solucion.length) return false;
  if (estadoActual[0].length !== solucion[0].length) return false;

  return estadoActual.every((fila, rowIndex) =>
    fila.every((valor, colIndex) => {
      const valorSolucion = solucion[rowIndex][colIndex];
      const esPintadaEnSolucion = valorSolucion === ESTADO_PINTADA;
      const esPintadaEnActual = valor === ESTADO_PINTADA;

      return esPintadaEnSolucion === esPintadaEnActual;
    })
  );
}

const celdasLlenasSeguidas = (fila) => {
  const filaString = fila.map(valor => valor === ESTADO_PINTADA ? '1' : '0').join('');
  const grupos = filaString.split('0').filter(grupo => grupo.length > 0);
  return grupos.map(grupo => grupo.length);
}

const asegurarFilaConCelda = (fila) => {
  if (fila.some(valor => valor === 1)) {
    return fila;
  }
  const posicionAleatoria = Math.floor(Math.random() * fila.length);

  return fila.map((valor, indice) => {
    if (indice === posicionAleatoria) {
      return 1;
    }
    return valor;
  });
};

const asegurarColumnaConCelda = (columna) => {
  if (columna.some(valor => valor === 1)) {
    return columna;
  }
  const posicionAleatoria = Math.floor(Math.random() * columna.length);

  return columna.map((valor, indice) => {
    if (indice === posicionAleatoria) {
      return 1;
    }
    return valor;
  });
}

const numeroRandom = (dificultad) => {
  if (dificultad === 'facil') {
    return Math.random() < 0.3 ? ESTADO_VACIA : ESTADO_PINTADA;
  } else if (dificultad === 'medio') {
    return Math.random() < 0.5 ? ESTADO_VACIA : ESTADO_PINTADA;
  } else if (dificultad === 'dificil') {
    return Math.random() < 0.7 ? ESTADO_VACIA : ESTADO_PINTADA;
  } else {
    return Math.random() < 0.7 ? ESTADO_VACIA : ESTADO_PINTADA; //facil por defecto
  }
} 
function volverAlMenu() {
  const boton = document.getElementById("menu-button");
  boton.addEventListener("click", function() {
    location.href = "index.html";
  });
}
const obtenerParametros = () => {
  const params = new URLSearchParams(window.location.search);
  return {
    difficulty: params.get('difficulty'),
    width: parseInt(params.get('width')),
    height: parseInt(params.get('height'))
  };
};
const crearCelda = (row, col) => {
  const td = document.createElement("td");
  td.classList.add("cell");
  td.dataset.row = row;
  td.dataset.col = col;
  return td;
};
const crearMapaCeros = (width, height) => {
  return Array(height).fill().map(() => Array(width).fill(ESTADO_INDEFINIDA));
};
const aplicarMatrizAJuego = (matriz) => {
  matriz.forEach((fila, rowIndex) => {
    fila.forEach((valor, colIndex) => {
      const celda = document.querySelector(`td.cell[data-row='${rowIndex}'][data-col='${colIndex}']`);
      celda.dataset.state = valor;
      celda.style.backgroundColor = valor === ESTADO_PINTADA ? 'black' : valor === ESTADO_INDEFINIDA ? 'white' : 'lightgray';
      if (celda.dataset.state == ESTADO_VACIA) {
        celda.innerHTML = "&#10060";
        celda.style.color = 'red';
      }
    });

  });
}

//                                                                                                       Guarda la solucion en DOM
const generarSolucion = (width, height, dificultad) => {
  const verificado1 =  Array(height).fill().map(() =>
    Array(width).fill().map(() =>
      numeroRandom(dificultad)
    )
  ).map(fila => asegurarFilaConCelda(fila));

  const columnas = Array(width).fill().map((_, i) => i);
  
  return columnas.reduce((m, col) => {
    const columnaActual = m.map(fila => fila[col]);
    const columnaArreglada = asegurarColumnaConCelda(columnaActual);
    
    return m.map((fila, row) => 
      fila.map((valor, c) => c === col ? columnaArreglada[row] : valor)
    );
  }, verificado1);
}

const guardarSolucionEnDOM = (solucion, width, height) => {
  const grid = document.getElementById("nonogram-grid");
  grid.dataset.solucion = solucion.map(fila => fila.join(',')).join(';');
  grid.dataset.width = width;
  grid.dataset.height = height;
  return solucion;
};


// guardar grilla de juego
const crearCeldaHint = (tipo, contenido = '', row = null, col = null) => {
  const td = document.createElement("td");
  td.classList.add("hint-cell", `hint-${tipo}`);
  td.textContent = contenido;
  if (row !== null) td.dataset.row = row;
  if (col !== null) td.dataset.col = col;
  return td;
};

const crearFilaHintsSuperiores = (width) => {
  const tr = document.createElement("tr");
  tr.classList.add("hints-row");
  
  tr.appendChild(crearCeldaHint('corner')); //vacio

  Array.from({length: width}, (_, col) => {
    const hint = crearCeldaHint('column', 'X', -1, col); //placeholder 
    tr.appendChild(hint);
  });
  
  return tr;
};


const crearFilaJuego = (rowIndex, width) => {
  const tr = document.createElement("tr");
  tr.classList.add("game-row");
  
  tr.appendChild(crearCeldaHint('row', 'Y', rowIndex, -1)); //placeholder
  
  Array.from({length: width}, (_, col) => {
    const celda = crearCelda(rowIndex, col);
    tr.appendChild(celda);
  });
  
  return tr;
};

const dibujarGrid = (width, height) => {
  const grid = document.getElementById("nonogram-grid");
  const tabla = document.createElement("table");
  tabla.classList.add("nonogram-table");
  
  //fila hints superiores
  tabla.appendChild(crearFilaHintsSuperiores(width));
  
  //fila juego
  Array.from({length: height}, (_, row) => {
    const fila = crearFilaJuego(row, width);
    tabla.appendChild(fila);
  });
  
  grid.innerHTML = '';
  grid.appendChild(tabla);
  
  console.log(`Grid con hints creada: ${width}x${height}`);
};

const aplicarMapa = (mapa) => {
  mapa.forEach((fila, rowIndex) => {
    fila.forEach((valor, colIndex) => {
      const celda = document.querySelector(`td.cell[data-row='${rowIndex}'][data-col='${colIndex}']`);
      celda.dataset.state = valor;
      // celda.style.color = 'transparent'; //ocultar valores
      // celda.style.backgroundColor = '#ffffff'; //fondo que debe variar segun el valor que depende de la logica del juego
    });
  });
}


// hints
const calcularHintsFilas = (solucion) => {
  solucion.forEach((fila, rowIndex) => {
    const hintCelda = document.querySelector(`td.hint-row[data-row='${rowIndex}']`);
    const hints = celdasLlenasSeguidas(fila);
    hintCelda.textContent = hints.join(' ');
  });
}

const calcularHintsColumnas = (solucion) => {
  const width = solucion[0].length;
  
  Array(width).fill().forEach((_, col) => {
    const columna = solucion.map(fila => fila[col]);
    const hints = celdasLlenasSeguidas(columna);
    const hintCelda = document.querySelector(`td.hint-column[data-col='${col}']`);
    
    if (hintCelda) {
      hintCelda.textContent = hints.join(' ');
    }
  });
};




// main
document.addEventListener('DOMContentLoaded', () => {
  const parametros = obtenerParametros();
  console.log("Parametros:", parametros);

  dibujarGrid(parametros.width, parametros.height);
  volverAlMenu();
  const mapaCeros = crearMapaCeros(parametros.width, parametros.height);
  aplicarMapa(mapaCeros);
  const solucion = generarSolucion(parametros.width, parametros.height, parametros.difficulty);

  guardarSolucionEnDOM(solucion, parametros.width, parametros.height);
  // aplicarMatrizAJuego(solucion); //aplicar solucion para debug
  botonesControl();
  aplicarRClickevent();
  aplicarLClickevent();
  calcularHintsFilas(solucion);
  calcularHintsColumnas(solucion);
  aplicarEfectoHover();
  aplicarTimer();
  console.log("Solucion generada:", solucion);
});