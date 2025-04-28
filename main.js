let tablero = [];
let historial = [];
let tamañoTablero = 30;
let estaEjecutando = false;
let intervaloEjecucion;
function inicializarTablero() {
    tamañoTablero = parseInt(document.getElementById('tamañoTablero').value);
    tablero = Array(tamañoTablero).fill().map(() => Array(tamañoTablero).fill(0));
    historial = [JSON.parse(JSON.stringify(tablero))];
    dibujarTablero();
}
function inicializarAleatorio() {
    tamañoTablero = parseInt(document.getElementById('tamañoTablero').value);
    tablero = Array(tamañoTablero).fill().map(() => 
        Array(tamañoTablero).fill().map(() => 
            Math.random() > 0.7 ? 1 : 0  // 30% de probabilidad de estar viva
        )
    );
    historial = [JSON.parse(JSON.stringify(tablero))];
    dibujarTablero();
}

  
function dibujarTablero() {
    const elementoTablero = document.getElementById('tablero');
    elementoTablero.style.setProperty('--columnas', tamañoTablero);
    elementoTablero.innerHTML = '';

    for (let fila = 0; fila < tamañoTablero; fila++) {
        for (let columna = 0; columna < tamañoTablero; columna++) {
            const celda = document.createElement('div');
            celda.className = `celda ${tablero[fila][columna] ? 'viva' : ''}`;
            celda.addEventListener('click', () => {
                tablero[fila][columna] = tablero[fila][columna] ? 0 : 1;
                celda.className = `celda ${tablero[fila][columna] ? 'viva' : ''}`;
                historial = [JSON.parse(JSON.stringify(tablero))];
            });
            elementoTablero.appendChild(celda);
        }
    }
}

function siguienteGeneracion() {
    const nuevoTablero = Array(tamañoTablero).fill().map(() => Array(tamañoTablero).fill(0));

    for (let fila = 0; fila < tamañoTablero; fila++) {
        for (let columna = 0; columna < tamañoTablero; columna++) {
            const vecinos = contarVecinos(fila, columna);
            if (tablero[fila][columna] === 1) {
                nuevoTablero[fila][columna] = (vecinos === 2 || vecinos === 3) ? 1 : 0;
            } else {
                nuevoTablero[fila][columna] = (vecinos === 3) ? 1 : 0;
            }
        }
    }

    tablero = nuevoTablero;
    historial.push(JSON.parse(JSON.stringify(tablero)));
    if (historial.length > 100) historial.shift();
    dibujarTablero();
}

function contarVecinos(fila, columna) {
    let cuenta = 0;
    for (let df = -1; df <= 1; df++) {
        for (let dc = -1; dc <= 1; dc++) {
            if (df === 0 && dc === 0) continue;
            const nf = fila + df;
            const nc = columna + dc;
            if (nf >= 0 && nf < tamañoTablero && nc >= 0 && nc < tamañoTablero && tablero[nf][nc] === 1) {
                cuenta++;
            }
        }
    }
    return cuenta;
}

function generacionAnterior() {
    if (historial.length > 1) {
        historial.pop();
        tablero = JSON.parse(JSON.stringify(historial[historial.length - 1]));
        dibujarTablero();
    }
}

function alternarEjecucion() {
    estaEjecutando = !estaEjecutando;
    document.getElementById('playPause').textContent = estaEjecutando ? 'Pausar' : 'Iniciar';
    if (estaEjecutando) {
        intervaloEjecucion = setInterval(siguienteGeneracion, 200);
    } else {
        clearInterval(intervaloEjecucion);
    }
}

function limpiarTablero() {
    tablero = Array(tamañoTablero).fill().map(() => Array(tamañoTablero).fill(0));
    historial = [JSON.parse(JSON.stringify(tablero))];
    dibujarTablero();
    if (estaEjecutando) alternarEjecucion();
}

window.onload = inicializarTablero;